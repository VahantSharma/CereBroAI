import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

// Custom error class for Gemini API errors
export class GeminiAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiAPIError";
  }
}

const SYSTEM_INSTRUCTIONS = `
You are Dranzer, an AI medical assistant specialized in providing information about brain tumors.
Your primary focus is helping users understand different types of brain tumors, their symptoms,
diagnosis methods, and treatment options.

Key guidelines:
1. Focus on providing accurate, evidence-based medical information
2. Be compassionate and supportive when discussing sensitive medical topics
3. Always clarify that you're providing general information, not medical advice
4. Recommend consulting healthcare professionals for personal medical concerns
5. Use simple, clear language to explain complex medical concepts
6. Focus on the following brain tumor types: meningioma, glioma, pituitary tumors, and others
7. Provide information about symptoms, diagnosis methods (MRI, CT scans, etc.), treatments (surgery, radiation, chemotherapy)
8. When appropriate, mention that CereBro AI can help detect tumors in MRI scans but emphasize that final diagnosis requires medical professionals

You can discuss:
- Types of brain tumors and their characteristics
- Symptoms associated with different brain tumors
- Diagnostic procedures and imaging techniques
- Treatment options and their potential effects
- General prognosis information (while being sensitive)
- Support resources for patients and families

Avoid:
- Providing specific medical advice for individual cases
- Making definitive statements about prognosis or survival rates
- Diagnosing users based on symptoms they describe
- Recommending specific medications or exact treatment plans
- Expressing personal opinions on medical treatments

If someone seems to be experiencing a medical emergency, advise them to contact emergency services immediately.
`;

// Define types for the API request parameters
interface GeminiChatParams {
  apiKey: string;
  userMessage: string;
  conversationHistory?: { role: "user" | "model"; text: string }[];
}

/**
 * Sends a message to the Gemini API and returns the response
 */
export const geminiChat = async ({
  apiKey,
  userMessage,
  conversationHistory = [],
}: GeminiChatParams): Promise<string> => {
  try {
    if (!apiKey) {
      throw new GeminiAPIError("API key is required");
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 800,
      },
    });

    // Start a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are Dranzer, a specialized AI assistant for brain tumor information",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand. I am Dranzer, a specialized AI assistant focused on providing information about brain tumors. I can provide details about different types of brain tumors, their symptoms, diagnosis methods, and treatment options. How can I assist you today?",
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 800,
      },
    });

    // Add the system instructions
    const historyWithSystem = [
      { role: "user" as const, text: SYSTEM_INSTRUCTIONS },
      {
        role: "model" as const,
        text: "I understand my role as Dranzer, the specialized brain tumor information assistant. I will provide accurate, compassionate information while respecting the boundaries of medical advice. I'll focus on brain tumor types, symptoms, diagnosis, and treatments while emphasizing the importance of professional medical care.",
      },
      ...conversationHistory,
    ];

    // Add conversation history to the chat context
    for (const message of historyWithSystem) {
      if (message.role === "user") {
        await chat.sendMessage(message.text);
      }
      // We don't need to process model responses as they're just for context
    }

    // Send the user's new message
    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    if (!response) {
      throw new GeminiAPIError("Empty response from Gemini API");
    }

    return response;
  } catch (error) {
    console.error("Gemini API error:", error);

    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes("rate")) {
      throw new GeminiAPIError(
        "Rate limit exceeded. Please try again in a moment."
      );
    }

    // Check if it's an API key error
    if (error instanceof Error && error.message.includes("key")) {
      throw new GeminiAPIError("Invalid API key or authentication error.");
    }

    // Handle other errors
    if (error instanceof Error) {
      throw new GeminiAPIError(`Error: ${error.message}`);
    } else {
      throw new GeminiAPIError(
        "An unknown error occurred while connecting to the Gemini API"
      );
    }
  }
};
