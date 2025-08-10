import { GoogleGenAI } from "@google/genai"; 
import { env } from "@/config/env.config";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY
});

export { gemini }