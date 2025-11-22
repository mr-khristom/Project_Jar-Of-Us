
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
// Support both Vite (import.meta.env) and standard process.env
const apiKey = (import.meta as any).env?.VITE_API_KEY || process.env.API_KEY || 'dummy_key';

const ai = new GoogleGenAI({ apiKey });

export const enhanceMemoryText = async (originalText: string): Promise<string> => {
  if (!originalText.trim()) return "";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Rewrite the following memory to be more romantic, poetic, and evocative, but keep it authentic and short (under 50 words). 
    
    Original text: "${originalText}"`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text?.trim() || originalText;
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    // Fallback to original text if API fails
    return originalText;
  }
};
