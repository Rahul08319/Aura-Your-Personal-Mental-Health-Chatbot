import React, { useState } from 'react';
import { getStoredApiKey, saveApiKey, isApiKeyConfigured } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onClearHistory }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleRemove = () => {
    saveApiKey('');
    setApiKey('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-black/10 dark:border-white/10 shadow-2xl p-6 md:p-8 backdrop-blur-2xl text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aura Preferences</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Settings, Gemini AI & Privacy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-6">
          {/* AI Status Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isApiKeyConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-400'}`} />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {isApiKeyConfigured() ? 'Google Gemini 2.5 Flash Connected' : 'Local Offline Companion Engine Active'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isApiKeyConfigured()
                    ? 'Cloud streaming model with live clinical boundary guards'
                    : 'Private, on-device empathetic responses (zero cloud data sent)'}
                </p>
              </div>
            </div>
          </div>

          {/* Gemini API Key Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 pr-20 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your key is saved locally in your browser’s secure localStorage. Get a free key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline"
              >
                Google AI Studio
              </a>.
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
              >
                Save Key
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-sm font-medium transition-colors"
                >
                  Clear Key
                </button>
              )}
              {isSaved && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                  ✓ Preferences Saved
                </span>
              )}
            </div>
          </form>

          {/* Privacy & Conversation Management */}
          <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Data & Conversations
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Reset Conversation History</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Clear all active messages and start afresh</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors"
              >
                Clear Messages
              </button>
            </div>
          </div>

          {/* Auto-updating year metadata */}
          <div className="pt-3 border-t border-black/5 dark:border-white/10 text-center text-xs text-slate-400 dark:text-slate-500">
            <p>Aura Mental Health Companion • v2.0 Liquid Glass Edition</p>
            <p className="mt-0.5">© 2025–{currentYear} Aura Project. Automatically verified and updated.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
