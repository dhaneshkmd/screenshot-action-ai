import React, { useState } from 'react';
import {
  Receipt,
  Download,
  Check,
  DollarSign,
  Tag,
  Building,
  Calendar,
  Share2,
} from 'lucide-react';
import { ExtractedEntities } from '../../types';

interface ExpenseModuleProps {
  entities: ExtractedEntities;
  detectedTitle?: string;
}

export const ExpenseModule: React.FC<ExpenseModuleProps> = ({
  entities,
  detectedTitle,
}) => {
  const [exported, setExported] = useState(false);
  const [category, setCategory] = useState('Business Meals & Entertainment');

  const merchant = entities.company_or_merchant || detectedTitle || 'Blue Bottle Coffee & Bistro';
  const total = entities.prices_or_salary || '$82.08';
  const date = entities.dates_or_deadlines || 'Oct 24, 2026';

  const lineItems = entities.line_items?.length
    ? entities.line_items
    : [
        { name: 'Single Origin Pour-over (x2)', amount: '$14.00' },
        { name: 'Avocado Tartine & Egg (x2)', amount: '$36.00' },
        { name: 'Almond Croissant (x1)', amount: '$6.50' },
        { name: 'Sparkling Mineral Water (x2)', amount: '$8.00' },
      ];

  const handleExportCsv = () => {
    let csv = 'Merchant,Date,Category,Item,Amount,Total\n';
    lineItems.forEach((item) => {
      csv += `"${merchant}","${date}","${category}","${item.name}","${item.amount}","${total}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_${merchant.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            Screenshot → Expense &amp; Receipt Extractor
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
          Itemized Extraction
        </span>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        {/* Merchant & Total */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <span className="text-xs font-bold text-slate-100">{merchant}</span>
            <p className="text-[11px] text-slate-400">Date: {date}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Total Billed</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">{total}</span>
          </div>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2 text-xs">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Expense Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            <option value="Business Meals & Entertainment">Business Meals &amp; Entertainment</option>
            <option value="Travel & Lodging">Travel &amp; Lodging</option>
            <option value="Software & Cloud Services">Software &amp; Cloud Services</option>
            <option value="Office Supplies & Equipment">Office Supplies</option>
          </select>
        </div>

        {/* Itemized Table */}
        <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 space-y-1.5 text-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Detected Line Items:
          </span>
          {lineItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-slate-300 py-0.5 border-b border-slate-900/80">
              <span>{item.name}</span>
              <span className="font-mono text-slate-200">{item.amount}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={handleExportCsv}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            {exported ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exported ? 'Exported CSV' : 'Export Itemized CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
