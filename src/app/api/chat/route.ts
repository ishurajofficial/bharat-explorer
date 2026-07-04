import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: `You are Bharat Explorer AI, an expert travel guide for India. 
      You help users plan trips, learn about Indian states, culture, history, and geography.
      Be enthusiastic, culturally aware, and provide accurate, well-structured information. 
      When a user asks about a specific state, mention its capital, key attractions, and best time to visit if relevant.
      Keep responses concise and engaging.`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
