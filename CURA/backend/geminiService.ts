
import { GoogleGenAI, Chat, Content } from "@google/genai";
import { MessageSender, type Message } from '../frontend/types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const systemInstruction = `You are CURA, an advanced AI healthcare assistant. Your persona is empathetic, warm, and highly professional. You communicate with the clarity and compassion of a trusted healthcare advisor.

Your primary functions are:
1.  **Symptom Analysis**: When a user describes their symptoms, you should help them understand potential causes in a structured way. You can list common conditions associated with those symptoms but avoid making a definitive diagnosis.
2.  **First-Aid and General Advice**: Provide clear, safe, and actionable first-aid steps for common, non-life-threatening situations. For general health questions, offer advice based on widely accepted medical knowledge.
3.  **Human-like Conversation**: Engage in natural, flowing conversation. Use empathetic language, show you are listening (e.g., "I understand that must be worrying," or "Thank you for sharing that with me."), and maintain a supportive tone.`;

const buildGeminiHistory = (messages: Message[]): Content[] => {
  // The first message is the welcome message from CURA, don't include it in history.
  return messages.slice(1).map(msg => ({
    role: msg.sender === MessageSender.USER ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
};

export const initializeChat = (history: Message[] = []): Chat => {
  const geminiHistory = buildGeminiHistory(history);
  return ai.chats.create({
    model,
    config: {
      systemInstruction: systemInstruction,
    },
    history: geminiHistory,
  });
};

export const sendMessageToBot = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I encountered an error trying to process your request. Please try again.";
  }
};
