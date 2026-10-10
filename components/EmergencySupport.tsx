import React, { useState } from 'react';

const EmergencySupport: React.FC = () => {
  const [showGlobal, setShowGlobal] = useState(false);

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-500/[0.07] to-amber-500/[0.05] dark:from-rose-950/30 dark:to-amber-950/20 border border-rose-500/20 dark:border-rose-500/20 shadow-sm space-y-3">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex-shrink-0">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
            Immediate Crisis Support
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
            If you or someone else is in acute distress or danger, confidential support is available 24/7.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href="tel:988"
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <span>📞</span>
          <span>Call 988</span>
        </a>
        <a
          href="sms:741741"
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-all active:scale-95"
        >
          <span>💬</span>
          <span>Text HOME</span>
        </a>
      </div>

      <div className="pt-1">
        <button
          onClick={() => setShowGlobal(!showGlobal)}
          className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
        >
          <span>{showGlobal ? '▲ Hide International Hotlines' : '▼ International Crisis Resources'}</span>
        </button>

        {showGlobal && (
          <div className="mt-2 text-[11px] space-y-1 text-slate-600 dark:text-slate-300 border-t border-rose-500/10 pt-2 animate-fade-in">
            <p><strong>UK:</strong> Call <a href="tel:111" className="underline font-semibold">111</a> or text SHOUT to 85258</p>
            <p><strong>Canada:</strong> Call/Text <a href="tel:988" className="underline font-semibold">988</a></p>
            <p><strong>India:</strong> Tele-MANAS <a href="tel:14416" className="underline font-semibold">14416</a> / 1800-891-4416</p>
            <p><strong>Global:</strong> <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="underline font-semibold text-indigo-500">findahelpline.com</a></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencySupport;
