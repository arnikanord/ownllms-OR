import React from 'react';

interface Model {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  inputPrice: number;
  outputPrice: number;
  description?: string;
}

// Models sorted by total cost (input + output)
const models: Model[] = [
  // Free Models
  {
    id: "google/gemini-2.0-flash-thinking-experimental-01-21",
    name: "Gemini 2.0 Flash Thinking",
    provider: "Google",
    contextLength: 1050000,
    inputPrice: 0,
    outputPrice: 0,
    description: "Experimental model with strong reasoning capabilities"
  },
  {
    id: "deepseek/deepseek-r1-free",
    name: "DeepSeek R1 (Free)",
    provider: "DeepSeek",
    contextLength: 128000,
    inputPrice: 0,
    outputPrice: 0,
    description: "Open-source model with strong reasoning capabilities"
  },
  // Low Cost Models
  {
    id: "liquid/lfm-7b",
    name: "LFM 7B",
    provider: "Liquid",
    contextLength: 33000,
    inputPrice: 0.01,
    outputPrice: 0.01,
    description: "Best-in-class multilingual model"
  },
  {
    id: "amazon/nova-micro-1.0",
    name: "Nova Micro 1.0",
    provider: "Amazon",
    contextLength: 128000,
    inputPrice: 0.035,
    outputPrice: 0.14,
    description: "Fast, low-cost text processing"
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "Meta",
    contextLength: 131000,
    inputPrice: 0.12,
    outputPrice: 0.3,
    description: "Strong multilingual capabilities"
  },
  // Medium Cost Models
  {
    id: "perplexity/sonar",
    name: "Sonar",
    provider: "Perplexity",
    contextLength: 127000,
    inputPrice: 1,
    outputPrice: 1,
    description: "Fast and affordable with citations"
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextLength: 200000,
    inputPrice: 3,
    outputPrice: 15,
    description: "Exceptional at coding and analysis"
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const selectedModelInfo = models.find(m => m.id === selectedModel);

  return (
    <div className="mb-4">
      <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select AI Model
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} ({model.provider}) - {model.inputPrice === 0 && model.outputPrice === 0 
              ? 'Free' 
              : `$${model.inputPrice}/1M in, $${model.outputPrice}/1M out`}
          </option>
        ))}
      </select>
      {selectedModelInfo && (
        <div className="mt-2 text-sm">
          <div className="text-gray-600">{selectedModelInfo.description}</div>
          <div className="text-gray-500 mt-1">
            Context length: {(selectedModelInfo.contextLength / 1000).toFixed(0)}K tokens
          </div>
          <div className="text-gray-500">
            Pricing: {selectedModelInfo.inputPrice === 0 && selectedModelInfo.outputPrice === 0 
              ? 'Free' 
              : `$${selectedModelInfo.inputPrice}/1M input tokens, $${selectedModelInfo.outputPrice}/1M output tokens`}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 