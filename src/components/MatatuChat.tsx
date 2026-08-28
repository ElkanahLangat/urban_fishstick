import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  ShieldCheck, 
  BellRing, 
  Radio,
  Smile,
  Volume2
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const MatatuChat: React.FC = () => {
  const { 
    chatMessages, 
    sendChatMessage, 
    userRole, 
    language,
    selectedVehicle 
  } = useBooking();

  const [inputMsg, setInputMsg] = useState<string>('');

  const quickReplies = [
    { sheng: 'Wazi mkubwa!', english: 'All good, boss!' },
    { sheng: 'Dere nishushe hapo mbele!', english: 'Drop me off ahead!' },
    { sheng: 'Jam ya Nyayo iko aje?', english: 'How is Nyayo traffic?' },
    { sheng: 'Niko kwa lift nateremka!', english: 'In the elevator on my way!' },
    { sheng: 'Dere weka ile ngoma kali!', english: 'DJ play that new banger!' }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendChatMessage(inputMsg.trim());
    setInputMsg('');
  };

  return (
    <div id="matatu-chat-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col h-[460px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {language === 'sheng' ? 'Chit-Chat ya Nganya' : 'In-App Matatu Commuter Chat'}
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Live Transparency: Passengers, Conductor & Driver ({selectedVehicle?.name || 'Nganya'})
            </p>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto my-3 space-y-2.5 pr-1">
        {chatMessages.map(msg => {
          const isMe = msg.senderRole === userRole;
          const isSystem = msg.senderRole === 'system';
          const isConductor = msg.senderRole === 'conductor';
          const isDriver = msg.senderRole === 'driver';

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="inline-block px-3 py-1 bg-slate-950/80 border border-emerald-500/30 text-emerald-400 text-[11px] rounded-full font-medium">
                  🤖 {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-slate-400">
                  {msg.senderName}
                </span>
                {isConductor && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-black rounded">
                    CONODI
                  </span>
                )}
                {isDriver && (
                  <span className="px-1.5 py-0.2 bg-blue-400 text-slate-950 text-[9px] font-black rounded">
                    PILOT
                  </span>
                )}
                <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                    : isConductor
                    ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200 rounded-tl-none'
                    : 'bg-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                {msg.shengTranslation && language === 'english' && (
                  <p className="text-[10px] text-slate-400 mt-1 italic border-t border-slate-700/50 pt-1">
                    English translation: {msg.shengTranslation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Reply Sheng Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {quickReplies.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendChatMessage(chip.sheng, true)}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/60 font-medium transition-all active:scale-95 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{chip.sheng}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={language === 'sheng' ? "Andika ujumbe wa Sheng hapa..." : "Type transparent message to crew & passengers..."}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl transition-all shadow active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
