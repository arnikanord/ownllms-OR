import React from 'react';
import { modelConfigs } from '../config/models';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  // Convert modelConfigs to array and sort by total cost
  const sortedModels = Object.values(modelConfigs).sort((a, b) => {
    const totalCostA = a.inputPrice + a.outputPrice;
    const totalCostB = b.inputPrice + b.outputPrice;
    return totalCostA - totalCostB;
  });

  const selectedModelInfo = modelConfigs[selectedModel];

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
        {sortedModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.inputPrice === 0 && model.outputPrice === 0 
              ? 'Free' 
              : `$${model.inputPrice}/1M in, $${model.outputPrice}/1M out`}
          </option>
        ))}
      </select>
      {selectedModelInfo && (
        <div className="mt-2 text-sm">
          <div className="text-gray-500 mt-1">
            Context length: {(selectedModelInfo.contextSize || 0) / 1000}K tokens
          </div>
          <div className="text-gray-500">
            Pricing: {selectedModelInfo.inputPrice === 0 && selectedModelInfo.outputPrice === 0 
              ? 'Free' 
              : `$${selectedModelInfo.inputPrice}/1M input tokens, $${selectedModelInfo.outputPrice}/1M output tokens`}
          </div>
          {selectedModelInfo.supportsVision && (
            <div className="text-gray-500">
              Supports vision/image input
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 