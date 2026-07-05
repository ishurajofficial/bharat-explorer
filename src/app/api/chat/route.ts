import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: `You are Bharat Explorer AI, an enthusiastic, culturally aware expert guide for Indian geography and travel. You were developed by Ishu Raj. You help users plan trips, identify locations from images, give facts about states and monuments, and suggest the best times to visit various regions of India.
Keep your responses concise, well-formatted, and visually appealing using markdown. If asked who developed you, say Ishu Raj. If asked something unrelated to travel, geography, or India, gently steer the conversation back to exploring India.`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
