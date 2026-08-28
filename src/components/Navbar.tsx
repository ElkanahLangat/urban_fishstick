import React from 'react';
import { 
  Bus, 
  Wallet, 
  Volume2, 
  VolumeX, 
  Globe, 
  User, 
  Zap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const Navbar: React.FC = () => {
  const { 
    walletBalance, 
    userRole, 
    setUserRole, 
    language, 
    setLanguage, 
    soundEnabled, 
    setSoundEnabled,
    activeAlert,
    dismissAlert,
    triggerAudioHorn
  } = useBooking();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
      {/* Dynamic Alert Banner */}
      {activeAlert && (
        <div className={`px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-all ${
          activeAlert.type === 'refund' 
            ? 'bg-emerald-500 text-slate-950 shadow-lg animate-bounce' 
            : activeAlert.type === 'warning'
            ? 'bg-amber-500 text-slate-950'
            : activeAlert.type === 'info'
            ? 'bg-blue-600 text-white'
            : 'bg-emerald-600 text-white'
        }`}>
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <span className="text-base">{activeAlert.type === 'refund' ? '💰' : '📢'}</span>
            <span>{activeAlert.message}</span>
          </div>
          <button 
            onClick={dismissAlert}
            className="px-2 py-0.5 rounded bg-black/20 hover:bg-black/40 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Horn Trigger */}
        <div className="flex items-center gap-3">
          <div 
            onClick={triggerAudioHorn}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 transition-transform"
            title="Click to Honk the Fishstick Horn!"
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 text-lg">
              🐟
            </div>
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>URBAN</span>
              <span className="text-amber-400 font-extrabold">FISHSTICK</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold hidden sm:inline border border-emerald-500/30">
                100% REFUND PROTECTED
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {language === 'sheng' 
                ? 'Nganya ya uhakika • Toka ofisi bila presha • Bob zako ziko safe' 
                : 'Guaranteed Matatu Transit • Office Overtime Sync • 100% Auto-Refund'}
            </p>
          </div>
        </div>

        {/* Center: Role Switcher (Passenger vs Conductor) */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            id="role-passenger-btn"
            onClick={() => setUserRole('passenger')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              userRole === 'passenger'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{language === 'sheng' ? 'Abiria (Passenger)' : 'Passenger'}</span>
          </button>

          <button
            id="role-conductor-btn"
            onClick={() => setUserRole('conductor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              userRole === 'conductor'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'sheng' ? 'Donda (Conductor)' : 'Conductor'}</span>
          </button>
        </div>

        {/* Right Action Tools: Language, Sound, Wallet */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-1">
            <button
              onClick={() => setLanguage(language === 'sheng' ? 'english' : 'sheng')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
              title="Toggle Sheng / English"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="uppercase text-[11px]">{language}</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-navbar-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400'
            }`}
            title="Toggle Audio Horn & Stage Bell"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* M-Pesa Wallet Balance */}
          <div className="flex items-center gap-2 bg-slate-900 border border-emerald-500/30 rounded-2xl px-3 py-1.5">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">M-Pesa</span>
              <span className="text-xs font-black text-white font-mono leading-tight">
                KES {walletBalance}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
