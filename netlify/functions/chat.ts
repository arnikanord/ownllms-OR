import { Handler } from '@netlify/functions';
import createClient, { modelConfigs } from '../../src/config/models';

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages, model } = JSON.parse(event.body || '{}');

    // Validate request body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid messages format',
          details: 'Messages must be a non-empty array of message objects'
        })
      };
    }

    // Validate message format
    const isValidMessage = messages.every(msg => 
      msg && typeof msg === 'object' && 
      typeof msg.role === 'string' && 
      typeof msg.content === 'string'
    );
    
    if (!isValidMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid message format',
          details: 'Each message must have a role (string) and content (string)'
        })
      };
    }

    // Validate model parameter
    if (!model || typeof model !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Model parameter is required',
          details: 'Model must be a valid string identifier'
        })
      };
    }

    // Validate model exists
    const modelConfig = modelConfigs[model];
    if (!modelConfig) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid model ID',
          details: `Model '${model}' is not supported`
        })
      };
    }

    // Create client and make request
    const { client, type } = createClient(model);
    console.log('Using model:', model);

    const completion = await client.chat.completions.create({
      model: modelConfig.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from model');
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'assistant',
        content: completion.choices[0].message.content
      })
    };

  } catch (error: any) {
    console.error('Error in chat function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process request',
        details: error.message
      })
    };
  }
}; 