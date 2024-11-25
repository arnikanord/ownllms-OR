// Model configurations and API clients
const API_KEY = process.env.API_KEY;

export const modelConfigs = {
    'grok-beta': {
        name: 'Grog Beta',
        baseUrl: "https://api.aimlapi.com",
        model: "x-ai/grok-beta",
        apiType: 'openai',
        supportsVision: false
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
        baseUrl: "https://api.aimlapi.com",
        model: "o1-preview",
        apiType: 'openai',
        supportsVision: false
    },
    'gpt4-mini': {
        name: 'Chat GPT 4O Mini',
        baseUrl: "https://api.aimlapi.com",
        model: "gpt-4o-mini-2024-07-18",
        apiType: 'openai',
        supportsVision: false
    },
    'claude-sonnet': {
        name: 'Claude 3.5 Sonnet',
        baseUrl: "https://api.aimlapi.com/v1",
        model: "claude-3-5-sonnet-20241022",
        apiType: 'anthropic',
        supportsVision: false
    },
    'gemma-2': {
        name: 'Google Gemma 2',
        baseUrl: "https://api.aimlapi.com",
        model: "google/gemma-2-27b-it",
        apiType: 'openai',
        supportsVision: false
    }
};

export const createClient = (modelId) => {
    const config = modelConfigs[modelId];
    
    switch (config.apiType) {
        case 'openai':
            return {
                type: 'openai',
                client: new OpenAI({
                    apiKey: API_KEY,
                    baseUrl: config.baseUrl
                })
            };
        case 'anthropic':
            return {
                type: 'anthropic',
                client: new Anthropic({
                    baseUrl: config.baseUrl,
                    authToken: API_KEY
                })
            };
        case 'together':
            return {
                type: 'together',
                client: new Together({
                    baseUrl: config.baseUrl,
                    apiKey: API_KEY
                })
            };
        default:
            throw new Error(`Unknown API type: ${config.apiType}`);
    }
};
