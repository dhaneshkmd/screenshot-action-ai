import { GoogleGenAI, Type } from '@google/genai';

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
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, mimeType = 'image/png', options = {} } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please add it to Vercel Environment Variables.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const { data: cleanBase64, mimeType: resolvedMime } = extractBase64Data(imageBase64);

    const systemInstruction = `You are the core intelligence engine for an AI Screenshot-to-Action app.
Analyze the user's screenshot image thoroughly.

Your tasks:
1. SECURITY & SENSITIVE DATA SCAN: Check for passwords, OTP codes, credit cards, bank account numbers, secret keys, or medical records. If detected, flag sensitive_data_detected=true and describe what was detected in sensitive_data_warning.
2. CLASSIFICATION: Classify the content into one of:
   - "job_vacancy" (job listing, vacancy poster, LinkedIn hire post)
   - "ui_design" (SaaS dashboard, mobile app screen, website layout, wireframe)
   - "chat_message" (WhatsApp, SMS, Slack, email, social comment conversation)
   - "event_poster" (webinar, conference, concert, ticket, invitation, meetup)
   - "receipt_invoice" (store receipt, bill, invoice, payment slip)
   - "contact_card" (business card, phone number list, email signature, QR details)
   - "location_place" (restaurant, hotel, map screenshot, tourist spot, address)
   - "product_listing" (e-commerce product, price tag, gadget spec)
   - "code_error" (terminal error, stack trace, coding bug, IDE screenshot)
   - "document_note" (article, book page, slide, infographic, study material)
   - "general" (other screenshots)
3. EXTRACTION: Extract all relevant structured entities (e.g. title, company, salary, location, email, phone, dates, prices, items, URLs, requirements, tech stack, key error text).
4. INTENT DETECTION: What does the user most likely want to do with this?
5. RECOMMENDED ACTIONS: Provide 3 to 6 high-value action items with priority (1=highest), action id, and human-friendly label.
6. CONTEXTUAL QUESTIONS: 4 quick questions the user might ask about this specific image.

Output strictly valid JSON matching the requested structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: resolvedMime || mimeType,
            },
          },
          {
            text: `Analyze this screenshot according to instructions. Hint/context: ${options.userIntentHint || 'None'}. Return strictly JSON.`,
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content_type: {
              type: Type.STRING,
              description: 'Classified type of screenshot',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score from 0.0 to 1.0',
            },
            summary: {
              type: Type.STRING,
              description: 'Clear, concise 2-sentence summary of what this screenshot shows',
            },
            detected_title: {
              type: Type.STRING,
              description: 'Human-friendly title for this screenshot content',
            },
            ocr_text: {
              type: Type.STRING,
              description: 'Key extracted text visible in the screenshot',
            },
            sensitive_data_detected: {
              type: Type.BOOLEAN,
              description: 'True if OTPs, credit cards, passwords, or personal banking info were detected',
            },
            sensitive_data_warning: {
              type: Type.STRING,
              description: 'Warning text if sensitive data was spotted, advising process-once only',
            },
            entities: {
              type: Type.OBJECT,
              properties: {
                job_title: { type: Type.STRING },
                company_or_merchant: { type: Type.STRING },
                location_or_venue: { type: Type.STRING },
                dates_or_deadlines: { type: Type.STRING },
                prices_or_salary: { type: Type.STRING },
                emails: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                phones: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                urls: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                key_skills_or_tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                sender_or_speaker: { type: Type.STRING },
              },
            },
            user_intent: {
              type: Type.STRING,
              description: 'Most likely user goal',
            },
            recommended_actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  priority: { type: Type.INTEGER },
                },
                required: ['id', 'label', 'priority'],
              },
            },
            suggested_questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'content_type',
            'confidence',
            'summary',
            'detected_title',
            'ocr_text',
            'sensitive_data_detected',
            'entities',
            'user_intent',
            'recommended_actions',
            'suggested_questions',
            'tags',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('[Vercel Serverless Screenshot Analyze Error]:', error);
    return res.status(500).json({ error: error.message || 'Analysis failed' });
  }
}
