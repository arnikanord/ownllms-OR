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
