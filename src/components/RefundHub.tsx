import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RefreshCcw, 
  Coins, 
  ArrowDownLeft, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Zap,
  PhoneCall,
  History,
  Lock
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { motion } from 'motion/react';

export const RefundHub: React.FC = () => {
  const { 
    walletBalance, 
    activeTicket, 
    refundHistory, 
    cancelAndRefund, 
    language,
    triggerAudioHorn
  } = useBooking();

  const [selectedReason, setSelectedReason] = useState<string>('Boss called 5:30 PM impromptu meeting');
  const [customReason, setCustomReason] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showFaq, setShowFaq] = useState<boolean>(false);

  const reasonsList = [
    'Boss called 5:30 PM impromptu meeting',
    'Client pitch ran 45 minutes late in Upper Hill',
    'Stuck in elevator or office desk overtime',
    'Heavy rain in Westlands, decided to wait it out',
    'Need to switch to a later 7:30 PM departure batch'
  ];

  const handleTriggerInstantRefund = () => {
    if (!activeTicket) return;
    setIsProcessing(true);
    const reasonToUse = customReason.trim() || selectedReason;

    setTimeout(() => {
      cancelAndRefund(activeTicket.id, reasonToUse);
      setIsProcessing(false);
      triggerAudioHorn();
    }, 600);
  };

  const totalRefundedKes = refundHistory.reduce((sum, item) => sum + item.amountKes, 0);

  return (
    <div id="refund-hub-container" className="space-y-6">
      {/* Top Banner: 100% Guarantee Shield */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Urban Fishstick 100% Zero-Loss Protection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Money Gone Because You Missed the Bus? <span className="text-emerald-400">Never.</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              In traditional Nairobi matatus, if you miss your ride by 30 seconds, your fare is gone forever. With <strong className="text-emerald-300">Urban Fishstick</strong>, your money is completely safe. If your office meeting runs late or you get held up, trigger a 1-tap instant refund or let our auto-refund engine return 100% of your fare back to M-Pesa immediately.
            </p>
          </div>

          {/* Refund Stats Card */}
          <div className="flex flex-col gap-2.5 w-full md:w-auto shrink-0 bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 sm:min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Your Safe Wallet</span>
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              KES {walletBalance}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1 border-t border-slate-800">
              <RefreshCcw className="w-3 h-3" />
              <span>Total Refunded: KES {totalRefundedKes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Ticket Refund Trigger */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <RefreshCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Instant 1-Click Office Delay Refund</h3>
                <p className="text-xs text-slate-400">Claim 100% of your fare if your schedule changes</p>
              </div>
            </div>

            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              ⚡ Instant M-Pesa Dispatch
            </span>
          </div>

          {activeTicket && activeTicket.status === 'confirmed' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-xs text-slate-400">Active Reservation:</span>
                    <h4 className="text-base font-black text-white">{activeTicket.vehicleName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Refundable Amount:</span>
                    <div className="text-lg font-black text-emerald-400 font-mono">KES {activeTicket.fareKes}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Route:</span>
                    <div className="font-bold text-slate-200">{activeTicket.routeNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Seat #:</span>
                    <div className="font-bold text-emerald-400">Seat {activeTicket.seatNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Pickup:</span>
                    <div className="font-bold text-slate-200 truncate">{activeTicket.pickupStage}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Time Left:</span>
                    <div className="font-bold text-amber-400 font-mono">
                      {Math.floor(activeTicket.secondsUntilDeparture / 60)}m {activeTicket.secondsUntilDeparture % 60}s
                    </div>
                  </div>
                </div>
              </div>

              {/* Select Reason */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Why are you requesting a refund?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {reasonsList.map((reason, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedReason(reason)}
                      className={`text-left p-2.5 rounded-xl text-xs transition-all ${
                        selectedReason === reason
                          ? 'bg-emerald-500/20 border border-emerald-500/60 text-white font-medium'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Refund Button */}
              <button
                id="execute-instant-refund-btn"
                onClick={handleTriggerInstantRefund}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm tracking-wide transition-all shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2"
              >
                <RefreshCcw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>
                  {isProcessing
                    ? 'Processing M-Pesa Payout...'
                    : `Nimechelewa - Refund KES ${activeTicket.fareKes} Instantly`}
                </span>
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white">No Active Reservation at Risk</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You currently have no pending tickets. When you book a seat, your 100% refund shield will arm automatically.
              </p>
            </div>
          )}
        </div>

        {/* 3 Pillars of Fishstick Zero-Loss Policy */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400">
            <Coins className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">How Zero-Loss Works</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400">1. Auto-Release & Re-Booking</span>
              <p className="text-slate-300">
                If you don't reach the stage by departure time, your seat is passed to a walk-in passenger and your money is immediately credited back.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400">2. Zero Hidden Penalty</span>
              <p className="text-slate-300">
                No 20% cancellation fees. What you paid (e.g. 70 KES or 100 KES) is exactly what returns to your M-Pesa balance.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400">3. Backed by SACCO Agreement</span>
              <p className="text-slate-300">
                Super Metro, Matrix, and Embassava SACCOs are integrated via our conductor escrow protocol.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Refund Ledger */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Your M-Pesa Refund History Ledger</h3>
          </div>
          <span className="text-xs text-slate-400">{refundHistory.length} Refunds Processed</span>
        </div>

        {refundHistory.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
            No refunds claimed yet. Your transit records are spotless!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {refundHistory.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4 hover:border-emerald-500/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.vehicleName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {item.method}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.reason}</p>
                  <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-emerald-400 font-mono">+KES {item.amountKes}</div>
                  <span className="text-[10px] text-emerald-500/80 font-semibold">100% Credited</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
