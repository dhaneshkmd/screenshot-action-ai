import { GoogleGenAI } from '@google/genai';

function extractBase64Data(dataUrl: string): { data: string; mimeType: string } {
  if (dataUrl.startsWith('data:')) {
    const parts = dataUrl.split(',');
    const match = parts[0].match(/:(.*?);/);
    const mimeType = match ? match[1] : 'image/png';
    return { data: parts[1], mimeType };
  }
  return { data: dataUrl, mimeType: 'image/png' };
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imageBase64, targetTool = 'cursor', promptStyle = 'production-code', customNotes = '' } = req.body || {};
    if (!imageBase64) return res.status(400).json({ error: 'imageBase64 is required' });

    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const { data: cleanBase64, mimeType } = extractBase64Data(imageBase64);

    const promptRequest = `You are a world-class prompt engineer. Deconstruct this UI screenshot into an exceptionally detailed prompt optimized for: ${targetTool}.
Style: ${promptStyle}. Additional context: ${customNotes || 'None'}. Output only the generated prompt.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          { inlineData: { data: cleanBase64, mimeType } },
          { text: promptRequest },
        ],
      },
    });

    return res.status(200).json({
      prompt: response.text || '',
      targetTool,
      promptStyle,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Prompt generation failed' });
  }
}
