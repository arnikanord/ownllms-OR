import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoCopy, IoCheckmark, IoExpand, IoContract } from 'react-icons/io5';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import ModelSelector from './ModelSelector';
import { modelConfigs } from '../config/models';
import '../styles.css';
import '../index.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  async: false // Ensure synchronous operation
});

export default function Chat() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("claude-3-sonnet");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    document.body.style.overflow = !isExpanded ? 'hidden' : 'auto';
  };

  const handleSendMessage = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);

    try {
      setIsLoading(true);
      const modelConfig = modelConfigs[selectedModel];
      if (!modelConfig) {
        throw new Error(`Invalid model configuration for ${selectedModel}`);
      }

      console.log('Sending request to API:', {
        messages: [...messages, userMessage],
        model: selectedModel
      });

      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:3002/api/chat'
        : '/api/chat';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        let errorMessage = 'Failed to get response';
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
            console.error('Server error:', errorData);
          } else {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format: expected JSON');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!data || !data.content) {
        throw new Error('Invalid response format: missing content');
      }

      setMessages(prev => [...prev, data]);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string, isBot: boolean) => {
    if (!content) return null;
    
    try {
      if (!isBot) {
        return <div className="message-content"><p>{content}</p></div>;
      }
      
      const processedContent = marked.parse(content) as string;
      const sanitizedContent = DOMPurify.sanitize(processedContent, {
        ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'code', 'pre', 'ul', 'ol', 'li', 'blockquote'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button'],
        ADD_ATTR: ['target', 'rel'],
        FORCE_BODY: true,
        SANITIZE_DOM: true
      });
      
      return (
        <div 
          className={`message-content bot-message`}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      );
    } catch (err) {
      console.error('Error processing content:', err);
      return <div className="message-content"><p>{content}</p></div>;
    }
  };

  return (
    <>
      {isExpanded && <div className="overlay" onClick={toggleExpand} />}
      <div className={`chat-window ${isExpanded ? 'expanded' : ''}`}>
        <div className="chat-header">
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
          <button
            onClick={toggleExpand}
            className="expand-button"
            title={isExpanded ? "Collapse" : "Expand"}
            aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
          >
            {isExpanded ? <IoContract /> : <IoExpand />}
          </button>
        </div>
        <div className="chat-content">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
              Start a conversation by sending a message
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {renderMessageContent(message.content, message.role === 'assistant')}
              <button
                onClick={() => handleCopy(message.content, index)}
                className="copy-button"
                title="Copy to clipboard"
                aria-label="Copy message"
              >
                {copiedIndex === index ? (
                  <IoCheckmark className="text-green-500" />
                ) : (
                  <IoCopy className="text-gray-500" />
                )}
              </button>
            </div>
          ))}
          {isLoading && (
            <div className="message bot-message">
              <div className="loading"></div>
            </div>
          )}
          {error && (
            <div className="message bot-message error">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="input-container">
          <div className="button-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="send-btn"
            >
              <IoSend />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
