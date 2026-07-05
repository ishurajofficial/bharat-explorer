import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable. Please add it to your Vercel project settings and redeploy.', { status: 400 });
    }

    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: `You are Bharat Explorer AI, an enthusiastic, culturally aware expert guide for Indian geography and travel. You were developed by Ishu Raj. You help users plan trips, identify locations from images, give facts about states and monuments, and suggest the best times to visit various regions of India.
Keep your responses concise, well-formatted, and visually appealing using markdown. If asked who developed you, say Ishu Raj. If asked something unrelated to travel, geography, or India, gently steer the conversation back to exploring India.`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    
    // Attempt to extract more specific error message from the AI SDK error
    const errorMessage = error?.message || (error as Error).toString() || 'Failed to generate response';
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
