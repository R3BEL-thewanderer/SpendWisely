'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ArrowRight,
  RefreshCw,
  Edit2,
  Check,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { parseVoiceExpense } from '../lib/voiceParser';
import { ParsedVoiceExpense } from '../lib/types';

export function VoiceInputModal() {
  const { activeModal, closeModal, addExpense, showToast } = useSpendWise();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsed, setParsed] = useState<ParsedVoiceExpense | null>(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Editable parsed fields
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPaymentMethod, setEditPaymentMethod] = useState('');

  const recognitionRef = useRef<any>(null);

  // Demo voice queries for quick testing
  const DEMO_VOICE_PROMPTS = [
    'Spent 450 rupees on Swiggy dinner through UPI',
    'Paid 1200 for petrol at Shell with HDFC credit card',
    'Bought groceries from Blinkit 850 in cash',
    'Uber cab to airport 680 on Google Pay',
    'Movie tickets at PVR 760 via PhonePe',
    'Coffee at Starbucks 350 with card',
  ];

  // Initialize SpeechRecognition if available in browser
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Optimized for Indian English & accent

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (currentTranscript.trim()) {
          const parsedResult = parseVoiceExpense(currentTranscript);
          setParsed(parsedResult);
          setEditTitle(parsedResult.title);
          setEditAmount(parsedResult.amount.toString());
          setEditCategory(parsedResult.category);
          setEditPaymentMethod(parsedResult.paymentMethod);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition initialization error:', err);
      setHasSpeechSupport(false);
    }
  }, []);

  // Reset or initialize when modal opens
  useEffect(() => {
    if (activeModal === 'VOICE_INPUT') {
      setTranscript('');
      setParsed(null);
      setIsListening(false);
      setIsEditing(false);
    } else {
      stopListening();
    }
  }, [activeModal]);

  const startListening = () => {
    if (!recognitionRef.current) {
      showToast('Speech recognition not supported in this browser. Try the quick demo chips!');
      return;
    }
    try {
      setTranscript('');
      setParsed(null);
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.warn('Error starting speech recognition:', err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSimulateVoicePrompt = (promptText: string) => {
    stopListening();
    setTranscript(promptText);
    const parsedResult = parseVoiceExpense(promptText);
    setParsed(parsedResult);
    setEditTitle(parsedResult.title);
    setEditAmount(parsedResult.amount.toString());
    setEditCategory(parsedResult.category);
    setEditPaymentMethod(parsedResult.paymentMethod);
    showToast(`Parsed: "${promptText}"`);
  };

  const handleSaveExpense = () => {
    const finalAmount = parseFloat(editAmount);
    if (!editTitle.trim() || isNaN(finalAmount) || finalAmount <= 0) {
      showToast('Please check amount and title before saving.');
      return;
    }

    const success = addExpense({
      amount: finalAmount,
      title: editTitle.trim(),
      category: editCategory.trim() || 'Food & Dining',
      paymentMethod: editPaymentMethod.trim() || 'UPI',
      notes: `Logged via Voice Quick Entry: "${transcript || editTitle}"`,
    });

    if (success) {
      showToast(`Logged ₹${finalAmount} for ${editTitle} via Voice!`);
      closeModal();
    }
  };

  if (activeModal !== 'VOICE_INPUT') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#fafafa] dark:bg-[#121110] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#e7e5e4] dark:border-white/[0.08] shrink-0 bg-white/70 dark:bg-[#181615]/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-light text-lg text-[#0c0a09] dark:text-white flex items-center gap-1.5">
                Voice-to-Ledger Quick Entry
                <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  Natural Speech AI
                </span>
              </h2>
              <p className="text-[11px] text-[#777169] dark:text-[#a8a29e]">
                Speak naturally to record expenses instantly without typing.
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-[#777169] dark:text-[#a8a29e] transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col items-center gap-5 overflow-y-auto max-h-[75vh] no-scrollbar">
          {/* Pulsing Microphone Button & Waveform Visualization */}
          <div className="relative flex flex-col items-center justify-center my-2">
            {/* Waveform radar rings when active */}
            {isListening && (
              <>
                <div className="absolute w-36 h-36 rounded-full bg-rose-500/15 animate-ping pointer-events-none" />
                <div className="absolute w-28 h-28 rounded-full bg-rose-500/25 animate-pulse pointer-events-none" />
              </>
            )}

            <button
              onClick={toggleListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg active:scale-90 ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-500/40 ring-4 ring-rose-500/30 scale-105'
                  : 'bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] shadow-black/10'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-bounce" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            <span className="text-xs font-medium text-[#777169] dark:text-[#a8a29e] mt-3 tracking-wide">
              {isListening ? 'Listening... Speak now' : 'Tap microphone to speak'}
            </span>
          </div>

          {/* Live Transcript Bubble */}
          <div className="w-full p-4 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#777169] dark:text-[#a8a29e] flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Spoken Voice Transcript</span>
            </span>
            <p className="text-sm font-medium text-[#0c0a09] dark:text-white min-h-[38px] flex items-center italic">
              {transcript ? (
                `"${transcript}"`
              ) : (
                <span className="text-[#a8a29e] not-italic text-xs font-normal">
                  Say something like: &ldquo;Spent 450 rupees on Swiggy dinner through UPI&rdquo;
                </span>
              )}
            </p>
          </div>

          {/* Parsed Entity Confirmation Card */}
          {parsed && (
            <div className="w-full p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 shadow-xs flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Parsed Financial Entities
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {Math.round(parsed.confidence * 100)}% match
                  </span>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1 rounded-lg text-rose-700 dark:text-rose-300 hover:bg-rose-500/10 transition"
                    title="Edit values"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                /* Edit Mode */
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-[#777169] block mb-0.5">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#777169] block mb-0.5">Amount (₹)</label>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#777169] block mb-0.5">Category</label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#777169] block mb-0.5">Payment Method</label>
                    <input
                      type="text"
                      value={editPaymentMethod}
                      onChange={(e) => setEditPaymentMethod(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/10"
                    />
                  </div>
                </div>
              ) : (
                /* Readonly Grid */
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-[#181615]/70 border border-rose-200/50 dark:border-rose-900/30">
                    <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] block">
                      Amount
                    </span>
                    <span className="font-display font-light text-lg text-rose-700 dark:text-rose-300 font-semibold block mt-0.5">
                      {formatCurrency(parseFloat(editAmount) || parsed.amount)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-[#181615]/70 border border-rose-200/50 dark:border-rose-900/30">
                    <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] block">
                      Merchant / Title
                    </span>
                    <span className="font-medium text-[#0c0a09] dark:text-white block mt-0.5 truncate">
                      {editTitle || parsed.title}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-[#181615]/70 border border-rose-200/50 dark:border-rose-900/30">
                    <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] block">
                      Category
                    </span>
                    <span className="font-medium text-[#0c0a09] dark:text-white block mt-0.5">
                      {editCategory || parsed.category}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-[#181615]/70 border border-rose-200/50 dark:border-rose-900/30">
                    <span className="text-[10px] text-[#777169] dark:text-[#a8a29e] block">
                      Payment Mode
                    </span>
                    <span className="font-medium text-[#0c0a09] dark:text-white block mt-0.5">
                      {editPaymentMethod || parsed.paymentMethod}
                    </span>
                  </div>
                </div>
              )}

              {/* Confirm Save CTA */}
              <button
                type="button"
                onClick={handleSaveExpense}
                className="w-full py-3 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95 mt-1"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm & Log to Ledger (₹{editAmount || parsed.amount})</span>
              </button>
            </div>
          )}

          {/* Quick Demo Test Chips */}
          <div className="w-full flex flex-col gap-2 pt-1 border-t border-[#f0efed] dark:border-white/[0.05]">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#777169] dark:text-[#a8a29e]">
              One-Tap Spoken Voice Presets (Quick Test)
            </span>
            <div className="flex flex-col gap-1.5">
              {DEMO_VOICE_PROMPTS.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSimulateVoicePrompt(promptText)}
                  className="p-2 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] hover:border-rose-400 dark:hover:border-rose-500 text-left text-xs text-[#0c0a09] dark:text-white flex items-center justify-between group transition"
                >
                  <span className="truncate">&ldquo;{promptText}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a8a29e] group-hover:text-rose-500 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e7e5e4] dark:border-white/[0.08] bg-white/70 dark:bg-[#181615]/70 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-[#777169] dark:text-[#a8a29e]">
            Powered by Browser Web Speech API & NLP entity recognition.
          </span>
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-full border border-[#d6d3d1] dark:border-white/10 text-xs font-medium text-[#0c0a09] dark:text-white hover:bg-black/5 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
