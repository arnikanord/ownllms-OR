import { OpenAI } from 'openai';
import createClient from '@/config/models';

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json();
    const { client, type } = createClient(model);

    const completion = await client.chat.completions.create({
      model: model,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    });

    return new Response(JSON.stringify({
      role: 'assistant',
      content: completion.choices[0].message.content
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 