import createClient from '../config/models';
import type { ModelConfig } from '../config/models';

export class ChatService {
  private currentModelId: string;
  private client!: ReturnType<typeof createClient>['client'];

  constructor(initialModelId: string = 'claude-3-sonnet') {
    this.currentModelId = initialModelId;
    this.initializeClient();
  }

  private initializeClient() {
    const clientObj = createClient(this.currentModelId);
    this.client = clientObj.client;
  }

  async sendMessage(message: string) {
    try {
      console.log('Sending message to model:', this.currentModelId);
      const { client, model } = createClient(this.currentModelId);
      const completion = await client.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: message }],
        stream: false
      });

      if (!completion.choices[0]?.message?.content) {
        throw new Error('No response from model');
      }

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }

  setModel(modelId: string) {
    console.log('Setting model to:', modelId);
    this.currentModelId = modelId;
    this.initializeClient();
  }
}
