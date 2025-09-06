# AI Tutor - Personalized Learning with AI

An intelligent tutoring system featuring two AI agents powered by Google's Gemini API:

- **AI Syllabus Agent**: Creates personalized curriculum based on user's previous knowledge, experience, class level, test scores, grades, and learning goals
- **AI Teacher Agent**: Provides comprehensive teaching with text explanations, visual descriptions, examples, and practice exercises

## Features

- 🤖 **Dual AI Agents**: Specialized agents for curriculum creation and teaching
- 🎯 **Personalized Learning**: Custom curriculum based on individual user data
- 📚 **Comprehensive Teaching**: Rich content with examples, visuals, and exercises
- 🎨 **Modern UI**: Minimalistic, dynamic, and responsive web interface
- ⚡ **Real-time AI**: Powered by Google Gemini API for intelligent responses
- 📱 **Mobile Friendly**: Fully responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI**: Google Gemini API
- **Deployment**: Vercel
- **Markdown**: React Markdown with GitHub Flavored Markdown

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-tutor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### AI Syllabus Agent

1. Fill out the form with your learning information:
   - Previous knowledge and experience level
   - Class/grade level
   - Test scores and grades (optional)
   - Subjects of interest
   - Learning goals

2. Click "Generate My Curriculum" to create a personalized learning plan

3. The AI will analyze your data and create a comprehensive curriculum with:
   - Learning objectives
   - Topic sequence with time estimates
   - Prerequisites
   - Assessment strategy
   - Recommended resources

### AI Teacher Agent

1. Enter a topic you want to learn
2. Select your learning level
3. Add any specific context or questions (optional)
4. Click "Start Learning" to get comprehensive teaching content

The AI Teacher provides:
- Clear explanations with real-world examples
- Step-by-step breakdowns
- Visual descriptions for graphs and diagrams
- Practice questions and exercises
- Common misconceptions to avoid
- Tips for better understanding

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GEMINI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

The app is configured with `vercel.json` for optimal deployment settings.

## API Endpoints

- `POST /api/syllabus` - Generate personalized curriculum
- `POST /api/teach` - Get teaching content for a topic

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
