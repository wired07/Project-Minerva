// Test file to verify Gemini API integration
import { generateText } from './gemini';

export async function testGeminiConnection(): Promise<boolean> {
  try {
    const result = await generateText('Hello, can you respond with "AI Tutor is working!"?');
    return result.success && result.text.includes('AI Tutor is working');
  } catch (error) {
    console.error('Gemini test failed:', error);
    return false;
  }
}
