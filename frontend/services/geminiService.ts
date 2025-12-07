import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ParsedTaskResponse } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const parseVoiceCommand = async (
  audioBase64: string,
  mimeType: string
): Promise<ParsedTaskResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const currentDate = new Date().toISOString();

  // 1. Move configuration into the initial model setup
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest", // Confirmed working via live test script
    systemInstruction: `
      You are an assistant that extracts tasks from audio.
      Current Date: ${currentDate}
      Return JSON with: title, description, status (To Do/In Progress/Done), 
      priority (Low/Medium/High/Critical), dueDate (ISO), and originalTranscript.
    `,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          status: { type: SchemaType.STRING },
          priority: { type: SchemaType.STRING },
          dueDate: { type: SchemaType.STRING },
          originalTranscript: { type: SchemaType.STRING },
        },
        required: ["title", "originalTranscript"],
      },
    },
  });

  try {
    // 2. Pass data as a single Content object
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: audioBase64,
        },
      },
      "Extract task details from this audio stringently following the schema."
    ]);

    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response text");

    return JSON.parse(text) as ParsedTaskResponse;
  } catch (error: any) {
    // 3. Debugging: Log the exact error message from the API
    console.error("Gemini Error:", error);

    if (error.message?.includes("404")) {
      throw new Error("Model not found. Please ensure gemini-1.5-flash is enabled in AI Studio.");
    }

    throw new Error(`Failed to parse voice command: ${error.message}`);
  }
};