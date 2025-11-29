import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Zap, Brain, MessageSquare, Trash2 } from 'lucide-react';
import { ChatMessage, AIMode } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface AIChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatOverlay: React.FC<AIChatOverlayProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  
  // Initialize messages from localStorage if available
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('mindit_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    return [{ id: 'init', role: 'model', text: 'Hi! I am your Mind It assistant. How are you feeling today?' }];
  });

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AIMode>(AIMode.STANDARD);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mindit_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Convert internal message format to API history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(userMsg.text, mode, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      const initialMsg: ChatMessage = { id: 'init', role: 'model', text: 'Hi! I am your Mind It assistant. How are you feeling today?' };
      setMessages([initialMsg]);
      localStorage.removeItem('mindit_chat_history');
    }
  };

  const getModeIcon = (m: AIMode) => {
    switch (m) {
        case AIMode.FAST: return <Zap className="w-4 h-4" />;
        case AIMode.THINKING: return <Brain className="w-4 h-4" />;
        default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getModeLabel = (m: AIMode) => {
    switch (m) {
        case AIMode.FAST: return "Fast";
        case AIMode.THINKING: return "Deep Think";
        default: return "Chat";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Mind Coach</h3>
              <p className="text-xs text-indigo-100 opacity-80">Powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
                onClick={handleClearChat} 
                className="p-2 hover:bg-white/10 rounded-full transition text-indigo-100 hover:text-white"
                title="Clear History"
            >
                <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
                <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="bg-indigo-50 p-2 flex gap-2 shrink-0 border-b border-indigo-100">
            {Object.values(AIMode).map((m) => (
                <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                        mode === m 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white text-indigo-600 hover:bg-indigo-100'
                    }`}
                >
                    {getModeIcon(m)}
                    {getModeLabel(m)}
                </button>
            ))}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                {mode === AIMode.THINKING ? (
                    <>
                        <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
                        <span className="text-xs text-gray-500 italic">Thinking deeply...</span>
                    </>
                ) : (
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === AIMode.THINKING ? "Ask a complex question..." : "Type a message..."}
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`p-3 rounded-full text-white transition-all shadow-lg ${
                loading || !input.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};