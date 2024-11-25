import OpenAI from 'openai';

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

export const modelConfigs = {
    'grok-beta': {
        name: 'Grog Beta',
        baseUrl: "https://api.aimlapi.com/v1",
        model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
        apiType: 'together',
        supportsVision: true
    },
    'llama-3': {
        name: 'Llama 3.2',
        baseUrl: "https://api.aimlapi.com/v1",
        model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
        apiType: 'together',
        supportsVision: true
    },
    'o1-preview': {
        name: 'O1 Preview',
        baseUrl: "https://api.aimlapi.com/v1",
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        apiType: 'together',
        supportsVision: false
    },
    'gpt4-mini': {
        name: 'Chat GPT 4O Mini',
        baseUrl: "https://api.aimlapi.com/v1",
        model: "gpt-4o-mini-2024-07-18",
        apiType: 'together',
        supportsVision: false
    },
    'claude-sonnet': {
        name: 'Claude 3.5 Sonnet',
        baseUrl: "https://api.aimlapi.com/v1",
        model: "claude-3-5-sonnet-20241022",  // Updated model name to match example
        apiType: 'together',
        supportsVision: false
    },
    'gemma-2': {
        name: 'Google Gemma 2',
        baseUrl: "https://api.aimlapi.com/v1",
        model: "google/gemma-2-27b-it",
        apiType: 'together',
        supportsVision: false
    }
};

export const createClient = (modelId) => {
    const config = modelConfigs[modelId];
    
    if (!API_KEY) {
        throw new Error('API key not found. Please set the VITE_API_KEY environment variable.');
    }
    
    // Using OpenAI's client format since Together API is compatible with it
    return {
        type: 'together',
        client: new OpenAI({
            apiKey: API_KEY,
            baseURL: config.baseUrl,
            dangerouslyAllowBrowser: true
        })
    };
};
