import React, { useState } from 'react';
import { 
  Bus, 
  Armchair, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  AlertCircle,
  Zap,
  Volume2,
  Wifi,
  Tv,
  Music
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { MatatuVehicle, NAIROBI_STAGES, Stage } from '../data/nairobiRoutes';
import confetti from 'canvas-confetti';

interface SeatMapProps {
  vehicle: MatatuVehicle;
  selectedSeat: number | null;
  onSelectSeat: (seatNum: number) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ vehicle, selectedSeat, onSelectSeat }) => {
  const { language } = useBooking();
  // Generate seats layout based on capacity (14-seater vs 33-seater)
  const is14Seater = vehicle.capacity <= 14;
  const totalSeats = vehicle.totalSeats;
  const takenSeatsCount = totalSeats - vehicle.availableSeats;
  
  // Deterministic taken seats for simulation
  const takenSeatIndices = new Set<number>([1, 2, 5, 8, 11, 14, 18, 22].filter(n => n <= takenSeatsCount + 3));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          {language === 'sheng' ? 'Chagua Kiti Chako' : 'Select Your Seat'}
        </span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700"></span> Available
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Selected
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded bg-rose-950/60 border border-rose-800"></span> Taken
          </span>
        </div>
      </div>

      {/* Front Bus Driver & Conductor Row */}
      <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 mb-3">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span>🚗 Pilot:</span>
            <span className="text-white">{vehicle.driverName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-pink-400 font-semibold">
            <span>🎟️ Conductor:</span>
            <span className="text-white">{vehicle.conductorName}</span>
          </div>
        </div>
      </div>

      {/* Seat Matrix Grid */}
      <div className={`grid ${is14Seater ? 'grid-cols-3' : 'grid-cols-4'} gap-2 max-h-56 overflow-y-auto pr-1`}>
        {Array.from({ length: totalSeats }, (_, i) => i + 1).map(seatNum => {
          const isTaken = takenSeatIndices.has(seatNum);
          const isSelected = selectedSeat === seatNum;

          return (
            <button
              key={seatNum}
              id={`seat-button-${seatNum}`}
              disabled={isTaken}
              onClick={() => onSelectSeat(seatNum)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                isTaken
                  ? 'bg-rose-950/20 border-rose-900/40 text-rose-500/50 cursor-not-allowed'
                  : isSelected
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg scale-105 z-10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-emerald-500/60 hover:bg-slate-800'
              }`}
            >
              <Armchair className={`w-4 h-4 mb-0.5 ${isSelected ? 'text-slate-950' : isTaken ? 'text-rose-600/40' : 'text-slate-400'}`} />
              <span>#{seatNum < 10 ? `0${seatNum}` : seatNum}</span>
              {seatNum === 4 && !isTaken && (
                <span className="absolute -top-1 -right-1 px-1 bg-amber-400 text-slate-950 text-[8px] font-black rounded-full">
                  VIP
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const MatatuBookingCard: React.FC = () => {
  const { 
    selectedVehicle, 
    selectedPickupStage, 
    setSelectedPickupStage,
    selectedDestStage,
    setSelectedDestStage,
    bookSeat, 
    walletBalance,
    language,
    triggerAudioHorn
  } = useBooking();

  const [selectedSeat, setSelectedSeat] = useState<number | null>(4);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!selectedVehicle) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400">
        <Bus className="w-12 h-12 mx-auto mb-3 text-slate-600 animate-pulse" />
        <p>Select a Matatu from the live fleet to book your seat.</p>
      </div>
    );
  }

  const handleBook = () => {
    if (!selectedSeat) return;
    setIsProcessing(true);

    setTimeout(() => {
      const success = bookSeat(
        selectedVehicle,
        selectedSeat,
        selectedPickupStage?.name || selectedVehicle.routeOrigin,
        selectedDestStage?.name || selectedVehicle.routeDestination
      );

      if (success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div id="booking-card-panel" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
      {/* Top Header & Matatu Identity */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-xs font-black text-slate-950 uppercase"
              style={{ backgroundColor: selectedVehicle.colorHex }}
            >
              {selectedVehicle.routeNumber}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide border border-[#15e082] px-2 py-0.5 rounded-md">
              {selectedVehicle.sacco}
            </span>
          </div>
          <h3 className="text-2xl text-[24px] font-black text-white mt-1 flex items-center gap-2">
            {selectedVehicle.name}
          </h3>
          <p className="text-xs text-slate-400">
            Plate: <strong className="text-amber-400 font-mono">{selectedVehicle.plate}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">{language === 'sheng' ? 'Nauli (M-Pesa):' : 'Fare:'}</span>
          <span className="text-2xl font-black text-emerald-400">KES {selectedVehicle.fareKes}</span>
          <span className="text-[10px] text-slate-500 block">Fixed Rate (No Jam Surge)</span>
        </div>
      </div>

      {/* Route Corridor & Stages Selection */}
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5">
            📍 {language === 'sheng' ? 'Stage ya Kupandia (Pick-up)' : 'Pick-up Stage'}
          </label>
          <select
            id="pickup-stage-select"
            value={selectedPickupStage?.id || 'kencom'}
            onChange={(e) => {
              const stage = NAIROBI_STAGES.find(s => s.id === e.target.value);
              if (stage) setSelectedPickupStage(stage);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
          >
            {NAIROBI_STAGES.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.zone})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5">
            🏁 {language === 'sheng' ? 'Stage ya Kushukia (Destination)' : 'Destination Stage'}
          </label>
          <select
            id="dest-stage-select"
            value={selectedDestStage?.id || 'westlands'}
            onChange={(e) => {
              const stage = NAIROBI_STAGES.find(s => s.id === e.target.value);
              if (stage) setSelectedDestStage(stage);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
          >
            {NAIROBI_STAGES.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.zone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Onboard Amenities & Vibe Badges */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {selectedVehicle.amenities.map((item, idx) => (
          <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] text-slate-300 font-medium flex items-center gap-1">
            {item.includes('WiFi') && <Wifi className="w-3 h-3 text-emerald-400" />}
            {item.includes('TV') || item.includes('Screens') ? <Tv className="w-3 h-3 text-blue-400" /> : null}
            {item.includes('Sound') || item.includes('Bass') ? <Music className="w-3 h-3 text-pink-400" /> : null}
            {item}
          </span>
        ))}
      </div>

      {/* Seat Map Selector */}
      <SeatMap
        vehicle={selectedVehicle}
        selectedSeat={selectedSeat}
        onSelectSeat={(num) => setSelectedSeat(num)}
      />

      {/* Office Delay Auto-Refund Policy Banner (Core User Promise) */}
      <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <strong className="text-emerald-300 font-bold block mb-0.5">
            {language === 'sheng' ? '✓ Toka Ofisi Bila Stress Guarantee (Refund Policy)' : '✓ Office Delay 100% Refund Guarantee'}
          </strong>
          <p className="text-slate-300 leading-relaxed">
            {language === 'sheng'
              ? 'Book ukiwa kwa ofisi. Ukikwama kwa meeting na matatu iondoke, bob zako (KES ' + selectedVehicle.fareKes + ') zinarudishwa papo hapo kwa M-Pesa!'
              : 'Book comfortably from your desk. If delayed by work or a meeting, the matatu departs on time and your KES ' + selectedVehicle.fareKes + ' is auto-refunded to your M-Pesa immediately.'}
          </p>
        </div>
      </div>

      {/* Departure Info & Action Button */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-400 block">Departure Window</span>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>{selectedVehicle.departureTime} (~{selectedVehicle.departureMinutesLeft}m left)</span>
          </div>
        </div>

        <button
          id="confirm-booking-button"
          disabled={!selectedSeat || isProcessing}
          onClick={handleBook}
          className="flex-1 max-w-xs py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 animate-spin" /> Locking Seat...
            </span>
          ) : (
            <>
              <span>{language === 'sheng' ? `Weka Seat #${selectedSeat}` : `Book Seat #${selectedSeat}`}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
