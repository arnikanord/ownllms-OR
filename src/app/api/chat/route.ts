import { OpenAI } from 'openai';
import createClient, { modelConfigs, ModelConfig } from '@/config/models';

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json();
    
    // Find the model ID from the full model name
    const modelId = Object.entries(modelConfigs).find(
      ([_, config]: [string, ModelConfig]) => config.model === model
    )?.[0];

    if (!modelId) {
      return new Response(JSON.stringify({ error: `Invalid model: ${model}` }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const { client, type } = createClient(modelId);

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