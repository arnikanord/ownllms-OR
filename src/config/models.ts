import { OpenAI } from 'openai';

export interface ModelConfig {
  id: string;
  name: string;
  baseUrl: string;
  model: string;
  apiType: 'together' | 'openai' | 'anthropic';
  supportsVision: boolean;
  inputPrice: number;
  outputPrice: number;
  contextSize?: number;
}

export const modelConfigs: Record<string, ModelConfig> = {
  'deepseek-qwen-32b': {
    id: 'deepseek-qwen-32b',
    name: 'DeepSeek R1 Distill Qwen 32B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-r1-distill-qwen-32b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.7,
    outputPrice: 0.7
  },
  'deepseek-qwen-14b': {
    id: 'deepseek-qwen-14b',
    name: 'DeepSeek R1 Distill Qwen 14B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-r1-distill-qwen-14b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.75,
    outputPrice: 0.75
  },
  'sonar-reasoning': {
    id: 'sonar-reasoning',
    name: 'Perplexity Sonar Reasoning',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "perplexity/sonar-reasoning",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 1,
    outputPrice: 5
  },
  'sonar': {
    id: 'sonar',
    name: 'Perplexity Sonar',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "perplexity/sonar",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 1,
    outputPrice: 1
  },
  'claude-3-sonnet': {
    id: 'claude-3-sonnet',
    name: 'Claude 3.5 Sonnet',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "anthropic/claude-3.5-sonnet",
    apiType: 'anthropic',
    supportsVision: true,
    inputPrice: 3,
    outputPrice: 15
  },
  'claude-3-haiku': {
    id: 'claude-3-haiku',
    name: 'Claude 3.5 Haiku',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "anthropic/claude-3.5-haiku",
    apiType: 'anthropic',
    supportsVision: true,
    inputPrice: 0.8,
    outputPrice: 4
  },
  'grok-beta': {
    id: 'grok-beta',
    name: 'Grok Beta',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "x-ai/grok-beta",
    apiType: 'together',
    supportsVision: true,
    inputPrice: 5,
    outputPrice: 15
  },
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Gemini 2.0 Flash',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "google/gemini-2.0-flash-thinking-exp:free",
    apiType: 'together',
    supportsVision: true,
    inputPrice: 0,
    outputPrice: 0
  },
  'mistral-large': {
    id: 'mistral-large',
    name: 'Mistral Large',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "mistralai/mistral-large-2411",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 2,
    outputPrice: 6
  },
  'phi-4': {
    id: 'phi-4',
    name: 'Microsoft Phi 4',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "microsoft/phi-4",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.07,
    outputPrice: 0.14
  },
  'qwen-72b': {
    id: 'qwen-72b',
    name: 'Qwen QvQ 72B Preview',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "qwen/qvq-72b-preview",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.25,
    outputPrice: 0.5
  },
  'nova-lite': {
    id: 'nova-lite',
    name: 'Amazon Nova Lite 1.0',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "amazon/nova-lite-v1",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.06,
    outputPrice: 0.24
  },
  'liquid-lfm-7b': {
    id: 'liquid-lfm-7b',
    name: 'Liquid LFM 7B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "liquid/lfm-7b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.01,
    outputPrice: 0.01,
    contextSize: 32768
  },
  'liquid-lfm-3b': {
    id: 'liquid-lfm-3b',
    name: 'Liquid LFM 3B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "liquid/lfm-3b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.02,
    outputPrice: 0.02,
    contextSize: 32768
  },
  'deepseek-llama-70b': {
    id: 'deepseek-llama-70b',
    name: 'DeepSeek R1 Distill Llama 70B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-r1-distill-llama-70b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.23,
    outputPrice: 0.69,
    contextSize: 131072
  },
  'deepseek-r1': {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-r1",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 6.5,
    outputPrice: 8,
    contextSize: 32768
  },
  'deepseek-r1-nitro': {
    id: 'deepseek-r1-nitro',
    name: 'DeepSeek R1 (nitro)',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-r1:nitro",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 7,
    outputPrice: 7,
    contextSize: 163840
  },
  'minimax-01': {
    id: 'minimax-01',
    name: 'MiniMax-01',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "minimax/minimax-01",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.2,
    outputPrice: 1.1,
    contextSize: 1000192
  },
  'codestral-2501': {
    id: 'codestral-2501',
    name: 'Mistral Codestral 2501',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "mistralai/codestral-2501",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.3,
    outputPrice: 0.9,
    contextSize: 256000
  },
  'hanami-x1': {
    id: 'hanami-x1',
    name: 'Llama 3.1 70B Hanami x1',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "sao10k/l3.1-70b-hanami-x1",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 3,
    outputPrice: 3,
    contextSize: 16000
  },
  'deepseek-v3': {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-chat",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.85,
    outputPrice: 0.9,
    contextSize: 16000
  },
  'llama-3-euryale': {
    id: 'llama-3-euryale',
    name: 'Llama 3.3 Euryale 70B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "sao10k/l3.3-euryale-70b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.7,
    outputPrice: 0.8,
    contextSize: 131072
  },
  'eva-llama-3': {
    id: 'eva-llama-3',
    name: 'EVA Llama 3.33 70b',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "eva-unit-01/eva-llama-3.33-70b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 4,
    outputPrice: 6,
    contextSize: 16384
  },
  'grok-2-vision': {
    id: 'grok-2-vision',
    name: 'Grok 2 Vision 1212',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "x-ai/grok-2-vision-1212",
    apiType: 'together',
    supportsVision: true,
    inputPrice: 2,
    outputPrice: 10,
    contextSize: 32768
  },
  'grok-2': {
    id: 'grok-2',
    name: 'Grok 2 1212',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "x-ai/grok-2-1212",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 2,
    outputPrice: 10,
    contextSize: 131072
  },
  'command-r7b': {
    id: 'command-r7b',
    name: 'Cohere Command R7B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "cohere/command-r7b-12-2024",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.0375,
    outputPrice: 0.15,
    contextSize: 128000
  },
  'llama-3-instruct': {
    id: 'llama-3-instruct',
    name: 'Meta Llama 3.3 70B Instruct',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "meta-llama/llama-3.3-70b-instruct",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.12,
    outputPrice: 0.3,
    contextSize: 131072
  },
  'nova-micro': {
    id: 'nova-micro',
    name: 'Amazon Nova Micro 1.0',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "amazon/nova-micro-v1",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.035,
    outputPrice: 0.14,
    contextSize: 128000
  },
  'nova-pro': {
    id: 'nova-pro',
    name: 'Amazon Nova Pro 1.0',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "amazon/nova-pro-v1",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.8,
    outputPrice: 3.2,
    contextSize: 300000
  },
  'qwq-32b': {
    id: 'qwq-32b',
    name: 'Qwen QwQ 32B Preview',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "qwen/qwq-32b-preview",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.12,
    outputPrice: 0.18,
    contextSize: 32768
  },
  'eva-qwen-72b': {
    id: 'eva-qwen-72b',
    name: 'EVA Qwen2.5 72B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "eva-unit-01/eva-qwen-2.5-72b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 4,
    outputPrice: 6,
    contextSize: 16384
  },
  'mistral-large-2407': {
    id: 'mistral-large-2407',
    name: 'Mistral Large 2407',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "mistralai/mistral-large-2407",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 2,
    outputPrice: 6,
    contextSize: 128000
  },
  'pixtral-large': {
    id: 'pixtral-large',
    name: 'Mistral Pixtral Large 2411',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "mistralai/pixtral-large-2411",
    apiType: 'together',
    supportsVision: true,
    inputPrice: 2,
    outputPrice: 6,
    contextSize: 128000
  },
  'grok-vision-beta': {
    id: 'grok-vision-beta',
    name: 'Grok Vision Beta',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "x-ai/grok-vision-beta",
    apiType: 'together',
    supportsVision: true,
    inputPrice: 5,
    outputPrice: 15,
    contextSize: 8192
  },
  'inferor-12b': {
    id: 'inferor-12b',
    name: 'Mistral Nemo Inferor 12B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "infermatic/mn-inferor-12b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.25,
    outputPrice: 0.5,
    contextSize: 32000
  },
  'qwen-coder': {
    id: 'qwen-coder',
    name: 'Qwen2.5 Coder 32B Instruct',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "qwen/qwen-2.5-coder-32b-instruct",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.07,
    outputPrice: 0.16,
    contextSize: 33000
  },
  'sorcerer-8x22b': {
    id: 'sorcerer-8x22b',
    name: 'SorcererLM 8x22B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "raifle/sorcererlm-8x22b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 4.5,
    outputPrice: 4.5,
    contextSize: 16000
  },
  'eva-qwen-32b': {
    id: 'eva-qwen-32b',
    name: 'EVA Qwen2.5 32B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "eva-unit-01/eva-qwen-2.5-32b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 2.6,
    outputPrice: 3.4,
    contextSize: 16384
  },
  'unslopnemo-12b': {
    id: 'unslopnemo-12b',
    name: 'Unslopnemo 12b',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "thedrummer/unslopnemo-12b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 0.5,
    outputPrice: 0.5,
    contextSize: 32000
  },
  'lumimaid-70b': {
    id: 'lumimaid-70b',
    name: 'NeverSleep Lumimaid v0.2 70B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "neversleep/llama-3.1-lumimaid-70b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 3.375,
    outputPrice: 4.5,
    contextSize: 16384
  },
  'magnum-v4': {
    id: 'magnum-v4',
    name: 'Magnum v4 72B',
    baseUrl: "https://openrouter.ai/api/v1",
    model: "anthracite-org/magnum-v4-72b",
    apiType: 'together',
    supportsVision: false,
    inputPrice: 1.875,
    outputPrice: 2.25,
    contextSize: 16384
  }
};

export default function createClient(modelId: string) {
  const config = modelConfigs[modelId];
  
  if (!config) {
    throw new Error(`Invalid model ID: ${modelId}`);
  }

  const headers: Record<string, string> = {
    'HTTP-Referer': import.meta.env.VITE_SITE_URL || window.location.origin,
    'X-Title': import.meta.env.VITE_SITE_NAME || 'Grog Chat'
  };

  // Add OpenRouter specific header
  if (config.baseUrl.includes('openrouter.ai')) {
    headers['Authorization'] = `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`;
  }

  return {
    type: config.apiType,
    client: new OpenAI({
      apiKey: import.meta.env.VITE_API_KEY,
      baseURL: config.baseUrl,
      defaultHeaders: headers,
      dangerouslyAllowBrowser: true
    }),
    model: config.model
  };
}
