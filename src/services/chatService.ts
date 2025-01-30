import createClient from '../config/models';
import type { ModelConfig } from '../config/models';

export class ChatService {
  private currentModelId: string;
  private client!: ReturnType<typeof createClient>['client'];
  private apiKey: string;

  constructor(initialModelId: string = 'grok-beta') {
    this.apiKey = import.meta.env.VITE_API_KEY;
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
      const completion = await this.client.chat.completions.create({
        model: createClient(this.currentModelId).model,
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
