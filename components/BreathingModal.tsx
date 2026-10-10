import React, { useState, useEffect, useRef } from 'react';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Pattern {
  id: string;
  name: string;
  tagline: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  color: string;
}

const PATTERNS: Pattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    tagline: 'Deep focus & stress relief (4-4-4-4)',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    color: 'from-cyan-400 to-indigo-500',
  },
  {
    id: '478',
    name: '4-7-8 Relaxing Breath',
    tagline: 'Deep nervous system calm & sleep (4-7-8)',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'coherent',
    name: 'Resonant Breathing',
    tagline: 'Heart-rate variability & vagal tone (5-5)',
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0,
    color: 'from-indigo-400 to-purple-500',
  },
];

type BreathPhase = 'idle' | 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(PATTERNS[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [countdown, setCountdown] = useState<number>(0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Play a soft, Apple-style ambient bell using Web Audio API
  const playChime = (freq: number = 432) => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    let isMounted = true;
    let timer: NodeJS.Timeout;

    const runCycle = async () => {
      while (isMounted && isActive) {
        // Inhale
        setPhase('inhale');
        playChime(432);
        for (let i = selectedPattern.inhale; i > 0; i--) {
          if (!isMounted || !isActive) return;
          setCountdown(i);
          await new Promise((r) => (timer = setTimeout(r, 1000)));
        }

        // Hold In
        if (selectedPattern.holdIn > 0) {
          setPhase('hold-in');
          playChime(528);
          for (let i = selectedPattern.holdIn; i > 0; i--) {
            if (!isMounted || !isActive) return;
            setCountdown(i);
            await new Promise((r) => (timer = setTimeout(r, 1000)));
          }
        }

        // Exhale
        setPhase('exhale');
        playChime(396);
        for (let i = selectedPattern.exhale; i > 0; i--) {
          if (!isMounted || !isActive) return;
          setCountdown(i);
          await new Promise((r) => (timer = setTimeout(r, 1000)));
        }

        // Hold Out
        if (selectedPattern.holdOut > 0) {
          setPhase('hold-out');
          for (let i = selectedPattern.holdOut; i > 0; i--) {
            if (!isMounted || !isActive) return;
            setCountdown(i);
            await new Promise((r) => (timer = setTimeout(r, 1000)));
          }
        }

        if (isMounted && isActive) {
          setCompletedCycles((c) => c + 1);
        }
      }
    };

    runCycle();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isActive, selectedPattern]);

  if (!isOpen) return null;

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In Slowly';
      case 'hold-in':
        return 'Gently Hold';
      case 'exhale':
        return 'Release & Exhale';
      case 'hold-out':
        return 'Rest';
      default:
        return 'Ready to Begin';
    }
  };

  const getScaleClass = () => {
    if (phase === 'inhale') return 'scale-125 duration-[4000ms]';
    if (phase === 'hold-in') return 'scale-125 duration-700';
    if (phase === 'exhale') return 'scale-90 duration-[4000ms]';
    if (phase === 'hold-out') return 'scale-90 duration-700';
    return 'scale-100 duration-1000';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-black/10 dark:border-white/10 shadow-2xl p-6 md:p-8 backdrop-blur-2xl text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Apple Window Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400"></span>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Mindful Breathing
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Mute Chimes' : 'Enable Chimes'}
              className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {audioEnabled ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pattern Selector Segmented Control */}
        <div className="mt-4 flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-black/5 dark:border-white/5">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPattern(p);
                setIsActive(false);
                setPhase('idle');
              }}
              className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200 ${
                selectedPattern.id === p.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Breathing Animation Canvas Area */}
        <div className="relative flex flex-col items-center justify-center py-10 md:py-14">
          {/* Animated Petal Rings */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Outer halo */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${selectedPattern.color} opacity-20 blur-2xl transition-transform ease-out ${getScaleClass()}`}
            />
            {/* Concentric blooming petals */}
            <div
              className={`absolute w-44 h-44 rounded-full border border-teal-400/30 bg-teal-300/10 dark:bg-teal-500/10 backdrop-blur-md transition-transform ease-out ${getScaleClass()}`}
              style={{ transform: phase === 'inhale' ? 'scale(1.2) rotate(45deg)' : 'scale(0.9) rotate(0deg)' }}
            />
            <div
              className={`absolute w-36 h-36 rounded-full border border-indigo-400/40 bg-indigo-300/15 dark:bg-indigo-500/15 backdrop-blur-md transition-transform ease-out ${getScaleClass()}`}
              style={{ transform: phase === 'inhale' ? 'scale(1.15) rotate(-30deg)' : 'scale(0.95) rotate(0deg)' }}
            />
            {/* Center Core Orb */}
            <div
              className={`relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr ${selectedPattern.color} shadow-apple-glow flex flex-col items-center justify-center text-white transition-all ease-out ${getScaleClass()}`}
            >
              <span className="text-3xl font-extrabold tracking-tight">
                {isActive ? countdown : '●'}
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold opacity-90">
                {phase === 'idle' ? 'Ready' : phase.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Phase Guidance Text */}
          <div className="mt-8 text-center space-y-1">
            <h4 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              {getPhaseInstruction()}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedPattern.tagline}
            </p>
            {completedCycles > 0 && (
              <p className="text-xs text-emerald-500 font-medium pt-1">
                Completed cycles: {completedCycles}
              </p>
            )}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => {
              setIsActive(!isActive);
            }}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-md ${
              isActive
                ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white'
                : 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-indigo-500/25'
            }`}
          >
            {isActive ? 'Pause Exercise' : completedCycles > 0 ? 'Resume' : 'Begin Breathing'}
          </button>
          <button
            onClick={() => {
              setIsActive(false);
              setPhase('idle');
              setCompletedCycles(0);
            }}
            className="py-3.5 px-4 rounded-2xl border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreathingModal;
