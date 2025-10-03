import React, { useState, useEffect, useRef } from 'react';
import SendIcon from './icons/SendIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import ClearIcon from './icons/ClearIcon';

// Definitions for the Web Speech API, which are not part of default TS typings.
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
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check for SpeechRecognition API support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!isSpeechSupported) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

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
        let errorMessage = 'An unknown error occurred with speech recognition.';
        switch (event.error) {
            case 'no-speech':
                errorMessage = 'No speech was detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone not found. Please ensure it is connected and enabled.';
                break;
            case 'not-allowed':
            case 'service-not-allowed':
                errorMessage = 'Microphone access denied. Please allow access in your browser settings.';
                break;
            case 'network':
                errorMessage = 'A network error occurred. Please check your connection and try again.';
                break;
        }
        console.error("Speech recognition error:", event.error, event.message);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (speechError) {
        setSpeechError(null);
    }
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (speechError) {
        setSpeechError(null);
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        setSpeechError("Could not start listening. Please try again.");
      }
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <div className="relative flex-1">
            <textarea
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? 'Listening...' : 'Type your message here or use the microphone...'}
                disabled={isLoading}
                rows={1}
                className={`w-full p-2.5 ${text && !isLoading ? 'pr-10' : ''} bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none disabled:opacity-50`}
            />
            {text && !isLoading && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear input"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
                >
                    <ClearIcon />
                </button>
            )}
        </div>
        {isSpeechSupported && (
            <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
                className={`p-2.5 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-sky-500 disabled:opacity-50 ${isListening ? 'bg-red-500 text-white animate-pulse-ring' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
                <MicrophoneIcon />
            </button>
        )}
        <button
            type="submit"
            disabled={isLoading || !text.trim()}
            aria-label="Send message"
            className="p-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-sky-500"
        >
            <SendIcon />
        </button>
      </form>
      {speechError && (
        <p className="text-sm text-red-500 dark:text-red-400 mt-2 text-center">{speechError}</p>
      )}
    </div>
  );
};

export default MessageInput;