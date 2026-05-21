import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export const geminiService = {
  async refineStoryContent(templateId: string, title: string, recipient: string, context: string, targetKey: string = 'all', sender?: string) {
    const ai = getAI();
    
    let focusInstructions = "";
    let exactKeys = "";

    if (targetKey === 'all') {
      focusInstructions = "You are refining the ENTIRE story. Create a cohesive narrative across all fields. Ensure the tone is consistent, poetic, and cinematic.";
      exactKeys = `
      {
        "introLine1": "...",
        "introLine2": "...",
        "beginningText": "...",
        "beginningSubtext": "...",
        "memory1Text": "...",
        "memory2Text": "...",
        "memory3Text": "...",
        "secretMailTitle": "...",
        "secretMailMessage": "...",
        "secretMailFrom": "...",
        "buildupLine1": "...",
        "buildupLine2": "...",
        "finalStatement": "...",
        "interactivePrompt": "..."
      }`;
    } else if (templateId === 'memory-bloom') {
      focusInstructions = "Focus on a deep, poetic narrative with distinct stages: Atmosphere (Intro), Narrative (Memories), and Finale (Reveal).";
      exactKeys = `
    1. introText: (A poetic intro line)
    2. bloomTitle: (An evocative CTA like 'Open your heart')
    3. revealText: (A powerful closing statement)
    4. letterContent: (A long, emotional 3-paragraph letter)`;
    } else {
      focusInstructions = "Focus on a cinematic and emotional narrative structure.";
      exactKeys = `
    1. title: (An evocative title)
    2. introText: (A poetic introduction)
    3. letterContent: (A thoughtful personal message)`;
    }

    const prompt = `You are a cinematic storyteller and emotional architect. Transform the following draft into a deeply emotional, minimal, and poetic narrative for a digital folio template called "${templateId}".
    
    Sender: ${sender || 'Not provided'}
    Recipient: ${recipient}
    Theme: ${title}
    Context: ${context}
    
    ${focusInstructions}
    
    Return a JSON object with these EXACT keys:
    ${exactKeys}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }
};
