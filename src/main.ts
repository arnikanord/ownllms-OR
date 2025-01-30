import { ChatService } from './services/chatService';
import createClient, { modelConfigs, ModelConfig } from './config/models';

class ChatInterface {
  private chatService: ChatService;
  private modelSelector!: HTMLSelectElement;
  private messageInput!: HTMLTextAreaElement;
  private sendButton!: HTMLButtonElement;
  private clearButton!: HTMLButtonElement;
  private outputWindow!: HTMLDivElement;

  constructor() {
    this.chatService = new ChatService();
    this.initializeElements();
    this.attachEventListeners();
  }

  private initializeElements() {
    this.modelSelector = document.getElementById('modelSelector') as HTMLSelectElement;
    this.messageInput = document.getElementById('userInput') as HTMLTextAreaElement;
    this.sendButton = document.getElementById('sendMessage') as HTMLButtonElement;
    this.clearButton = document.getElementById('clearMemory') as HTMLButtonElement;
    this.outputWindow = document.getElementById('outputWindow') as HTMLDivElement;

    if (!this.modelSelector || !this.messageInput || !this.sendButton || !this.outputWindow) {
      throw new Error('Required elements not found');
    }
    
    // Populate model selector
    this.populateModelSelector();
  }

  private populateModelSelector() {
    this.modelSelector.innerHTML = Object.entries(modelConfigs)
      .map(([id, model]: [string, ModelConfig]) => {
        const price = model.inputPrice === 0 ? 'Free' : `$${model.inputPrice}/1M`;
        return `<option value="${id}">${model.name} (${price})</option>`;
      })
      .join('');
  }

  private attachEventListeners() {
    this.modelSelector.addEventListener('change', (e) => {
      const select = e.target as HTMLSelectElement;
      this.chatService.setModel(select.value);
    });

    this.sendButton.addEventListener('click', () => this.handleSendMessage());
    
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    this.clearButton.addEventListener('click', () => {
      this.outputWindow.innerHTML = '';
      this.addMessageToChat('Chat cleared', 'system');
    });
  }

  private async handleSendMessage() {
    const message = this.messageInput.value.trim();
    if (!message) return;

    try {
      this.sendButton.disabled = true;
      this.sendButton.textContent = 'Sending...';
      
      // Add user message immediately
      this.addMessageToChat(message, 'user');
      this.messageInput.value = '';

      // Get response from model
      const response = await this.chatService.sendMessage(message);
      this.addMessageToChat(response, 'assistant');
    } catch (error) {
      console.error('Error:', error);
      this.addMessageToChat('Error: Failed to get response from model', 'error');
    } finally {
      this.sendButton.disabled = false;
      this.sendButton.textContent = 'Send';
    }
  }

  private addMessageToChat(content: string, role: 'user' | 'assistant' | 'system' | 'error') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'message-content';
    contentWrapper.textContent = content;
    messageDiv.appendChild(contentWrapper);

    this.outputWindow.appendChild(messageDiv);
    this.outputWindow.scrollTop = this.outputWindow.scrollHeight;
  }
}

// Initialize the chat interface when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new ChatInterface();
  } catch (error) {
    console.error('Failed to initialize chat interface:', error);
    document.body.innerHTML = '<div class="error">Failed to load chat interface</div>';
  }
});
