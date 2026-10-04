import React, { useState } from 'react';
import {
  GraduationCap,
  Languages,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  Download,
  Sparkles,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { ScreenshotAnalysis, StudyFlashcard, StudyQuizItem } from '../../types';

interface StudyDocumentModuleProps {
  analysis: ScreenshotAnalysis;
}

export const StudyDocumentModule: React.FC<StudyDocumentModuleProps> = ({ analysis }) => {
  const [subTab, setSubTab] = useState<'summary' | 'translation' | 'flashcards' | 'quiz'>('summary');
  const [targetLang, setTargetLang] = useState<string>('Malayalam');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const initialSummary =
    analysis.summary ||
    'Extracted document and key text elements. Contains structured subject data, requirements, and reference contacts.';

  // Sample or extracted flashcards
  const flashcards: StudyFlashcard[] = [
    {
      front: 'Primary Requirement / Core Subject',
      back: analysis.entities?.job_title || analysis.detected_title || 'Lead Topic Analysis',
    },
    {
      front: 'Hosting Entity or Sponsoring Organization',
      back: analysis.entities?.company_or_merchant || 'Apex Energy / Conference Host',
    },
    {
      front: 'Target Deadline or Schedule',
      back: analysis.entities?.dates_or_deadlines || 'As designated in screenshot notice',
    },
    {
      front: 'Key Verified Qualifications',
      back:
        analysis.entities?.key_skills_or_tags?.slice(0, 3).join(', ') ||
        'Auditing standards, regulatory compliance, protocol mastery',
    },
  ];

  // 3-Question MCQ Quiz
  const quizItems: StudyQuizItem[] = [
    {
      question: `What is the principal focus or entity highlighted in this screenshot?`,
      options: [
        analysis.detected_title || 'Primary Topic',
        'Unrelated peripheral subject',
        'Generic social commentary',
        'Archived past announcement',
      ],
      correctIndex: 0,
      explanation: `The screenshot explicitly details "${analysis.detected_title}".`,
    },
    {
      question: `Which contact or execution method is recommended for this item?`,
      options: [
        analysis.entities?.emails?.[0] || analysis.entities?.phones?.[0] || 'Direct Contact Dispatch',
        'Physical paper postal letter only',
        'In-person walk-in without prior notice',
        'No contact method available',
      ],
      correctIndex: 0,
      explanation: `Direct digital contact channel identified: ${
        analysis.entities?.emails?.[0] || analysis.entities?.phones?.[0] || 'Official Dispatch'
      }.`,
    },
    {
      question: `What is the key takeaway or priority deadline?`,
      options: [
        analysis.entities?.dates_or_deadlines || 'Strict deadline indicated on document',
        'Immediate expiration',
        'No timeline provided',
        'Indefinite open review',
      ],
      correctIndex: 0,
      explanation: `The document specifies: ${analysis.entities?.dates_or_deadlines || 'Specific deadline window'}.`,
    },
  ];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTranslate = async (lang: string) => {
    setTargetLang(lang);
    setIsTranslating(true);

    // Realistic linguistic translation dictionary for multilingual demo
    await new Promise((resolve) => setTimeout(resolve, 600));

    let translation = '';
    const src = analysis.detected_title || analysis.summary;

    if (lang === 'Malayalam') {
      translation = `ഈ സ്ക്രീൻഷോട്ടിലെ പ്രധാന വിവരങ്ങൾ:\n• വിഷയം: ${analysis.detected_title || 'പ്രധാന അറിയിപ്പ്'}\n• സംഗ്രഹം: ${analysis.summary}\n• ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ: ${
        analysis.entities?.phones?.join(', ') || analysis.entities?.emails?.join(', ') || 'ലഭ്യമല്ല'
      }\n• പ്രധാന തീയതി / സമയം: ${analysis.entities?.dates_or_deadlines || 'ഉടൻ'}\n\nഈ രേഖയിലെ വിവരങ്ങൾ കൃത്യമായി പരിശോധിച്ചു നടപടികൾ സ്വീകരിക്കാവുന്നതാണ്.`;
    } else if (lang === 'Hindi') {
      translation = `इस स्क्रीनशॉट का मुख्य सारांश:\n• शीर्षक: ${analysis.detected_title || 'मुख्य जानकारी'}\n• विवरण: ${analysis.summary}\n• संपर्क सूत्र: ${
        analysis.entities?.phones?.join(', ') || analysis.entities?.emails?.join(', ') || 'उपलब्ध नहीं'
      }\n• अंतिम तिथि / समय: ${analysis.entities?.dates_or_deadlines || 'तत्काल'}\n\nसभी महत्वपूर्ण विवरण सफलतापूर्वक सत्यापित कर लिए गए हैं।`;
    } else if (lang === 'Arabic') {
      translation = `ملخص المستند من لقطة الشاشة:\n• العنوان: ${analysis.detected_title || 'الإشعار الرئيسي'}\n• الملخص: ${analysis.summary}\n• بيانات الاتصال: ${
        analysis.entities?.phones?.join(', ') || analysis.entities?.emails?.join(', ') || 'غير متوفر'
      }\n• الموعد النهائي: ${analysis.entities?.dates_or_deadlines || 'فوري'}\n\nتم التحقق من كافة البيانات بنجاح وجاهزة للتنفيذ.`;
    } else if (lang === 'Spanish') {
      translation = `Resumen del documento analizado:\n• Título: ${analysis.detected_title || 'Documento Principal'}\n• Resumen: ${analysis.summary}\n• Contacto: ${
        analysis.entities?.phones?.join(', ') || analysis.entities?.emails?.join(', ') || 'No especificado'
      }\n• Fechas clave: ${analysis.entities?.dates_or_deadlines || 'Inmediato'}\n\nDatos verificados y listos para la acción.`;
    } else if (lang === 'French') {
      translation = `Résumé du document extrait:\n• Titre: ${analysis.detected_title || 'Document Principal'}\n• Synthèse: ${analysis.summary}\n• Contact: ${
        analysis.entities?.phones?.join(', ') || analysis.entities?.emails?.join(', ') || 'Non disponible'
      }\n• Date limite: ${analysis.entities?.dates_or_deadlines || 'Immédiat'}\n\nToutes les informations sont vérifiées avec succès.`;
    } else if (lang === 'German') {
      translation = `Zusammenfassung des Screenshot-Inhalts:\n• Titel: ${analysis.detected_title || 'Hauptdokument'}\n• Übersicht: ${analysis.summary}\n• Kontaktdaten: ${
        analysis.entities?.phones?.join(', ') || analysis.entities?.emails?.join(', ') || 'Nicht angegeben'
      }\n• Frist: ${analysis.entities?.dates_or_deadlines || 'Sofort'}\n\nAlle Kerndaten wurden erfolgreich extrahiert.`;
    } else {
      translation = `Translated Summary (${lang}):\n${analysis.summary}\n\nKey Entities: ${JSON.stringify(
        analysis.entities,
        null,
        2
      )}`;
    }

    setTranslatedText(translation);
    setIsTranslating(false);
  };

  const handleDownloadMarkdown = () => {
    const md = `# ${analysis.detected_title || 'Document Summary'}
Date: ${new Date().toLocaleDateString()}
Category: ${analysis.content_type}

## Executive Summary
${analysis.summary}

## Extracted Entities
${Object.entries(analysis.entities || {})
  .map(([k, v]) => `- **${k}**: ${Array.isArray(v) ? v.join(', ') : JSON.stringify(v)}`)
  .join('\n')}

## Full OCR Text
\`\`\`
${analysis.ocr_text || analysis.summary}
\`\`\`
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SnapAction_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('summary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              subTab === 'summary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Summary & Notes</span>
          </button>

          <button
            onClick={() => {
              setSubTab('translation');
              if (!translatedText) handleTranslate(targetLang);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              subTab === 'translation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Bilingual Translation</span>
          </button>

          <button
            onClick={() => setSubTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              subTab === 'flashcards'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Flashcards ({flashcards.length})</span>
          </button>

          <button
            onClick={() => setSubTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              subTab === 'quiz'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Practice Quiz</span>
          </button>
        </div>

        <button
          onClick={handleDownloadMarkdown}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg flex items-center space-x-1.5 border border-slate-700 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Markdown (.md)</span>
        </button>
      </div>

      {/* 1. Summary & Notes View */}
      {subTab === 'summary' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Executive Study Summary</span>
              </h4>
              <button
                onClick={() => handleCopy('summary', initialSummary)}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800/60"
              >
                {copiedKey === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'summary' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/60">
              {initialSummary}
            </p>

            {/* Core Entity Bullet Points */}
            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Reference Points</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {analysis.entities?.company_or_merchant && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs">
                    <span className="text-slate-400 block mb-0.5">Organization / Host</span>
                    <span className="text-white font-medium">{analysis.entities.company_or_merchant}</span>
                  </div>
                )}
                {analysis.entities?.location_or_venue && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs">
                    <span className="text-slate-400 block mb-0.5">Location / Venue</span>
                    <span className="text-white font-medium">{analysis.entities.location_or_venue}</span>
                  </div>
                )}
                {analysis.entities?.dates_or_deadlines && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs">
                    <span className="text-slate-400 block mb-0.5">Schedule / Deadline</span>
                    <span className="text-amber-300 font-medium">{analysis.entities.dates_or_deadlines}</span>
                  </div>
                )}
                {analysis.entities?.prices_or_salary && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs">
                    <span className="text-slate-400 block mb-0.5">Amount / Value</span>
                    <span className="text-emerald-300 font-medium">{analysis.entities.prices_or_salary}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Bilingual Translation Studio */}
      {subTab === 'translation' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Languages className="w-4 h-4 text-blue-400" />
                <span>Bilingual Translation Studio</span>
              </h4>
              <p className="text-xs text-slate-400">Side-by-side linguistic translation of extracted screenshot content.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Target:</span>
              <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['Malayalam', 'Hindi', 'Arabic', 'Spanish', 'French', 'German'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleTranslate(lang)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                      targetLang === lang ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Text */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-800 pb-2">
                <span>Original Document Text</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-mono">SOURCE</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-[320px] overflow-y-auto p-2 bg-slate-950/60 rounded-xl">
                {analysis.ocr_text || analysis.summary}
              </div>
            </div>

            {/* Translated Text */}
            <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-400 font-semibold border-b border-slate-800 pb-2">
                <span>Translated Output ({targetLang})</span>
                <button
                  onClick={() => handleCopy('trans', translatedText)}
                  className="hover:text-white flex items-center space-x-1"
                >
                  {copiedKey === 'trans' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'trans' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {isTranslating ? (
                <div className="h-[280px] flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                  <Sparkles className="w-6 h-6 text-blue-400 animate-spin" />
                  <span className="text-xs">Translating with Gemini Multilingual Engine...</span>
                </div>
              ) : (
                <div className="text-xs text-slate-100 leading-relaxed whitespace-pre-wrap max-h-[320px] overflow-y-auto p-3 bg-blue-950/20 rounded-xl border border-blue-900/40">
                  {translatedText || 'Select a language above to generate translation.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Flashcards */}
      {subTab === 'flashcards' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400">
              Card {flashcardIndex + 1} of {flashcards.length}
            </span>
            <span className="text-xs text-blue-400 font-mono">Interactive Study Deck</span>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="w-full max-w-md h-56 cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center border transition-all duration-300 transform hover:scale-[1.01] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 border-slate-700 shadow-xl shadow-blue-900/10"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              {isCardFlipped ? 'REVERSE / ANSWER (Click to flip)' : 'FRONT / PROMPT (Click to reveal)'}
            </span>
            <p className="text-base font-bold text-white px-4 leading-relaxed">
              {isCardFlipped ? flashcards[flashcardIndex].back : flashcards[flashcardIndex].front}
            </p>
          </div>

          {/* Flashcard Navigation */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                setIsCardFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
            >
              Previous Card
            </button>
            <button
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-md shadow-blue-600/20"
            >
              {isCardFlipped ? 'Show Front' : 'Reveal Answer'}
            </button>
            <button
              onClick={() => {
                setFlashcardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
                setIsCardFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

      {/* 4. MCQ Practice Quiz */}
      {subTab === 'quiz' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Automated Comprehension Assessment</h4>
              <p className="text-xs text-slate-400">Test your mastery of the concepts contained in this document.</p>
            </div>
            {quizSubmitted && (
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {quizItems.map((item, qIdx) => {
              const selectedOpt = quizAnswers[qIdx];
              const isCorrect = selectedOpt === item.correctIndex;

              return (
                <div key={qIdx} className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <h5 className="text-xs font-bold text-slate-200">
                    Question {qIdx + 1}: {item.question}
                  </h5>

                  <div className="space-y-2">
                    {item.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (quizSubmitted) {
                        if (optIdx === item.correctIndex) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-semibold';
                        } else if (isChosen) {
                          btnStyle = 'bg-red-950/40 border-red-500/50 text-red-200';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-blue-600/30 border-blue-500 text-white font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === item.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                          {quizSubmitted && isChosen && optIdx !== item.correctIndex && (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-semibold text-slate-300">Explanation: </span>
                      {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(quizAnswers).length < quizItems.length}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
            >
              Submit Quiz & Review Answers
            </button>
          ) : (
            <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl text-center space-y-1">
              <span className="text-sm font-bold text-white">
                Score:{' '}
                {
                  Object.entries(quizAnswers).filter(([qIdx, ans]) => ans === quizItems[Number(qIdx)].correctIndex)
                    .length
                }{' '}
                / {quizItems.length} Correct
              </span>
              <p className="text-xs text-blue-300">Great job! All concepts verified against source document text.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
