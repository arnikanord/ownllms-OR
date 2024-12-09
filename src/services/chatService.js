import { modelConfigs, createClient } from '../config/models.js';
import { marked } from 'marked';

// Configure marked options
marked.setOptions({
    breaks: true,  // Add line breaks
    gfm: true,     // Enable GitHub Flavored Markdown
    headerIds: false // Disable header IDs to prevent conflicts
});

export class ChatService {
    constructor(modelId) {
        this.setModel(modelId);
        this.conversationHistory = [];
    }

    setModel(modelId) {
        if (!modelConfigs[modelId]) {
            throw new Error(`Model configuration not found for model: ${modelId}`);
        }
        
        this.modelConfig = modelConfigs[modelId];
        const { client, type } = createClient(modelId);
        this.client = client;
        this.clientType = type;
    }

    async sendMessage(message, files = [], isImageGeneration = false) {
        try {
            const messages = await this.prepareMessages(message, files);
            let response;
            
            if (isImageGeneration) {
                response = await this.handleImageGeneration(message);
            } else {
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
            }

            return response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async handleImageGeneration(prompt) {
        const response = await this.client.chat.completions.create({
            model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an AI that generates images based on text descriptions."
                },
                {
                    role: "user",
                    content: `Generate an image of: ${prompt}`
                }
            ],
            max_tokens: 1024
        });
        return response.choices[0].message.content;
    }

    async prepareMessages(message, files) {
        if (!this.modelConfig) {
            throw new Error('Model configuration not found');
        }

        const baseMessages = [
            {
                role: "system",
                content: "You are an AI assistant who knows everything. Use markdown formatting in your responses to make them more readable."
            },
            ...this.conversationHistory,
            {
                role: "user",
                content: this.modelConfig.supportsVision && files.length > 0 ? 
                    await this.prepareMultiModalContent(message, files) : 
                    message
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
        // For Claude model, use a different format
        if (this.modelConfig.model === "claude-3-5-sonnet-20241022") {
            const response = await this.client.chat.completions.create({
                model: this.modelConfig.model,
                max_tokens: 2048,
                system: messages[0].content,
                messages: messages.slice(1).map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            });
            return response.choices[0].message.content;
        }
        
        // For other models, use the standard format
        const response = await this.client.chat.completions.create({
            model: this.modelConfig.model,
            messages: messages,
            max_tokens: 1024
        });
        return response.choices[0].message.content;
    }

    addMessageToChat(content, isUser = false, isImage = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        if (isImage && content.startsWith('http')) {
            const img = document.createElement('img');
            img.src = content;
            img.className = 'generated-image';
            messageDiv.appendChild(img);
        } else {
            const textDiv = document.createElement('div');
            textDiv.className = 'message-text markdown-content';
            
            // Parse markdown for bot messages, keep plain text for user messages
            if (isUser) {
                textDiv.textContent = content;
            } else {
                textDiv.innerHTML = marked(content);
            }
            
            messageDiv.appendChild(textDiv);
            
            // Add copy button for bot messages
            if (!isUser) {
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'message-buttons';
                
                const copyButton = document.createElement('button');
                copyButton.className = 'message-action-button';
                copyButton.textContent = 'Copy Output';
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(content);
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy Output';
                    }, 2000);
                };
                buttonContainer.appendChild(copyButton);
                messageDiv.appendChild(buttonContainer);
            }
        }
        
        const outputWindow = document.getElementById('outputWindow');
        outputWindow.appendChild(messageDiv);
        outputWindow.scrollTop = outputWindow.scrollHeight;
    }
}
