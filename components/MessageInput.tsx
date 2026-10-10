import React, { useState, useEffect, useRef } from 'react';
import SendIcon from './icons/SendIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import ClearIcon from './icons/ClearIcon';

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onQuickAction?: (text: string) => void;
}

const QUICK_PILLS = [
  "🌿 Guide me to breathe",
  "💙 Feeling overwhelmed",
  "✨ Daily gratitude",
  "🌙 Help me unwind",
];

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, onQuickAction }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;
  const isSpeechSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!isSpeechSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }
      setText(finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Speech recognition error.';
      if (event.error === 'not-allowed') {
        errorMessage = 'Microphone access denied. Please enable permission in your browser.';
      } else if (event.error === 'no-speech') {
        errorMessage = 'No voice detected. Please try speaking again.';
      }
      setSpeechError(errorMessage);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSpeechSupported]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (speechError) setSpeechError(null);
    setText(e.target.value);
    
    // Auto-adjust height up to 120px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (speechError) setSpeechError(null);

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setSpeechError("Could not activate microphone.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-2.5">
      {/* Quick Action Suggestion Chips above bar */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {QUICK_PILLS.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onQuickAction && onQuickAction(pill.replace(/^[^\s]+\s/, ''))}
            className="flex-shrink-0 text-xs px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 transition-all duration-150 active:scale-95"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Floating Apple Liquid Glass Capsule */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end space-x-2 p-2 rounded-3xl apple-glass border border-black/[0.08] dark:border-white/[0.1] shadow-apple-md transition-shadow focus-within:shadow-apple-lg"
      >
        <div className="relative flex-1 flex items-center">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening with care...' : "Share what's on your mind, or ask Aura..."}
            disabled={isLoading}
            rows={1}
            className="w-full max-h-28 px-3.5 py-2 text-sm bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none resize-none disabled:opacity-50"
          />

          {text && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setText('');
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
              }}
              aria-label="Clear input"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {/* Speech Recognition Button with Pulse Wave */}
        {isSpeechSupported && (
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            className={`p-2.5 rounded-2xl transition-all duration-200 active:scale-95 focus:outline-none ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse-ring'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
          >
            <MicrophoneIcon />
          </button>
        )}

        {/* Submit / Send Capsule Button */}
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          aria-label="Send message"
          className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all duration-200 active:scale-95 focus:outline-none"
        >
          <SendIcon />
        </button>
      </form>

      {/* Speech error indicator */}
      {speechError && (
        <p className="text-xs text-rose-500 dark:text-rose-400 text-center animate-fade-in">
          {speechError}
        </p>
      )}
    </div>
  );
};

export default MessageInput;