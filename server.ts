import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing with generous limit for screenshot base64 data
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Normalize URL prefix for Vercel serverless rewrites
app.use((req, res, next) => {
  if (req.url.startsWith('/v1/')) {
    req.url = '/api' + req.url;
  }
  next();
});

// Initialize GoogleGenAI client per guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Helper to strip data URL prefix
function extractBase64Data(dataUrl: string): { data: string; mimeType: string } {
  if (dataUrl.startsWith('data:')) {
    const parts = dataUrl.split(',');
    const match = parts[0].match(/:(.*?);/);
    const mimeType = match ? match[1] : 'image/png';
    return { data: parts[1], mimeType };
  }
  return { data: dataUrl, mimeType: 'image/png' };
}

// 1. POST /api/v1/screenshots/analyze
app.post('/api/v1/screenshots/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png', options = {} } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

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
              description: 'Concise 1-2 sentence executive summary of what is seen',
            },
            detected_title: {
              type: Type.STRING,
              description: 'Main heading, job title, event name, merchant or screen title',
            },
            ocr_text: {
              type: Type.STRING,
              description: 'Key extracted visible text segments',
            },
            sensitive_data_detected: {
              type: Type.BOOLEAN,
              description: 'Whether passwords, bank cards, OTPs, or private PII were spotted',
            },
            sensitive_data_warning: {
              type: Type.STRING,
              description: 'Warning notice if sensitive data detected',
            },
            entities: {
              type: Type.OBJECT,
              properties: {
                job_title: { type: Type.STRING },
                company_or_merchant: { type: Type.STRING },
                location_or_venue: { type: Type.STRING },
                dates_or_deadlines: { type: Type.STRING },
                emails: { type: Type.ARRAY, items: { type: Type.STRING } },
                phones: { type: Type.ARRAY, items: { type: Type.STRING } },
                urls: { type: Type.ARRAY, items: { type: Type.STRING } },
                prices_or_salary: { type: Type.STRING },
                key_skills_or_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                line_items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.STRING },
                    },
                  },
                },
                sender_or_speaker: { type: Type.STRING },
                code_language_or_framework: { type: Type.STRING },
              },
            },
            user_intent: {
              type: Type.STRING,
              description: 'Inferred primary user goal',
            },
            recommended_actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  priority: { type: Type.INTEGER },
                  icon: { type: Type.STRING },
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
            'sensitive_data_detected',
            'recommended_actions',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Screenshot analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze screenshot',
      details: error.message || String(error),
    });
  }
});

// 2. POST /api/v1/screenshots/ask
app.post('/api/v1/screenshots/ask', async (req, res) => {
  try {
    const { imageBase64, question, mimeType = 'image/png' } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const parts: any[] = [];
    if (imageBase64) {
      const { data: cleanBase64, mimeType: resolvedMime } = extractBase64Data(imageBase64);
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: resolvedMime || mimeType,
        },
      });
    }

    parts.push({
      text: `You are an expert mobile AI assistant answering a user's question about their screenshot.
User Question: "${question}"
Provide a direct, crystal-clear, structured response with bullet points and actionable advice if helpful. Include extracted details (phone, email, dates, figures) whenever relevant.`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Ask error:', error);
    return res.status(500).json({ error: error.message || 'Failed to process question' });
  }
});

// 3. POST /api/v1/prompts/generate
app.post('/api/v1/prompts/generate', async (req, res) => {
  try {
    const { imageBase64, targetTool = 'Claude / Cursor', promptStyle = 'Flutter App', customNotes = '' } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const parts: any[] = [];
    if (imageBase64) {
      const { data: cleanBase64, mimeType } = extractBase64Data(imageBase64);
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType,
        },
      });
    }

    parts.push({
      text: `You are an elite Prompt Engineer & Technical Architect.
The user wants to convert this screenshot into a production-grade prompt for: "${targetTool}".
Target Implementation Style: "${promptStyle}".
Additional User Notes: "${customNotes}".

Deconstruct the visual hierarchy, UI components (headers, cards, sidebars, typography, colors, padding, responsive behavior, animations, state management).
Write a prompt that the user can immediately paste into ${targetTool} to recreate this interface or feature cleanly.

Format your answer with:
1. Executive Prompt (Ready-to-Copy)
2. UI Component Breakdown
3. Recommended Tech Stack & State Management
4. Edge Cases & Accessibility Notes`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
    });

    return res.json({
      prompt: response.text,
      targetTool,
      promptStyle,
    });
  } catch (error: any) {
    console.error('Prompt generate error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate prompt' });
  }
});

