import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import { CalorieEstimate } from '../types';

const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a nutrition estimation assistant. Given a food description, parse each food item and estimate its calories, protein (g), carbs (g), and fat (g) assuming typical American portion sizes.

Return ONLY valid JSON in this exact format, with no other text:
{
  "items": [
    { "name": "food name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
  ],
  "totalCalories": 0
}

totalCalories must equal the sum of all item calories. Be reasonable with portion estimates.`;

async function parseResponse(text: string): CalorieEstimate {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }
  const parsed = JSON.parse(jsonMatch[0]) as CalorieEstimate;
  if (!parsed.items || !Array.isArray(parsed.items) || typeof parsed.totalCalories !== 'number') {
    throw new Error('Invalid response structure');
  }
  return parsed;
}

export async function estimateCalories(description: string): Promise<CalorieEstimate> {
  if (!description || !description.trim()) {
    throw new Error('Food description is required');
  }

  const truncated = description.slice(0, 500);

  for (let attempt = 0; attempt < 2; attempt++) {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      temperature: 0,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: truncated }],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      if (attempt === 1) throw new Error('No text response from Claude');
      continue;
    }

    try {
      return await parseResponse(textBlock.text);
    } catch (parseError) {
      if (attempt === 1) {
        throw new Error('Failed to parse calorie estimate after retry');
      }
    }
  }

  throw new Error('Failed to estimate calories');
}
