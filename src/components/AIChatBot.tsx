import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, RefreshCw, ChevronDown, Lightbulb, TrendingDown, DollarSign, HelpCircle } from 'lucide-react';
import { Transaction, Subscription } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatBotProps {
  transactions: Transaction[];
  subscriptions: Subscription[];
  overallBudget: number;
  categoryTotals: Record<string, number>;
  grandTotal: number;
  onClose?: () => void;
  isEmbedded?: boolean;
}

const QUICK_PROMPTS = [
  { label: '💡 How can I cut expenses?', prompt: 'Analyze my expenses and give me 3 specific ways I can cut down spending this month.' },
  { label: '📊 Am I on budget?', prompt: 'Based on my total budget and current spending, am I on track or over budget?' },
  { label: '📺 Audit subscriptions', prompt: 'Review my active subscriptions and tell me if any seem wasteful or expensive.' },
  { label: '🔮 Predict next month spend', prompt: 'Predict my spending for next month based on my recurring expenses and history.' },
];

export const AIChatBot: React.FC<AIChatBotProps> = ({
  transactions,
  subscriptions,
  overallBudget,
  categoryTotals,
  grandTotal,
  onClose,
  isEmbedded = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm **Tracksy AI**, your personal financial assistant powered by Gemini. 

I can analyze your spending, give tailored budgeting advice, audit subscriptions, and answer questions about your money. What would you like to know today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const messageText = (customPrompt || inputPrompt).trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsLoading(true);

    try {
      const activeSubs = subscriptions.filter((s) => s.active);
      const recentTxs = transactions.slice(0, 10).map((t) => ({
        title: t.title,
        amount: t.amount,
        category: t.category,
        date: t.date,
      }));

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: messages.filter((m) => m.id !== 'welcome'),
          financialContext: {
            overallBudget,
            grandTotal,
            categoryTotals,
            subscriptions: activeSubs.map((s) => ({ name: s.name, amount: s.amount, category: s.category })),
            recentTransactions: recentTxs,
          },
        }),
      });

      const data = await res.json();
      const botReply = data.reply || "I'm having trouble analyzing your request. Please try again!";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't process that right now. Please check your network connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: "Chat history cleared. How else can I assist with your financial goals?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div
      className={`flex flex-col bg-white/90 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-3xl overflow-hidden ${
        isEmbedded ? 'h-[500px]' : 'h-[85vh] max-h-[620px] w-full'
      }`}
    >
      {/* Bot Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-200" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-indigo-700 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm tracking-tight">Tracksy AI Assistant</h3>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-medium">
                Gemini 3.6
              </span>
            </div>
            <p className="text-[11px] text-indigo-100 font-medium">Real-time Financial Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close Bot"
              className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white font-bold ${
                msg.role === 'user'
                  ? 'bg-slate-900 shadow-sm'
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[82%] rounded-2xl p-3.5 space-y-1 ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none shadow-md'
                  : 'bg-white text-slate-800 border border-slate-200/70 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed font-normal">
                {msg.content}
              </div>
              <div
                className={`text-[9px] text-right font-medium mt-1 ${
                  msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200/70 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
              </div>
              <span className="text-xs text-slate-500 font-medium">Analyzing financial metrics...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(qp.prompt)}
            disabled={isLoading}
            className="text-[11px] font-semibold whitespace-nowrap bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200/60 transition active:scale-95 disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask Tracksy AI about your money..."
          disabled={isLoading}
          className="flex-1 bg-slate-100/80 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition placeholder:text-slate-400 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          aria-label="Send message to AI bot"
          className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white flex items-center justify-center shadow-sm transition active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
