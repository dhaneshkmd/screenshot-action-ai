import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { screenshotSummary, ocrText, platform = 'linkedin', tone = 'insightful', goal = 'engagement' } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const prompt = `Repurpose this screenshot analysis into viral social content.
Summary: ${screenshotSummary}.
OCR: ${ocrText}.
Target: ${platform}. Tone: ${tone}. Goal: ${goal}.
Output JSON with:
- headline: string
- hook: string
- main_post: string
- call_to_action: string
- alternative_hooks: array of string`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return res.status(200).json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Content generation failed' });
  }
}
