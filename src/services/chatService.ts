import { modelConfigs } from '../config/models';

export async function sendChatMessage(messages: any[], model: string) {
  const modelConfig = modelConfigs[model];
  if (!modelConfig) {
    throw new Error(`Invalid model configuration for ${model}`);
  }

  const apiUrl = import.meta.env.DEV 
    ? 'http://localhost:3002/api/chat'
    : '/api/chat';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      messages,
      model
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}
