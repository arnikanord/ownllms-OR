import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { handler as chatHandler } from './src/app/api/chat/route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.post('/api/chat', async (req, res) => {
  try {
    const response = await chatHandler(req);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error handling chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 