import { modelConfigs, createClient } from '../config/models.js';

export class ChatService {
    constructor(modelId) {
        this.setModel(modelId);
        this.conversationHistory = [];
    }

    setModel(modelId) {
        this.modelConfig = modelConfigs[modelId];
        const { client, type } = createClient(modelId);
        this.client = client;
        this.clientType = type;
    }

    async sendMessage(message, files = []) {
        try {
            const messages = await this.prepareMessages(message, files);
            let response;
            
            switch (this.clientType) {
                case 'openai':
                    response = await this.handleOpenAIRequest(messages);
                    break;
                case 'anthropic':
                    response = await this.handleAnthropicRequest(messages);
                    break;
                case 'together':
                    response = await this.handleTogetherRequest(messages);
                    break;
                default:
                    throw new Error(`Unsupported client type: ${this.clientType}`);
            }

            // Add the user message and assistant response to conversation history
            this.conversationHistory.push({ role: "user", content: message });
            this.conversationHistory.push({ role: "assistant", content: response });

            return response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async prepareMessages(message, files) {
        const baseMessages = [
            {
                role: "system",
                content: "You are an AI assistant who knows everything."
            },
            ...this.conversationHistory,
            {
                role: "user",
                content: this.modelConfig.supportsVision ? await this.prepareMultiModalContent(message, files) : message
            }
        ];

        return baseMessages;
    }

    async prepareMultiModalContent(message, files) {
        if (!files.length) return message;

        const content = [
            {
                type: "text",
                text: message
            }
        ];

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const base64 = await this.fileToBase64(file);
                content.push({
                    type: "image_url",
                    image_url: {
                        url: `data:${file.type};base64,${base64}`
                    }
                });
            }
        }

        return content;
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
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
            messages: messages.slice(1).map(msg => ({ 
                role: msg.role, 
                content: msg.content 
            }))
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
