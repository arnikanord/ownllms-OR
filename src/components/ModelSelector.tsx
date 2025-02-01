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
    id: "gemini-pro",
    name: "Gemini 2.0 Flash Thinking",
    provider: "Google",
    contextLength: 1048576,
    inputPrice: 0,
    outputPrice: 0,
    description: "Fast and free model with strong reasoning capabilities"
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1 (free)",
    provider: "DeepSeek",
    contextLength: 128000,
    inputPrice: 0,
    outputPrice: 0,
    description: "Open-source model with strong reasoning capabilities"
  },
  // Low Cost Models
  {
    id: "liquid-lfm-7b",
    name: "Liquid LFM 7B",
    provider: "Liquid",
    contextLength: 32768,
    inputPrice: 0.01,
    outputPrice: 0.01,
    description: "Best-in-class multilingual model"
  },
  {
    id: "liquid-lfm-3b",
    name: "Liquid LFM 3B",
    provider: "Liquid",
    contextLength: 32768,
    inputPrice: 0.02,
    outputPrice: 0.02,
    description: "Efficient multilingual model"
  },
  {
    id: "nova-micro",
    name: "Amazon Nova Micro 1.0",
    provider: "Amazon",
    contextLength: 128000,
    inputPrice: 0.035,
    outputPrice: 0.14,
    description: "Fast, low-cost text processing"
  },
  {
    id: "nova-lite",
    name: "Amazon Nova Lite 1.0",
    provider: "Amazon",
    contextLength: 300000,
    inputPrice: 0.06,
    outputPrice: 0.24,
    description: "Balanced performance and cost"
  },
  {
    id: "llama-3-instruct",
    name: "Meta Llama 3.3 70B Instruct",
    provider: "Meta",
    contextLength: 131072,
    inputPrice: 0.12,
    outputPrice: 0.3,
    description: "Strong multilingual capabilities"
  },
  {
    id: "command-r7b",
    name: "Cohere Command R7B (12-2024)",
    provider: "Cohere",
    contextLength: 128000,
    inputPrice: 0.0375,
    outputPrice: 0.15,
    description: "Efficient command-following model"
  },
  // Medium Cost Models
  {
    id: "sonar",
    name: "Perplexity Sonar",
    provider: "Perplexity",
    contextLength: 127072,
    inputPrice: 1,
    outputPrice: 1,
    description: "Fast and affordable with citations"
  },
  {
    id: "sonar-reasoning",
    name: "Perplexity Sonar Reasoning",
    provider: "Perplexity",
    contextLength: 127000,
    inputPrice: 1,
    outputPrice: 5,
    description: "Enhanced reasoning capabilities"
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextLength: 200000,
    inputPrice: 3,
    outputPrice: 15,
    description: "Exceptional at coding and analysis"
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    contextLength: 200000,
    inputPrice: 0.8,
    outputPrice: 4,
    description: "Fast and efficient version of Claude"
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