import { modelConfigs } from '../../../config/models';

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json();

    // Validate request body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid messages format',
        details: 'Messages must be a non-empty array of message objects'
      }), { status: 400 });
    }

    // Validate model exists
    const modelConfig = modelConfigs[model];
    if (!modelConfig) {
      return new Response(JSON.stringify({ 
        error: 'Invalid model ID',
        details: `Model '${model}' is not supported`
      }), { status: 400 });
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, model }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request',
      details: error.message
    }), { status: 500 });
  }
} 