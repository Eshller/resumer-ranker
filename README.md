# ResumeRank AI

An intelligent resume screening tool that uses AI to match candidates with job descriptions. Built with Next.js, Genkit, and supports both Google Gemini and OpenAI models.

## Features

- **Multi-LLM Support**: Choose between Google Gemini 2.0 Flash and OpenAI GPT-4o
- **PDF Resume Processing**: Upload and extract text from PDF resumes
- **AI-Powered Analysis**: Extract skills and keywords using advanced AI models
- **Match Scoring**: Calculate semantic match scores between resumes and job descriptions
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and shadcn/ui

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resumer-ranker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   
   ```env
   # Google AI (Gemini) API Key
   # Get your API key from: https://aistudio.google.com/app/apikey
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   
   # OpenAI API Key
   # Get your API key from: https://platform.openai.com/api-keys
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:9002](http://localhost:9002)

## Usage

1. **Upload Resumes**: Drag and drop or select PDF resume files
2. **Paste Job Description**: Enter the complete job description
3. **Choose AI Model**: Select between Gemini 2.0 Flash or GPT-4o
4. **Start Screening**: Click the button to begin analysis
5. **Review Results**: View match scores and top matched skills for each candidate

## API Keys

### Google AI (Gemini)
- Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Add it to your `.env.local` file as `GOOGLE_AI_API_KEY`

### OpenAI
- Visit [OpenAI Platform](https://platform.openai.com/api-keys)
- Create a new API key
- Add it to your `.env.local` file as `OPENAI_API_KEY`

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: Tailwind CSS, shadcn/ui, Radix UI
- **AI Framework**: Genkit
- **LLM Providers**: Google Gemini, OpenAI
- **PDF Processing**: PDF.js
- **Styling**: Tailwind CSS with custom animations

## Development

```bash
# Start development server
npm run dev

# Start Genkit development server
npm run genkit:dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

## License

This project is licensed under the MIT License.
