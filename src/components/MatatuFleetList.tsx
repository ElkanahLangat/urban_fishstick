import React from 'react';
import { 
  Bus, 
  Users, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  CheckCircle2, 
  Radio, 
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { MatatuVehicle } from '../data/nairobiRoutes';

export const MatatuFleetList: React.FC = () => {
  const { 
    vehicles, 
    selectedVehicle, 
    setSelectedVehicle, 
    language,
    triggerAudioHorn
  } = useBooking();

  return (
    <div id="matatu-fleet-selector" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            {language === 'sheng' ? 'Nganya Zilizopo Tayari (Live Fleet)' : 'Available Matatus Ready for Booking'}
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          {vehicles.length} Vehicles On-Stage
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {vehicles.map(veh => {
          const isSelected = selectedVehicle?.id === veh.id;
          const isFull = veh.availableSeats === 0;

          return (
            <div
              key={veh.id}
              id={`vehicle-card-${veh.id}`}
              onClick={() => {
                setSelectedVehicle(veh);
                triggerAudioHorn();
              }}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-xl ring-2 ring-emerald-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                {/* Top Badge: Route & Fare */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span 
                      className="px-2 py-0.5 rounded-md text-[11px] font-black text-slate-950 uppercase"
                      style={{ backgroundColor: veh.colorHex }}
                    >
                      {veh.routeNumber}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      {veh.sacco}
                    </span>
                  </div>
                  <span className="text-sm font-black text-emerald-400">
                    KES {veh.fareKes}
                  </span>
                </div>

                {/* Name */}
                <h4 className="text-base font-bold text-white mb-1 flex items-center justify-between">
                  <span>{veh.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </h4>

                {/* Route Points */}
                <p className="text-xs text-slate-400 mb-2">
                  {veh.routeOrigin.split('(')[0]} ➔ {veh.routeDestination.split('(')[0]}
                </p>

                {/* Vibe line */}
                <p className="text-[11px] text-slate-400 italic line-clamp-1 mb-3">
                  "{veh.vibe}"
                </p>
              </div>

              {/* Footer specs */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong className="text-emerald-400">{veh.availableSeats}</strong> / {veh.totalSeats} left
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{veh.departureMinutesLeft}m to depart</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
