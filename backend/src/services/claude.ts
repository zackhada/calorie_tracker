import { VertexAI } from '@google-cloud/vertexai';
import { config } from '../config';
import { CalorieEstimate } from '../types';

const vertexAI = new VertexAI({
  project: config.GOOGLE_CLOUD_PROJECT,
  location: 'us-central1',
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-pro',
  generationConfig: {
    temperature: 0,
    maxOutputTokens: 2048,
  },
  systemInstruction: `You are a nutrition estimation assistant. Given a food description, parse each food item and estimate its calories, protein (g), carbs (g), and fat (g) assuming typical American portion sizes.

Return ONLY valid JSON in this exact format:
{
  "items": [
    { "name": "food name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
  ],
  "totalCalories": 0
}

totalCalories must equal the sum of all item calories. Be reasonable with portion estimates.`,
});

function parseResponse(text: string): CalorieEstimate {
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
    const result = await model.generateContent(truncated);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      if (attempt === 1) throw new Error('No text response from Gemini');
      continue;
    }

    try {
      return parseResponse(text);
    } catch (parseError) {
      if (attempt === 1) {
        throw new Error('Failed to parse calorie estimate after retry');
      }
    }
  }

  throw new Error('Failed to estimate calories');
}
