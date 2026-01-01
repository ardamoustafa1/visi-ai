# 🎓 Visi AI - AI-Powered Educational Tutor

An intelligent tutoring system powered by Google Gemini 2.5 Flash that helps students from elementary school to university level with their studies.

## ✨ Features

- 💬 Interactive chat interface with AI tutor
- 📸 Image support for solving visual problems (equations, diagrams, etc.)
- 🎯 Multi-subject support (Math, Physics, Chemistry, Literature, etc.)
- 📱 Responsive design for all devices
- ⚡ Fast responses using Gemini 2.5 Flash

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000/chat](http://localhost:3000/chat) in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI Model**: Google Gemini 2.5 Flash
- **UI**: React 19 with Tailwind CSS
- **Language**: TypeScript

## 🔧 Troubleshooting

### Check Available Models

If you encounter model-related errors, run this script to see which models are available with your API key:

```bash
node scripts/list-available-models.js
```

### Common Issues

**404 Model Not Found Error**: Make sure you're using a valid model name. The current implementation uses `gemini-2.5-flash` which is the latest stable model supporting both text and images.

**API Key Issues**: Ensure your API key is correctly set in `.env.local` and has the necessary permissions.

## 📝 Project Structure

```
visi-ai/
├── app/
│   ├── api/chat/          # API route for Gemini
│   ├── chat/              # Chat page
│   └── ...
├── components/
│   ├── ChatInterface.tsx  # Main chat component
│   └── MessageBubble.tsx  # Message display component
├── scripts/
│   └── list-available-models.js  # Utility to check available models
└── ...
```

## 🎯 Usage

1. Navigate to `/chat` page
2. Type your question or upload an image of a problem
3. Get detailed, step-by-step explanations from the AI tutor

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
