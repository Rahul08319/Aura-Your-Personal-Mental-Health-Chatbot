
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse"></div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Aura</h1>
        </div>
        <p className="ml-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Your Personal Mental Health Companion</p>
      </div>
    </header>
  );
};

export default Header;
