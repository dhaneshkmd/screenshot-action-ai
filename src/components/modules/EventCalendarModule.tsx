import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Download,
  Check,
  Sparkles,
  Share2,
} from 'lucide-react';
import { ExtractedEntities } from '../../types';

interface EventCalendarModuleProps {
  entities: ExtractedEntities;
  detectedTitle?: string;
  summary?: string;
}

export const EventCalendarModule: React.FC<EventCalendarModuleProps> = ({
  entities,
  detectedTitle,
  summary,
}) => {
  const [downloadedIcs, setDownloadedIcs] = useState(false);

  const title = detectedTitle || entities.job_title || 'AI Vision & Agents World Congress 2026';
  const venue = entities.location_or_venue || 'Moscone West Center, 747 Howard St, San Francisco, CA';
  const dates = entities.dates_or_deadlines || 'November 18-20, 2026';
  const regUrl = entities.urls?.[0] || 'https://aivisioncongress2026.org/register';

  // Construct Google Calendar Link
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&details=${encodeURIComponent(summary || 'Imported via SnapAction AI')}&location=${encodeURIComponent(
    venue
  )}`;

  // Construct Google Maps Link
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;

  const handleDownloadIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SnapAction AI//Mobile Applet//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${summary || 'Imported from screenshot by SnapAction AI'}
LOCATION:${venue}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            Screenshot → Event &amp; Calendar Agent
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
          Google Calendar &amp; .ICS
        </span>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-slate-100">{title}</h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 block text-[10px]">Date &amp; Schedule:</span>
              <span className="font-medium text-slate-200">{dates}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-slate-500 block text-[10px]">Venue / Location:</span>
              <span className="font-medium text-slate-200">{venue}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add to Google Cal</span>
          </a>

          <button
            onClick={handleDownloadIcs}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {downloadedIcs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloadedIcs ? 'Downloaded .ICS' : 'Download .ICS'}</span>
          </button>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Navigate (Maps)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
