import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoCopy, IoCheckmark } from 'react-icons/io5';
import { IconBaseProps } from 'react-icons';
import ModelSelector from './ModelSelector';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CopyButtonProps extends IconBaseProps {
  className?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("anthropic/claude-3.5-sonnet");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
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

  const handleSendMessage = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);

    try {
      setIsLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, data]);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-none p-4 bg-white shadow">
        <ModelSelector 
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg relative group ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-[80%]'
                : 'bg-white mr-auto max-w-[80%]'
            }`}
          >
            <div className="pr-8 whitespace-pre-wrap">{message.content}</div>
            <button
              onClick={() => handleCopy(message.content, index)}
              className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:shadow-md"
              title="Copy to clipboard"
              aria-label="Copy message"
            >
              {copiedIndex === index ? (
                <IoCheckmark className="w-4 h-4 text-green-500" />
              ) : (
                <IoCopy className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
        {isLoading && (
          <div className="text-center p-2">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center p-2">{error}</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex-none p-4 bg-white shadow">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 