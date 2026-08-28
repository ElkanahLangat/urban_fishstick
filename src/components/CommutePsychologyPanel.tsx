import React, { useState } from 'react';
import { 
  Brain, 
  Smile, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp, 
  Coffee, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Flame,
  Laugh,
  RefreshCcw,
  CalendarCheck
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { motion } from 'motion/react';

export const CommutePsychologyPanel: React.FC<{ onOpenCalendarSync?: () => void }> = ({ onOpenCalendarSync }) => {
  const { 
    walletBalance, 
    activeTicket, 
    cancelAndRefund, 
    language,
    triggerAudioHorn
  } = useBooking();

  const [officeOvertimeMinutes, setOfficeOvertimeMinutes] = useState<number>(45);
  const [meetingStressLevel, setMeetingStressLevel] = useState<number>(20); // 0 to 100
  const [extendedOfficeTime, setExtendedOfficeTime] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'psychology' | 'calculator' | 'manifesto'>('psychology');

  const handleExtendOfficeStay = (mins: number) => {
    setOfficeOvertimeMinutes(prev => prev + mins);
    setExtendedOfficeTime(true);
    setMeetingStressLevel(Math.max(0, meetingStressLevel - 30));
    triggerAudioHorn();
  };

  return (
    <div id="commute-psychology-panel" className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nairobi Commuter Cognitive Psychology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Why Panic at 5:00 PM? <span className="text-emerald-400">Own Your Time.</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Traditional Nairobi commuting causes severe "Stage Panic" — rushing out of meetings in terror of rain, price doubling, and packed queues. <strong className="text-emerald-300">Urban Fishstick</strong> turns anxiety into calm focus. Finish your work in peace knowing your seat is locked or your money is 100% auto-refunded.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-center">
              <span className="text-xs text-slate-400 font-medium">Stage Panic Index</span>
              <div className="text-3xl font-black text-emerald-400 flex items-center justify-center gap-1">
                <span>0%</span>
                <Smile className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-[11px] text-slate-400">Zero panic guaranteed</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-6 border-t border-slate-800 pt-4">
          <button
            onClick={() => setActiveTab('psychology')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'psychology'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            🧠 Commuter Psychology Breakdown
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'calculator'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            ⏱️ Office Overtime Freedom Simulator
          </button>
          <button
            onClick={() => setActiveTab('manifesto')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'manifesto'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            🐟 Fishstick Sheng Manifesto
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'psychology' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: The 5 PM Scramble Syndrome */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-rose-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">The "5 PM Scramble" Syndrome</h3>
              <span className="text-xs text-rose-400 font-semibold">The Anatomy of Office Transit Panic</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When 4:55 PM arrives in Upper Hill or Westlands, employees get distracted. Cortisol spikes because missing the 5:10 PM bus means:
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Standing in 45-minute lines at Kencom or Odeon in sudden rain.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Fares surging from 70 KES to 150 KES due to opportunistic touts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Leaving important emails unreplied just to beat the crowd.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: The Urban Fishstick Psychology */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">The Predictable Transporter</h3>
              <span className="text-xs text-emerald-400 font-semibold">Predictability Unlocks Executive Calm</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When you know your seat is reserved and tracked with real-time GPS telemetry:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Predictable Boarding:</strong> Walk to the stage exactly 4 minutes before departure.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Zero Scramble:</strong> No pushing, no shouting, no standing in muddy ditches.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">100% Financial Safety:</strong> If your boss talks for 15 more minutes, money is auto-refunded to M-Pesa.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Deep Career & Health Dividends */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Compound Career Dividends</h3>
              <span className="text-xs text-indigo-400 font-semibold">Deep Focus & Overtime Without Fear</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              People with predictable transit perform better in modern high-pressure careers:
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>You can stay for that impromptu brainstorm or promotion talk.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>Arrive home with energy to study, exercise, or relax with family.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>Syncs with Google Calendar so your schedule auto-adjusts seamlessly.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>Office Overtime & Time Freedom Simulator</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Simulate extending your work hours calmly without fear of stranded coins or lost matatus.
              </p>
            </div>

            {onOpenCalendarSync && (
              <button
                onClick={onOpenCalendarSync}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-all shadow"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Sync with Google Calendar</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Extra Overtime Minutes</span>
                <span className="text-lg font-black text-emerald-400 font-mono">+{officeOvertimeMinutes} min</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleExtendOfficeStay(15)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  +15 min
                </button>
                <button
                  onClick={() => handleExtendOfficeStay(30)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  +30 min
                </button>
                <button
                  onClick={() => handleExtendOfficeStay(60)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  +60 min
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Clicking pushes your matatu departure to the next guaranteed shuttle window and arms your 100% refund policy.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-400">Anxiety Reduction Meter</span>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, officeOvertimeMinutes * 1.5 + 40)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Before: High Panic (98%)</span>
                <span className="text-emerald-400 font-bold">Now: Pure Zen (0% Panic)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300">
                ✨ You gained <strong>{(officeOvertimeMinutes / 60).toFixed(1)} hrs</strong> of calm productive output without looking at the clock every 2 minutes!
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-400">Financial Safety Shield</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">
                  KES
                </div>
                <div>
                  <div className="text-lg font-black text-white">100% Auto-Refunded</div>
                  <span className="text-[11px] text-emerald-400 font-mono">0 KES Lost if Missed</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                If your meeting goes past 7:00 PM, Urban Fishstick releases your seat to another passenger and returns the fare to M-Pesa instantly.
              </p>
            </div>
          </div>

          {activeTicket && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Active Ticket: {activeTicket.vehicleName} (Seat #{activeTicket.seatNumber})</h4>
                  <p className="text-[11px] text-amber-300">
                    Running late in your office? You can trigger an instant refund or auto-push your departure.
                  </p>
                </div>
              </div>
              <button
                onClick={() => cancelAndRefund(activeTicket.id, 'Office Overtime Extension Triggered')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow shrink-0 flex items-center gap-1.5"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Trigger Instant 100% Refund (KES {activeTicket.fareKes})</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Fishstick Manifesto Tab */}
      {activeTab === 'manifesto' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
              🐟
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">The Urban Fishstick Manifesto</h3>
              <p className="text-xs text-slate-400">Why are we called Urban Fishstick? Because we are crisp, predictable, and never soggy.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-emerald-400">Rule #1: "Hata Boss Akikuitisha Meeting ya 5:30 PM, Tulia!"</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In Nairobi, office workers used to get panic sweats when a manager booked a 5:30 PM sync. "Chapaa yangu ya matatu itakua gone!" Not anymore. Urban Fishstick holds your reservation or sends your M-Pesa back faster than you can say "Let's circle back tomorrow."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-emerald-400">Rule #2: "Nganya Bila Ghasia, Time Yako Ni Gold"</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                You don't have to wrestle with 40 people at Kencom to get into Super Metro. Book on the app, watch the live GPS dot move on Waiyaki Way, step out of the lift, and board like a VIP.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-emerald-400">Rule #3: "Zero-Loss Guarantee (Bob Zako Ziko Safe)"</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Why should you pay for a bus you didn't board because your client call went over? We treat commuter money with sacred respect. 100% auto-refund without filling 14 paper forms.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-emerald-400">Rule #4: "The Fishstick Tranquility State"</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                A fishstick never panics in the ocean; it floats with poise and crisp dignity. Ride across Nairobi like a serene fishstick with Bass boosted Gengetone in the background and guaranteed safety.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
