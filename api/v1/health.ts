export default function handler(req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY || '';
  res.status(200).json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
}
