import React from 'react';
import { 
  QrCode, 
  Clock, 
  BellRing, 
  ShieldAlert, 
  RotateCcw, 
  CheckCircle2, 
  Bus, 
  MapPin, 
  UserCheck, 
  Volume2, 
  Sparkles 
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const ActiveTicketPass: React.FC = () => {
  const { 
    activeTicket, 
    cancelAndRefund, 
    requestDropMeHere, 
    language,
    triggerAudioHorn
  } = useBooking();

  if (!activeTicket) return null;

  const minutesLeft = Math.floor(activeTicket.secondsUntilDeparture / 60);
  const secondsLeft = activeTicket.secondsUntilDeparture % 60;
  const isDelayedRefunded = activeTicket.status === 'delayed_refunded';

  return (
    <div id="active-ticket-pass-card" className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl backdrop-blur-xl overflow-hidden mb-6 animate-in fade-in slide-in-from-top-4">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
            {language === 'sheng' ? 'TIKETI YAKO YA NGANYA (LIVE)' : 'ACTIVE MATATU BOARDING PASS'}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
            {activeTicket.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeTicket.status === 'confirmed' && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-bold font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>Office Departure in: {minutesLeft}:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</span>
            </div>
          )}
          {activeTicket.status === 'onboard' && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{language === 'sheng' ? 'Uko Ndani ya Nganya' : 'Safely On Board'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Ticket Grid */}
      <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left: Vehicle & Route Info */}
        <div className="md:col-span-2 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">
                {activeTicket.routeNumber}
              </span>
              <span className="text-xs font-bold text-slate-400">{activeTicket.sacco}</span>
            </div>
            <h2 className="text-2xl font-black text-white">{activeTicket.vehicleName}</h2>
            <p className="text-xs text-amber-400 font-mono">Plate: {activeTicket.plate}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">📍 {language === 'sheng' ? 'Kupandia' : 'Pickup'}</span>
              <strong className="text-white text-sm">{activeTicket.pickupStage}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">🏁 {language === 'sheng' ? 'Kushukia' : 'Destination'}</span>
              <strong className="text-white text-sm">{activeTicket.destinationStage}</strong>
            </div>
          </div>
        </div>

        {/* Right: Seat Highlight & Digital QR */}
        <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Reserved Seat</span>
          <span className="text-4xl font-black text-amber-400 my-1">
            #{activeTicket.seatNumber < 10 ? `0${activeTicket.seatNumber}` : activeTicket.seatNumber}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">Nauli Paid: KES {activeTicket.fareKes}</span>
          
          {/* Simulated QR Code */}
          <div className="mt-2 p-1.5 bg-white rounded-lg shadow-sm">
            <QrCode className="w-12 h-12 text-slate-950" />
          </div>
          <span className="text-[9px] text-slate-500 font-mono mt-1">Show Conductor</span>
        </div>
      </div>

      {/* Action Row: Drop Me Here & Office Delay Refund */}
      <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Drop Me Here (Nishushe Hapo) Button */}
        <button
          id="drop-me-here-button"
          onClick={requestDropMeHere}
          disabled={activeTicket.alightingRequested}
          className={`flex-1 min-w-[220px] py-3.5 px-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
            activeTicket.alightingRequested
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
              : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/20 active:scale-95'
          }`}
        >
          <BellRing className="w-5 h-5 animate-bounce" />
          <span>
            {activeTicket.alightingRequested
              ? (language === 'sheng' ? '🔔 Conductor Amepewa Alert!' : '🔔 Drop-off Signal Active!')
              : (language === 'sheng' ? 'Nishushe Hapo! (Drop Me Here)' : 'Drop Me Here (Alight Request)')}
          </span>
        </button>

        {/* Office Delay Instant Refund Button */}
        {activeTicket.status === 'confirmed' && (
          <button
            id="office-delay-refund-btn"
            onClick={() => cancelAndRefund(activeTicket.id, 'User clicked Office Delay Refund')}
            className="py-3.5 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              {language === 'sheng' ? 'Nimechelewa Ofisi (100% Refund)' : 'Delayed at Office (Instant Refund)'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
