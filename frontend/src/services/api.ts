import { AnalysisResult } from "../types";

// Pointing to your local FastAPI server
const LOCAL_SERVER_URL = "http://localhost:8000/api/analyze";

export const analyzeEmotionAndChat = async (
  text: string,
  imageBase64: string | null
): Promise<AnalysisResult> => {
  try {
    const response = await fetch(LOCAL_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, image: imageBase64 }),
    });

    if (!response.ok) throw new Error("Backend Error");

    const data = await response.json();
    return { 
      text: data.response,
      mood: data.mood,
      analysis: data.analysis 
    };
  } catch (error) {
    console.error("Connection Error:", error);
    return { 
      text: "I cannot reach the local brain. Is 'server.py' running?",
      mood: "Neutral", 
      analysis: "Offline" 
    };
  }
};