import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  PORT: parseInt(process.env.PORT || '8080', 10),
  ANTHROPIC_API_KEY: requireEnv('ANTHROPIC_API_KEY'),
  GOOGLE_CLOUD_PROJECT: requireEnv('GOOGLE_CLOUD_PROJECT'),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
