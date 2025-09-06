# Deployment Guide for AI Tutor

## Prerequisites

1. **Google Gemini API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Account**: For version control and deployment

## Step-by-Step Deployment

### 1. Prepare Your Environment

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd ai-tutor

# Install dependencies
npm install

# Create environment file
cp env.example .env.local
```

### 2. Add Your Gemini API Key

Edit `.env.local` and add your actual API key:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Test Locally (Optional)

```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test both AI agents to ensure they work
```

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - Go to Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your actual API key
6. Click "Deploy"

### 5. Configure Environment Variables in Vercel

In your Vercel dashboard:
1. Go to your project
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
   - **Environment**: Production (and Preview if desired)

### 6. Verify Deployment

1. Visit your deployed URL
2. Test the AI Syllabus Agent:
   - Fill out the form with sample data
   - Click "Generate My Curriculum"
   - Verify you get a personalized curriculum
3. Test the AI Teacher Agent:
   - Enter a topic (e.g., "Photosynthesis")
   - Select your level
   - Click "Start Learning"
   - Verify you get comprehensive teaching content

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY environment variable is required"**
   - Ensure you've added the environment variable in Vercel
   - Redeploy after adding the variable

2. **"Failed to generate curriculum/teaching content"**
   - Check your Gemini API key is valid
   - Verify you have API quota remaining
   - Check Vercel function logs for detailed errors

3. **Build fails**
   - Ensure all dependencies are installed
   - Check for TypeScript errors
   - Verify Next.js configuration

### Checking Logs

In Vercel dashboard:
1. Go to your project
2. Click "Functions" tab
3. Check logs for any errors

## Security Notes

- Never commit `.env.local` to version control
- Keep your Gemini API key secure
- Consider using Vercel's environment variable encryption
- Monitor API usage to avoid unexpected charges

## Performance Optimization

- The app is optimized for production with Next.js 14
- Static assets are automatically optimized
- API routes are serverless and scale automatically
- Consider implementing caching for frequently requested content

## Monitoring

- Monitor your Gemini API usage in Google AI Studio
- Check Vercel analytics for user engagement
- Set up error monitoring if needed

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel and Gemini API documentation
3. Open an issue in the GitHub repository
