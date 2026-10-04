import React, { useState } from 'react';
import {
  ShoppingBag,
  Plane,
  Calendar,
  ExternalLink,
  Tag,
  CheckCircle,
  Copy,
  Check,
  Download,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import { ScreenshotAnalysis } from '../../types';

interface ShoppingTravelModuleProps {
  analysis: ScreenshotAnalysis;
}

export const ShoppingTravelModule: React.FC<ShoppingTravelModuleProps> = ({ analysis }) => {
  const isTravel =
    analysis.content_type === 'travel_itinerary' ||
    Boolean(analysis.entities?.flight_number || analysis.entities?.booking_reference);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [priceTrackEnabled, setPriceTrackEnabled] = useState(false);
  const [checklist, setChecklist] = useState<Array<{ text: string; done: boolean }>>([
    { text: 'Check passport & visa expiration', done: true },
    { text: 'Verify flight terminal & baggage allowance', done: false },
    { text: 'Save digital boarding pass & QR code', done: false },
    { text: 'Confirm hotel check-in time & booking ref', done: false },
  ]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate .ics Calendar file for travel
  const handleDownloadICS = () => {
    const title = analysis.detected_title || 'Travel Booking EK203';
    const location = analysis.entities?.location_or_venue || 'Dubai International Airport';
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SnapAction AI//Travel Calendar//EN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${analysis.summary}
LOCATION:${location}
DTSTART:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(Date.now() + 14400000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Booking_${Date.now()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isTravel) {
    return (
      <div className="space-y-6">
        {/* Travel Banner */}
        <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Plane className="w-3.5 h-3.5" />
              <span>Travel & Itinerary Hub</span>
            </div>
            <h4 className="text-base font-bold text-white">
              {analysis.detected_title || 'Flight / Hotel Booking Itinerary'}
            </h4>
            <p className="text-xs text-slate-300">
              {analysis.summary || 'Booking details recognized with confirmed route and schedule.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadICS}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2 shadow-md shadow-blue-600/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download iCal (.ics)</span>
            </button>
          </div>
        </div>

        {/* Itinerary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Flight / Booking Reference</span>
            <span className="text-sm font-bold text-white font-mono">
              {analysis.entities?.booking_reference || analysis.entities?.flight_number || 'EK-203 (DXB ✈ JFK)'}
            </span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Schedule & Date</span>
            <span className="text-sm font-bold text-amber-300">
              {analysis.entities?.dates_or_deadlines || 'Oct 25, 2026 • 02:45 AM Departure'}
            </span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Destination Venue</span>
            <span className="text-sm font-bold text-emerald-300">
              {analysis.entities?.location_or_venue || 'Terminal 3, Dubai Int. Airport'}
            </span>
          </div>
        </div>

        {/* Airport Smart Checklist */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Pre-Departure Smart Checklist</span>
            </h5>
            <span className="text-xs text-slate-400">
              {checklist.filter((i) => i.done).length} / {checklist.length} Completed
            </span>
          </div>

          <div className="space-y-2">
            {checklist.map((item, idx) => (
              <label
                key={idx}
                className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-all text-xs"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => {
                    const next = [...checklist];
                    next[idx].done = !next[idx].done;
                    setChecklist(next);
                  }}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <span className={item.done ? 'line-through text-slate-500' : 'text-slate-200'}>{item.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // E-Commerce Product View
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Product Identification & Price Intelligence</span>
          </div>
          <h4 className="text-base font-bold text-white">
            {analysis.detected_title || 'Identified Product Specification'}
          </h4>
          <p className="text-xs text-slate-300">
            {analysis.summary || 'Product model, estimated retail price, and specifications extracted.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPriceTrackEnabled(!priceTrackEnabled)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              priceTrackEnabled
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>{priceTrackEnabled ? 'Price Watch Active' : 'Track Price Drops'}</span>
          </button>
        </div>
      </div>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Visible Price / Estimate</span>
          <span className="text-lg font-bold text-emerald-400">
            {analysis.entities?.prices_or_salary || '$398.00'}
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Brand / Manufacturer</span>
          <span className="text-sm font-bold text-white">
            {analysis.entities?.company_or_merchant || 'Sony Electronics'}
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Market Category</span>
          <span className="text-sm font-bold text-blue-300">Consumer Electronics / Audio</span>
        </div>
      </div>

      {/* Specifications & Price Comparison */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Tag className="w-4 h-4 text-emerald-400" />
          <span>Compare Retailers & Pricing</span>
        </h5>

        <div className="space-y-2">
          {[
            { store: 'Amazon Official', price: '$398.00', inStock: true, link: 'https://amazon.com' },
            { store: 'Best Buy Marketplace', price: '$399.99', inStock: true, link: 'https://bestbuy.com' },
            { store: 'B&H Photo Video', price: '$389.00 (Cheapest Option)', inStock: true, link: 'https://bhphotovideo.com' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <div>
                <span className="text-white font-semibold block">{item.store}</span>
                <span className="text-emerald-400 font-mono">{item.price}</span>
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-all border border-slate-700"
              >
                <span>View Deal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
