import { GoogleGenAI, Type } from "@google/genai";
import { ParsedTaskResponse, TaskStatus, TaskPriority } from "../types";

const apiKey = process.env.API_KEY;
// Note: In a real production app, you might proxy this through a backend. 
// For this demo, we use the key directly in the frontend as per instructions.
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const parseVoiceCommand = async (audioBase64: string, mimeType: string): Promise<ParsedTaskResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const currentDate = new Date().toISOString();
  
  const systemInstruction = `
    You are an intelligent task assistant. 
    Your goal is to listen to the user's voice command and extract structured task information.
    
    Current Date: ${currentDate}
    
    Rules:
    1. Extract a concise 'title'.
    2. Extract a 'description' if more details are provided.
    3. Determine 'priority' from keywords (e.g., "urgent" -> Critical, "high" -> High). Default to Medium.
    4. Determine 'status' (e.g., "completed" -> Done, "working on" -> In Progress). Default to To Do.
    5. Calculate the 'dueDate' as an ISO 8601 string (YYYY-MM-DDTHH:mm:ss). 
       - If a time is mentioned (e.g., "by 5pm"), include it in the ISO string.
       - If only a date is mentioned (e.g., "tomorrow"), use the date with T12:00:00 or leaving time implicit is fine, but preferably T23:59:59 if it implies 'by end of day'.
       - If no date is mentioned, return null.
    6. Return the raw transcript of what was said as 'originalTranscript'.
  `;

  const model = "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64
            }
          },
          {
            text: "Listen to this audio, transcribe it, and extract the task details as JSON."
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            status: { type: Type.STRING, enum: [TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.Done] },
            priority: { type: Type.STRING, enum: [TaskPriority.Low, TaskPriority.Medium, TaskPriority.High, TaskPriority.Critical] },
            dueDate: { type: Type.STRING, description: "ISO 8601 date string YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss" },
            originalTranscript: { type: Type.STRING }
          },
          required: ["title", "originalTranscript"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const parsed = JSON.parse(text) as ParsedTaskResponse;
    return parsed;

  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error("Failed to parse voice command.");
  }
};