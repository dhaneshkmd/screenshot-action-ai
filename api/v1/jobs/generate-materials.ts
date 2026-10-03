import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { jobData, careerProfile } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const prompt = `Generate tailored application materials for candidate: ${JSON.stringify(careerProfile)} applying to job: ${JSON.stringify(jobData)}.
Output JSON with:
- tailored_cv_summary: string
- tailored_bullet_points: array of string
- cover_letter: string
- application_email: { recipient: string, subject: string, body: string, attachments_reminder: array of string }
- linkedin_outreach: string
- interview_prep: array of { question: string, talking_point: string }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return res.status(200).json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to generate application materials' });
  }
}
