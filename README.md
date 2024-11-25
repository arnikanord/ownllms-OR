# Grog Chat Interface

A modern chat interface that supports multiple AI models including Llama 3.2, OpenAI O1 Preview, Chat GPT 4O Mini, Claude 3.5 Sonnet, and Google Gemma 2. The interface supports file uploads, image generation, and artifact saving capabilities.

## Features

- 🤖 Multiple AI Model Support
  - Llama 3.2 (with vision capabilities)
  - OpenAI O1 Preview
  - Chat GPT 4O Mini
  - Claude 3.5 Sonnet
  - Google Gemma 2

- 📁 File Upload Support
  - Images
  - Text files
  - PDFs
  - Other supported file types

- 🎨 Image Generation
- 💾 Artifact Saving
- 🔄 Clear Memory Function
- 📱 Responsive Design

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/grog-chat-interface.git
cd grog-chat-interface
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory and add your API key:
```bash
API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Development

The project uses Vite for development and building. Available commands:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
grog/
├── src/
│   ├── config/
│   │   └── models.js
│   └── services/
│       └── chatService.js
├── index.html
├── script.js
├── styles.css
├── package.json
├── vite.config.js
└── .env
```

## Deployment

### Netlify Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add your API key to Netlify environment variables
5. Deploy!

## Environment Variables

- `API_KEY` - Your AIML API key for accessing the models

## Security Notes

- Never commit your .env file
- Always use environment variables for sensitive data
- The API key is handled securely through environment variables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