// 4. POST /api/v1/jobs/match
app.post('/api/v1/jobs/match', async (req, res) => {
  try {
    const { jobData, careerProfile } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `You are a Senior Career Coach and Technical Recruiter.
Compare the following Job Vacancy details against the user's Career Profile.

JOB VACANCY DETAILS:
${JSON.stringify(jobData, null, 2)}

USER CAREER PROFILE:
${JSON.stringify(careerProfile, null, 2)}

Provide a strict, realistic match assessment in JSON format:
- match_percentage (0 to 100)
- match_summary (high-level verdict)
- matching_skills (array of strings)
- missing_skills (array of strings that the candidate needs to highlight or learn)
- strengths (array of strings)
- cv_improvement_recommendations (array of specific actionable resume tweaks)
- interview_readiness_score (0 to 100)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Job match error:', error);
    return res.status(500).json({ error: error.message || 'Failed to match job' });
  }
});

// 5. POST /api/v1/jobs/generate-materials
app.post('/api/v1/jobs/generate-materials', async (req, res) => {
  try {
    const { jobData, careerProfile } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `You are an executive career strategist and copywriter.
Generate tailored application materials for this specific job posting based on the candidate's career profile.

JOB POSTING:
Title: ${jobData.job_title || jobData.detected_title || 'Open Position'}
Company: ${jobData.company || jobData.entities?.company_or_merchant || 'Hiring Company'}
Location: ${jobData.location || jobData.entities?.location_or_venue || 'Remote / Unspecified'}
Requirements/Skills: ${JSON.stringify(jobData.entities?.key_skills_or_tags || jobData.ocr_text || '')}

CANDIDATE:
Name: ${careerProfile.fullName || 'Candidate'}
Title: ${careerProfile.title || 'Professional'}
Experience: ${careerProfile.summary || careerProfile.experienceYears || ''}
Skills: ${(careerProfile.skills || []).join(', ')}

Return strictly JSON with:
1. tailored_cv_summary: A 3-4 sentence professional summary tailored to this position.
2. tailored_bullet_points: 4-5 bullet points highlighting relevant achievements.
3. cover_letter: Full, polite, persuasive cover letter ready to send.
4. application_email: {
     recipient: (use extracted email if available or "hiring-team@company.com"),
     subject: Professional subject line including job title and candidate name,
     body: Engaging email body,
     attachments_reminder: List of docs to attach (e.g. Resume, Portfolio)
   }
5. linkedin_outreach: Short 300-character LinkedIn intro message to the recruiter.
6. interview_prep: Top 3 likely technical or behavioral questions with suggested talking points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Materials generation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate job materials' });
  }
});

// 6. POST /api/v1/content/generate
app.post('/api/v1/content/generate', async (req, res) => {
  try {
    const { screenshotSummary, ocrText, platform = 'LinkedIn', tone = 'Professional', goal = 'Inform & Engage' } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `You are a viral social media architect and brand storyteller.
Create original content based on this screenshot context (do NOT copy protected content verbatim, transform it with fresh value):
Context Summary: ${screenshotSummary}
Extracted Text: ${ocrText}
Target Platform: ${platform} (e.g. LinkedIn, X/Twitter, Instagram, YouTube Script, Blog Outline)
Tone: ${tone} (e.g. Professional, Inspirational, Educational, Viral, Technical)
Goal: ${goal}

Generate:
- headline
- main_post (formatted with hashtags, emojis, line breaks appropriate for ${platform})
- hook
- call_to_action
- alternative_hooks (array of 2 snappy alternatives)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Content generate error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
});

// 7. POST /api/v1/communication/reply
app.post('/api/v1/communication/reply', async (req, res) => {
  try {
    const { chatContext, specificInstructions = '' } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `You are an AI communication assistant.
The user took a screenshot of a message, email, or chat conversation:
Context: ${chatContext}
Additional user instructions: ${specificInstructions}

Generate 4 distinct reply variations:
1. professional: Polished, respectful, business-ready.
2. friendly: Warm, conversational, approachable.
3. concise: Direct, short, to the point.
4. firm_or_negotiate: Assertive, boundary-setting or politely negotiating.

Also provide:
- key_takeaway: 1 sentence summary of what the other person is asking for.
- detected_sender: name or role if detected.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Reply error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate reply' });
  }
});

// Static assets & Vite development server handling
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[SnapAction AI Server] Running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

