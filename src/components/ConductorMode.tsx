import React, { useState } from 'react';
import { 
  Bus, 
  Users, 
  BellRing, 
  CheckCircle2, 
  Volume2, 
  HandMetal, 
  Radio, 
  Megaphone, 
  RotateCcw, 
  ShieldCheck,
  Zap,
  Coins
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const ConductorMode: React.FC = () => {
  const { 
    vehicles, 
    conductorActiveVehicleId, 
    setConductorActiveVehicleId,
    confirmPassengerBoarding,
    triggerConductorHorn,
    triggerConductorTap,
    triggerDeparture,
    activeTicket,
    sendChatMessage,
    language
  } = useBooking();

  const [broadcastInput, setBroadcastInput] = useState<string>('');
  const activeVehicle = vehicles.find(v => v.id === conductorActiveVehicleId) || vehicles[0];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;
    sendChatMessage(`📢 [CONODI ANNOUNCEMENT]: ${broadcastInput}`, true);
    setBroadcastInput('');
  };

  return (
    <div id="conductor-workboard-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
      {/* Conductor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-xs font-black uppercase">
                {language === 'sheng' ? 'Dawati la Donda' : 'Conductor Workboard'}
              </span>
              <span className="text-xs text-slate-400 font-mono">{activeVehicle.plate}</span>
            </div>
            <h2 className="text-xl font-black text-white">{activeVehicle.name}</h2>
          </div>
        </div>

        {/* Matatu Switcher for Conductors */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold">Assign Nganya:</label>
          <select
            id="conductor-vehicle-select"
            value={conductorActiveVehicleId}
            onChange={(e) => setConductorActiveVehicleId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
          >
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.routeNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Crew Controls: Horn, Bodywork Tap, Coin Shake */}
      <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          id="conductor-horn-btn"
          onClick={triggerConductorHorn}
          className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-amber-400 active:scale-95 shadow"
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-xs font-bold text-white">
            {language === 'sheng' ? 'Piga Horn (Pee-Pee!)' : 'Sound Horn'}
          </span>
        </button>

        <button
          id="conductor-body-tap-btn"
          onClick={triggerConductorTap}
          className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-emerald-400 active:scale-95 shadow"
        >
          <HandMetal className="w-5 h-5" />
          <span className="text-xs font-bold text-white">
            {language === 'sheng' ? 'Gonga Bodi (2 Taps)' : 'Tap Bodywork'}
          </span>
        </button>

        <button
          id="conductor-broadcast-quick-btn"
          onClick={() => sendChatMessage(`📢 [CONODI]: Tuko ${activeVehicle.currentStageId.toUpperCase()}, viti ${activeVehicle.availableSeats} pekee zimebaki!`, true)}
          className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-blue-400 active:scale-95 shadow"
        >
          <Megaphone className="w-5 h-5" />
          <span className="text-xs font-bold text-white">
            {language === 'sheng' ? 'Tangaza Stage' : 'Call Out Stage'}
          </span>
        </button>

        <button
          id="conductor-depart-trigger-btn"
          onClick={() => triggerDeparture(activeVehicle.id)}
          className="p-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg"
        >
          <Zap className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wide">
            {language === 'sheng' ? 'Ng\'oa Nanga!' : 'Signal Depart'}
          </span>
        </button>
      </div>

      {/* Live Drop-Off Alerts from Passengers */}
      {activeTicket?.alightingRequested && (
        <div className="mb-5 p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-400/80 animate-pulse flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BellRing className="w-8 h-8 text-amber-400 animate-bounce shrink-0" />
            <div>
              <h4 className="text-base font-black text-amber-300">
                🔔 {language === 'sheng' ? 'ALIGHTING SIGNAL: "Nishushe Hapo!"' : 'PASSENGER REQUEST: DROP ME HERE!'}
              </h4>
              <p className="text-xs text-white">
                Passenger on <strong>Seat #{activeTicket.seatNumber}</strong> is alighting at <strong>{activeTicket.destinationStage}</strong>.
              </p>
            </div>
          </div>
          <button
            id="conductor-confirm-drop-btn"
            onClick={() => {
              triggerConductorTap();
              confirmPassengerBoarding(activeTicket.id);
            }}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl uppercase tracking-wider"
          >
            {language === 'sheng' ? 'Wazi! Shukisha' : 'Acknowledge Drop'}
          </button>
        </div>
      )}

      {/* Passenger Manifest Table */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              {language === 'sheng' ? 'Orodha ya Abiria (Live Manifest)' : 'Live Passenger Boarding Manifest'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {activeVehicle.totalSeats - activeVehicle.availableSeats} / {activeVehicle.totalSeats} Seats Booked
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {activeTicket ? (
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                  #{activeTicket.seatNumber}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">App User (Office Commuter)</h4>
                  <p className="text-[11px] text-slate-400">
                    {activeTicket.pickupStage} ➔ {activeTicket.destinationStage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                  KES {activeTicket.fareKes} PAID
                </span>
                {activeTicket.status === 'confirmed' && (
                  <button
                    onClick={() => confirmPassengerBoarding(activeTicket.id)}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-all"
                  >
                    Check In
                  </button>
                )}
                {activeTicket.status === 'onboard' && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> On Board
                  </span>
                )}
              </div>
            </div>
          ) : null}

          {/* Simulated other pre-booked commuters */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center">
                #01
              </span>
              <div>
                <h4 className="font-semibold text-slate-200">Brian Ochieng (Upper Hill)</h4>
                <p className="text-[11px] text-slate-400">Kencom ➔ Westlands Sarit</p>
              </div>
            </div>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> On Board
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center">
                #02
              </span>
              <div>
                <h4 className="font-semibold text-slate-200">Mercy Njeri (Equity Bank)</h4>
                <p className="text-[11px] text-slate-400">Kencom ➔ Kikuyu End</p>
              </div>
            </div>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> On Board
            </span>
          </div>
        </div>
      </div>

      {/* Broadcast Message Input to Passengers */}
      <form onSubmit={handleBroadcast} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={broadcastInput}
          onChange={(e) => setBroadcastInput(e.target.value)}
          placeholder={language === 'sheng' ? "Tumia abiria ujumbe (mf. 'Tuko Kencom tunajaza...')" : "Broadcast announcement to passengers..."}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow"
        >
          Send
        </button>
      </form>
    </div>
  );
};
