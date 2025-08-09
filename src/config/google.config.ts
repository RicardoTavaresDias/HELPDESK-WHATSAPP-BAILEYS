import { GoogleGenAI } from "@google/genai"; 
import { env } from "@/config/env.config";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const AI = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY
});

const model = 'gemini-2.5-flash'

export { AI, model }