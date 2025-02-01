import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import createClient, { modelConfigs } from './src/config/models.js';
import type { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check required environment variables
const requiredEnvVars = ['OPENROUTER_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3002;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  credentials: true,
  maxAge: 86400, // Cache preflight requests for 24 hours
  optionsSuccessStatus: 204
}));

// Add request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  if (req.method !== 'OPTIONS') {
    console.log('Request body:', req.body);
  }
  // Add CORS headers to all responses
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3001');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin');
  next();
});

// Create Router
const router = express.Router();

// Test endpoint to verify API is working
router.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
router.post('/chat', async (req: Request, res: Response) => {
  try {
    console.log('[Chat API] Received request:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    });
    
    const { messages, model } = req.body;
    
    // Validate request body exists
    if (!req.body) {
      return res.status(400).json({ 
        error: 'Missing request body',
        details: 'Request body is required'
      });
    }

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid messages format',
        details: 'Messages must be a non-empty array of message objects'
      });
    }

    // Validate message format
    const isValidMessage = messages.every(msg => 
      msg && typeof msg === 'object' && 
      typeof msg.role === 'string' && 
      typeof msg.content === 'string'
    );
    
    if (!isValidMessage) {
      return res.status(400).json({ 
        error: 'Invalid message format',
        details: 'Each message must have a role (string) and content (string)'
      });
    }

    // Validate model parameter
    if (!model || typeof model !== 'string') {
      return res.status(400).json({ 
        error: 'Model parameter is required',
        details: 'Model must be a valid string identifier'
      });
    }

    // Check API key
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set');
      return res.status(500).json({ 
        error: 'API key not configured',
        details: 'Server configuration error'
      });
    }
    
    // Validate model exists
    const modelConfig = modelConfigs[model];
    if (!modelConfig) {
      return res.status(400).json({ 
        error: 'Invalid model ID',
        details: `Model '${model}' is not supported`
      });
    }

    // Create client and make request
    const { client, type } = createClient(model);
    console.log('Created client for model type:', type);
    console.log('Using model:', model);
    console.log('API Base URL:', client.baseURL);

    const completion = await client.chat.completions.create({
      model: modelConfig.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from model');
    }

    console.log('Got completion response:', {
      status: 'success',
      messageContent: completion.choices[0].message.content?.substring(0, 50) + '...'
    });

    res.json({
      role: 'assistant',
      content: completion.choices[0].message.content
    });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    
    // Handle different types of errors
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        details: 'Invalid API key or authentication error'
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        details: 'Too many requests, please try again later'
      });
    }

    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Mount router at both /api and / paths
app.use('/api', router);
app.use('/', router);

// Add catch-all route for debugging
app.use((req: Request, res: Response) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({
    error: 'Not Found',
    path: req.url,
    method: req.method
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
  console.log(`API available at http://localhost:${port}/api`);
  console.log('CORS enabled for origins:', ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003']);
  console.log('Available routes:');
  console.log('- GET  /api/health');
  console.log('- POST /api/chat');
});
