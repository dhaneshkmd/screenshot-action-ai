import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { jobData, careerProfile } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const prompt = `Evaluate candidate match between Candidate Profile: ${JSON.stringify(careerProfile)} and Job Requirements: ${JSON.stringify(jobData)}.
Output strictly valid JSON with properties: match_percentage (number 0-100), match_summary (string), matching_skills (array of string), missing_skills (array of string), strengths (array of string), cv_improvement_recommendations (array of string), interview_readiness_score (number 0-100).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return res.status(200).json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Job match failed' });
  }
}
