import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

export const initializeAI = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return;
  }
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = genAI.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Slightly creative but grounded
    },
  });
};

export const sendMessageToPaiJose = async (message: string): Promise<string> => {
  if (!genAI || !chatSession) {
    initializeAI();
  }
  
  if (!chatSession) {
    throw new Error("Não foi possível iniciar a conexão com a espiritualidade (API Error).");
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({ message });
    return result.text || "Zifio, não consegui ouvir direito. Pode repetir?";
  } catch (error) {
    console.error("Erro ao consultar Pai José:", error);
    return "Minhas pernas estão cansadas agora, meu filho. Houve um erro na conexão. Tente novamente mais tarde.";
  }
};

export const generateAudioResponse = async (text: string): Promise<string | null> => {
  if (!genAI) {
    initializeAI();
  }
  
  if (!genAI) return null;

  try {
    // We use a separate model call specifically for TTS
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: 'Charon' // 'Charon' is typically a deeper, male voice suitable for Pai José
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Erro ao gerar voz:", error);
    return null;
  }
};