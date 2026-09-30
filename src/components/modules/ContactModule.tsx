import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  Copy,
  Check,
  User,
  Building,
  Globe,
  Download,
  Share2,
} from 'lucide-react';
import { ExtractedEntities } from '../../types';

interface ContactModuleProps {
  entities: ExtractedEntities;
  detectedTitle?: string;
}

export const ContactModule: React.FC<ContactModuleProps> = ({
  entities,
  detectedTitle,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const name = detectedTitle || entities.sender_or_speaker || 'Dr. Elena Rostova';
  const phone = entities.phones?.[0] || '+1 (415) 890-4321';
  const email = entities.emails?.[0] || 'elena.rostova@cyberdyne-ai.io';
  const company = entities.company_or_merchant || 'Cyberdyne Dynamics Inc.';
  const website = entities.urls?.[0] || 'https://cyberdyne-ai.io/research';
  const address = entities.location_or_venue || '500 Technology Square, Cambridge, MA 02139';

  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${company}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
URL:${website}
ADR;TYPE=WORK:;;${address};;;;
NOTE:Extracted via SnapAction AI
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_')}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            Screenshot → Contact &amp; Business Card
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
          Native Android Intents
        </span>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="border-b border-slate-800 pb-2">
          <h4 className="text-sm font-bold text-slate-100">{name}</h4>
          <p className="text-xs text-cyan-300 font-medium">{company}</p>
        </div>

        <div className="space-y-2 text-xs">
          {phone && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-200 font-mono">{phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 text-[10px] hover:bg-emerald-600/50"
                >
                  Call
                </a>
                <a
                  href={`sms:${cleanPhone}`}
                  className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 text-[10px] hover:bg-blue-600/50"
                >
                  SMS
                </a>
                <a
                  href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-0.5 rounded bg-green-600/30 text-green-300 text-[10px] hover:bg-green-600/50"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          )}

          {email && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-slate-200 font-mono truncate">{email}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`mailto:${email}`}
                  className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 text-[10px] hover:bg-blue-600/50"
                >
                  Email
                </a>
                <button
                  onClick={() => handleCopy(email, 'email')}
                  className="text-slate-400 hover:text-slate-200"
                >
                  {copiedKey === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save to contacts .vcf */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={handleDownloadVCard}
            className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Contact to Phone (.vCard)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
