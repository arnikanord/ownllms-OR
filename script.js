import { ChatService } from './src/services/chatService.js';
import { marked } from 'marked';
import { modelConfigs } from './src/config/models.js';

class ChatInterface {
    constructor() {
        this.chatService = new ChatService('claude-3-sonnet'); // Set Claude 3.5 Sonnet as default
        this.uploadedFiles = [];
        this.initializeElements();
        this.attachEventListeners();
        this.setupMarkdown();
    }

    setupMarkdown() {
        // Configure marked options for security
        marked.setOptions({
            breaks: true, // Enable GitHub Flavored Markdown line breaks
            sanitize: false, // Disable sanitization to allow HTML
            gfm: true // Enable GitHub Flavored Markdown
        });
    }

    initializeElements() {
        this.outputWindow = document.getElementById('outputWindow');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendMessage');
        this.clearButton = document.getElementById('clearMemory');
        this.generateImageButton = document.getElementById('generateImage');
        this.saveArtifactButton = document.getElementById('saveArtifact');
        this.modelSelector = document.getElementById('modelSelector');
        this.fileUpload = document.getElementById('fileUpload');
        this.filePreview = document.getElementById('filePreview');
        this.populateModelSelector();
    }

    populateModelSelector() {
        // Clear existing options
        this.modelSelector.innerHTML = '';
        
        // Add options from modelConfigs
        Object.entries(modelConfigs).forEach(([modelId, config]) => {
            const option = document.createElement('option');
            option.value = modelId;
            option.textContent = config.name;
            this.modelSelector.appendChild(option);
        });
    }

    attachEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.clearButton.addEventListener('click', () => this.clearChat());
        this.generateImageButton.addEventListener('click', () => this.handleImageGeneration());
        this.saveArtifactButton.addEventListener('click', () => this.handleSaveArtifact());
        this.modelSelector.addEventListener('change', (e) => this.handleModelChange(e));
        this.fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });
    }

    async handleSendMessage() {
        const message = this.userInput.value.trim();
        if (!message && this.uploadedFiles.length === 0) return;

        try {
            this.addMessageToChat(message, true);
            this.userInput.value = '';
            this.sendButton.disabled = true;
            this.sendButton.innerHTML = '<div class="loading"></div>';

            const response = await this.chatService.sendMessage(message, this.uploadedFiles);
            this.addMessageToChat(response, false);

            // Clear uploaded files after sending
            this.uploadedFiles = [];
            this.filePreview.innerHTML = '';
        } catch (error) {
            this.addMessageToChat('Error: ' + error.message, false);
            console.error('Error sending message:', error);
        } finally {
            this.sendButton.disabled = false;
            this.sendButton.textContent = 'Send';
        }
    }

    handleModelChange(event) {
        this.chatService.setModel(event.target.value);
        this.addMessageToChat(`Switched to ${event.target.options[event.target.selectedIndex].text}`, false);
    }

    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        this.uploadedFiles = files;
        this.filePreview.innerHTML = '';

        files.forEach(file => {
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                previewItem.appendChild(img);
            } else {
                previewItem.textContent = file.name;
            }

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-file';
            removeButton.textContent = '×';
            removeButton.onclick = () => {
                this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
                previewItem.remove();
            };

            previewItem.appendChild(removeButton);
            this.filePreview.appendChild(previewItem);
        });
    }

    async handleImageGeneration() {
        const prompt = this.userInput.value.trim();
        if (!prompt) {
            alert('Please enter a description for the image you want to generate.');
            return;
        }

        try {
            this.generateImageButton.disabled = true;
            this.generateImageButton.innerHTML = '<div class="loading"></div>';

            const response = await this.chatService.sendMessage(prompt, [], true);
            this.addMessageToChat(response, false, true);
            this.userInput.value = '';
        } catch (error) {
            this.addMessageToChat('Error generating image: ' + error.message, false);
        } finally {
            this.generateImageButton.disabled = false;
            this.generateImageButton.textContent = 'Generate Image';
        }
    }

    handleSaveArtifact() {
        const selectedText = window.getSelection().toString();
        if (!selectedText) {
            alert('Please select the text you want to save as an artifact.');
            return;
        }

        const artifactDiv = document.createElement('div');
        artifactDiv.className = 'artifact';
        artifactDiv.textContent = selectedText;
        this.outputWindow.appendChild(artifactDiv);
        this.outputWindow.scrollTop = this.outputWindow.scrollHeight;
    }

    addMessageToChat(content, isUser = false, isImage = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        // Create a message content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'message-content';
        
        if (isImage && content.startsWith('http')) {
            const img = document.createElement('img');
            img.src = content;
            img.className = 'generated-image';
            contentWrapper.appendChild(img);
        } else if (isUser) {
            contentWrapper.textContent = content;
        } else {
            const parsedContent = marked(content);
            contentWrapper.innerHTML = parsedContent;
        }
        
        messageDiv.appendChild(contentWrapper);
        
        // Add copy button for non-empty messages
        if (content.trim()) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '📋';
            copyButton.title = 'Copy to clipboard';
            copyButton.onclick = async () => {
                try {
                    // Get the text content, handling both plain text and HTML content
                    const textToCopy = isImage ? content : contentWrapper.textContent;
                    await navigator.clipboard.writeText(textToCopy);
                    copyButton.innerHTML = '✓';
                    setTimeout(() => {
                        copyButton.innerHTML = '📋';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text:', err);
                    copyButton.innerHTML = '❌';
                    setTimeout(() => {
                        copyButton.innerHTML = '📋';
                    }, 2000);
                }
            };
            messageDiv.appendChild(copyButton);
        }
        
        this.outputWindow.appendChild(messageDiv);
        this.outputWindow.scrollTop = this.outputWindow.scrollHeight;
    }

    clearChat() {
        this.outputWindow.innerHTML = '';
        this.uploadedFiles = [];
        this.filePreview.innerHTML = '';
        this.addMessageToChat('Chat history cleared.', false);
    }
}

// Initialize the chat interface when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatInterface();
});
