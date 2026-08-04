import React, { useState, useRef } from 'react';
import { X, Mic, Camera, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { ExpenseCategory, Transaction } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (
    tx: Omit<Transaction, 'id'>,
    isSubscription?: boolean
  ) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [amount, setAmount] = useState<string>('0.00');
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory>('Food');
  const [merchant, setMerchant] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubscription, setIsSubscription] = useState<boolean>(false);

  // AI loading states
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [isScanningReceipt, setIsScanningReceipt] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddTransaction(
      {
        amount: parsedAmount,
        category: selectedCategory,
        merchant: merchant.trim() || undefined,
        note: note.trim() || undefined,
        date: new Date().toISOString(),
        isSubscription,
      },
      isSubscription
    );

    // Reset & close
    setAmount('0.00');
    setMerchant('');
    setNote('');
    setIsSubscription(false);
    onClose();
  };

  // Receipt Scanner handler
  const handleReceiptFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningReceipt(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/scan-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
          }),
        });

        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.amount) setAmount(String(data.data.amount));
          if (data.data.merchant) setMerchant(data.data.merchant);
          if (data.data.note) setNote(data.data.note);
          if (data.data.category && CATEGORIES.some((c) => c.name === data.data.category)) {
            setSelectedCategory(data.data.category as ExpenseCategory);
          }
        }
        setIsScanningReceipt(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsScanningReceipt(false);
    }
  };

  // Voice recording simulation or Web Speech API
  const handleStartVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Fallback AI voice simulation
      setVoiceText('Spent 89 rupees on Netflix entertainment');
      setIsVoiceRecording(true);
      setTimeout(async () => {
        setIsVoiceRecording(false);
        const res = await fetch('/api/voice-parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: 'Spent 89 rupees on Netflix entertainment',
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.amount) setAmount(String(data.data.amount));
          if (data.data.merchant) setMerchant(data.data.merchant);
          if (data.data.note) setNote(data.data.note);
          if (data.data.category) setSelectedCategory(data.data.category as ExpenseCategory);
        }
      }, 1500);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    setIsVoiceRecording(true);
    recognition.start();

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      setIsVoiceRecording(false);

      const res = await fetch('/api/voice-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.amount) setAmount(String(data.data.amount));
        if (data.data.merchant) setMerchant(data.data.merchant);
        if (data.data.note) setNote(data.data.note);
        if (data.data.category) setSelectedCategory(data.data.category as ExpenseCategory);
      }
    };

    recognition.onerror = () => {
      setIsVoiceRecording(false);
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      {/* Hidden file input for receipt scanner */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleReceiptFileChange}
      />

      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Add Expense</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Action Buttons: Voice & Receipt (Matching Image 3) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={handleStartVoice}
            disabled={isVoiceRecording}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-sm transition border border-slate-200/50"
          >
            {isVoiceRecording ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-slate-700" />
                <span>Voice</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanningReceipt}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-sm transition border border-slate-200/50"
          >
            {isScanningReceipt ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 text-slate-700" />
                <span>Receipt</span>
              </>
            )}
          </button>
        </div>

        {voiceText && (
          <div className="mb-4 p-3 bg-purple-50 rounded-xl text-xs text-purple-800 border border-purple-100">
            <strong>Voice parsed:</strong> "{voiceText}"
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50/50 border-2 border-indigo-400 focus:border-indigo-600 rounded-xl text-slate-900 text-lg font-bold outline-none transition"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category Grid (Matching exact 8 pastel tiles in Image 3) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                      cat.bgColor
                    } ${
                      isSelected
                        ? 'ring-2 ring-indigo-600 scale-[1.03] shadow-sm font-bold'
                        : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.emoji}</span>
                    <span className={`text-[11px] ${cat.textColor}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Merchant (optional) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Merchant (optional)
            </label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Netflix, Amazon, Swiggy"
              className="w-full px-4 py-3 bg-slate-100/70 border border-slate-200/80 rounded-xl text-slate-900 text-sm outline-none focus:bg-white focus:border-indigo-400 transition"
            />
          </div>

          {/* Note (optional) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Monthly OTT subscription"
              className="w-full px-4 py-3 bg-slate-100/70 border border-slate-200/80 rounded-xl text-slate-900 text-sm outline-none focus:bg-white focus:border-indigo-400 transition"
            />
          </div>

          {/* Is Subscription Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-semibold text-slate-700">
              Is this a recurring subscription?
            </span>
            <input
              type="checkbox"
              checked={isSubscription}
              onChange={(e) => setIsSubscription(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md shadow-indigo-500/30 transition active:scale-[0.99]"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
