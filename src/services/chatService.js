import { modelConfigs, createClient } from '../config/models.js';

export class ChatService {
    constructor(modelId) {
        this.setModel(modelId);
    }

    setModel(modelId) {
        this.modelConfig = modelConfigs[modelId];
        const { client, type } = createClient(modelId);
        this.client = client;
        this.clientType = type;
    }

    async sendMessage(message, files = []) {
        try {
            const messages = this.prepareMessages(message, files);
            
            switch (this.clientType) {
                case 'openai':
                    return await this.handleOpenAIRequest(messages);
                case 'anthropic':
                    return await this.handleAnthropicRequest(messages);
                case 'together':
                    return await this.handleTogetherRequest(messages);
                default:
                    throw new Error(`Unsupported client type: ${this.clientType}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    prepareMessages(message, files) {
        const baseMessages = [
            {
                role: "system",
                content: "You are an AI assistant who knows everything."
            },
            {
                role: "user",
                content: this.modelConfig.supportsVision ? this.prepareMultiModalContent(message, files) : message
            }
        ];

        return baseMessages;
    }

    prepareMultiModalContent(message, files) {
        if (!files.length) return message;

        const content = [
            {
                type: "text",
                text: message
            }
        ];

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                content.push({
                    type: "image_url",
                    image_url: {
                        url: URL.createObjectURL(file)
                    }
                });
            }
        });

        return content;
    }

    async handleOpenAIRequest(messages) {
        const response = await this.client.chat.completions.create({
            model: this.modelConfig.model,
            messages: messages,
            max_tokens: 1000
        });
        return response.choices[0].message.content;
    }

    async handleAnthropicRequest(messages) {
        const response = await this.client.messages.create({
            model: this.modelConfig.model,
            max_tokens: 2048,
            system: messages[0].content,
            messages: [{ 
                role: "user", 
                content: messages[1].content 
            }]
        });
        return response.content;
    }

    async handleTogetherRequest(messages) {
        const response = await this.client.chat.completions.create({
            model: this.modelConfig.model,
            messages: messages,
            max_tokens: 1024
        });
        return response.choices[0].message.content;
    }
}
