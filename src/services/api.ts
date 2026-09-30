import {
  ScreenshotAnalysis,
  CareerProfile,
  JobMatchResult,
  JobApplicationMaterials,
  ContentResult,
  CommunicationReplyResult,
} from '../types';

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean; model: string }> {
  try {
    const res = await fetch('/api/v1/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'fallback', hasApiKey: false, model: 'local-router' };
  }
}

export async function analyzeScreenshot(
  imageBase64: string,
  options: { processOnce?: boolean; userIntentHint?: string } = {}
): Promise<ScreenshotAnalysis> {
  const res = await fetch('/api/v1/screenshots/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64,
      options,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || errData.details || `Server responded with ${res.status}`);
  }

  const data = await res.json();
  return {
    ...data,
    id: `scan-${Date.now()}`,
    timestamp: new Date().toISOString(),
    imageBase64,
    processedOnceOnly: options.processOnce,
  };
}

export async function askScreenshotQuestion(
  imageBase64: string,
  question: string
): Promise<string> {
  const res = await fetch('/api/v1/screenshots/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, question }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to ask question');
  }

  const data = await res.json();
  return data.answer;
}

export async function generateUiPrompt(
  imageBase64: string,
  targetTool: string,
  promptStyle: string,
  customNotes?: string
): Promise<{ prompt: string; targetTool: string; promptStyle: string }> {
  const res = await fetch('/api/v1/prompts/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64,
      targetTool,
      promptStyle,
      customNotes,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate prompt');
  }

  return await res.json();
}

export async function matchJobWithCareer(
  jobData: any,
  careerProfile: CareerProfile
): Promise<JobMatchResult> {
  const res = await fetch('/api/v1/jobs/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobData, careerProfile }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to match job');
  }

  return await res.json();
}

export async function generateJobMaterials(
  jobData: any,
  careerProfile: CareerProfile
): Promise<JobApplicationMaterials> {
  const res = await fetch('/api/v1/jobs/generate-materials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobData, careerProfile }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate materials');
  }

  return await res.json();
}

export async function generateContent(
  screenshotSummary: string,
  ocrText: string,
  platform: string,
  tone: string,
  goal: string
): Promise<ContentResult> {
  const res = await fetch('/api/v1/content/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      screenshotSummary,
      ocrText,
      platform,
      tone,
      goal,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate content');
  }

  return await res.json();
}

export async function generateCommunicationReply(
  chatContext: string,
  specificInstructions?: string
): Promise<CommunicationReplyResult> {
  const res = await fetch('/api/v1/communication/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatContext,
      specificInstructions,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate reply');
  }

  return await res.json();
}
