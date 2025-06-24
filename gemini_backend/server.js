require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;  // Ensure port is correctly read

// Enable CORS for your React app's origin
// IMPORTANT: Adjust 'http://localhost:5173' if your React app runs on a different port (Vite default is often 5173)
app.use(cors({
  origin: 'https://ai-assistant-pro-1.onrender.com' // <--- Changed from 3000 to 5173 for common Vite default
}));
app.use(express.json());

// Initialize Gemini API
// Ensure GEMINI_API_KEY is read from process.env, which comes from your backend's .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let genAI;
let model;

if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Gemini API initialized successfully on backend.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI on backend:", error);
    // Exit process if API key is critical for server function
    process.exit(1);
  }
} else {
  console.error("GEMINI_API_KEY is not defined in backend .env file. Server cannot function without it.");
  process.exit(1); // Exit if no API key
}

// Chat endpoint
app.post('/chat', async (req, res) => {
  if (!model) {
    return res.status(500).json({ error: 'Gemini model not initialized on server.' });
  }
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ aiResponse: text });

  } catch (error) {
    console.error('Error calling Gemini API for chat:', error);
    res.status(500).json({ error: 'Failed to get AI response from Gemini' });
  }
});

// Code Helper endpoint (already good, just ensure model check)
app.post('/code-helper', async (req, res) => {
  if (!model) {
    return res.status(500).json({ error: 'Gemini model not initialized on server.' });
  }
  try {
    const { code, type, language } = req.body;
    if (!code || !type) {
      return res.status(400).json({ error: 'Code and type are required' });
    }

    let fullPrompt;
    switch (type) {
      case 'explain':
        fullPrompt = `Explain the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide a detailed explanation including its purpose, logic, and any key concepts used. Format it with clear headings and bullet points.`;
        break;
      case 'optimize':
        fullPrompt = `Optimize the following ${language} code for performance, readability, and efficiency. Provide both the original code and the optimized version with a clear explanation of the improvements:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nHighlight the performance improvements and changes made.`;
        break;
      case 'debug':
        fullPrompt = `Analyze the following ${language} code for potential bugs, errors, and edge cases. Provide a detailed debug analysis, pointing out specific lines if possible, and suggest solutions:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nList potential issues found and suggest debugging steps.`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid analysis type' });
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    res.json({ aiResponse: text });

  } catch (error) {
    console.error('Error calling Gemini API for code helper:', error);
    res.status(500).json({ error: 'Failed to analyze code' });
  }
});

// Summarizer endpoint (already good, just ensure model check)
app.post('/summarizer', async (req, res) => {
  if (!model) {
    return res.status(500).json({ error: 'Gemini model not initialized on server.' });
  }
  try {
    const { text, type } = req.body;
    if (!text || !type) {
      return res.status(400).json({ error: 'Text and type are required' });
    }

    let fullPrompt;
    switch (type) {
      case 'summarize':
        fullPrompt = `Summarize the following text concisely, highlighting the main concepts and important details:\n\n${text}`;
        break;
      case 'blog':
        fullPrompt = `Write a blog post based on the following content:\n\n${text}\n\nMake it engaging with an introduction, key takeaways, and a clear call to action.`;
        break;
      case 'tweet':
        fullPrompt = `Create a short, engaging tweet (max 280 characters) from the following text, including relevant hashtags:\n\n${text}`;
        break;
      case 'caption':
        fullPrompt = `Generate a creative and engaging social media caption from the following text:\n\n${text}\n\nInclude emojis and a question to encourage interaction.`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid content generation type' });
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedText = response.text();
    res.json({ aiResponse: generatedText });

  } catch (error) {
    console.error('Error calling Gemini API for summarizer:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
