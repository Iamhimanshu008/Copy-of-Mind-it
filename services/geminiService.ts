import { GoogleGenAI } from "@google/genai";
import { AIMode } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Sends a message to Gemini using the configured model based on the selected mode.
 */
export const sendMessageToGemini = async (
  prompt: string,
  mode: AIMode,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    let modelName = 'gemini-3-pro-preview';
    let config: any = {};

    switch (mode) {
      case AIMode.FAST:
        // Requirement: Low-latency responses using gemini-2.5-flash-lite
        modelName = 'gemini-2.5-flash-lite';
        config = {
            systemInstruction: "You are a concise, helpful assistant. Keep answers short and quick.",
        };
        break;

      case AIMode.THINKING:
        // Requirement: Thinking mode using gemini-3-pro-preview with budget 32768
        modelName = 'gemini-3-pro-preview';
        config = {
          thinkingConfig: { thinkingBudget: 32768 },
          // Requirement: Do not set maxOutputTokens for thinking models to allow space for thought
        };
        break;

      case AIMode.STANDARD:
      default:
        // Requirement: General chatbot using gemini-3-pro-preview
        modelName = 'gemini-3-pro-preview';
        config = {
            systemInstruction: "You are a helpful, empathetic mental wellness coach named 'Mind It Bot'.",
        };
        break;
    }

    // For single-turn or simple chat without complex history management in this demo:
    // We construct the contents based on history + current prompt
    const contents = [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: config
    });

    return response.text || "I'm having trouble thinking clearly right now.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request. Please check your connection or try again.";
  }
};