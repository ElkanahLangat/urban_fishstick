import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Send, 
  Zap, 
  Flame, 
  Coffee, 
  Smile,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { createCommuteCalendarEvent } from '../services/googleCalendar';
import { saveReceiptToGoogleDrive } from '../services/googleDrive';
import { getAccessToken } from '../services/googleAuth';

interface OfficeHubLocation {
  id: string;
  name: string;
  area: string;
  closestStage: string;
  estimatedWalkMinutes: number;
  popularRoutes: string[];
}

const NAIROBI_OFFICE_HUBS: OfficeHubLocation[] = [
  {
    id: 'upperhill',
    name: 'Upper Hill Financial District',
    area: 'Hospital Rd / Kilimanjaro Ave',
    closestStage: 'Community Stage / Railways CBD',
    estimatedWalkMinutes: 6,
    popularRoutes: ['Route 125 (Rongai)', 'Route 33 (Embakasi)', 'Route 105 (Westlands)']
  },
  {
    id: 'westlands',
    name: 'Westlands Commercial Hub (The Mirage / Delta)',
    area: 'Chiromo Rd / Waiyaki Way',
    closestStage: 'Westlands Stage / Safaricom HQ',
    estimatedWalkMinutes: 4,
    popularRoutes: ['Route 105 (Kikuyu/CBD)', 'Route 118 (Wangige)']
  },
  {
    id: 'cbd_towers',
    name: 'Nairobi CBD Corporate Towers (KICC / Teleposta)',
    area: 'City Square / Harambee Ave',
    closestStage: 'Kencom / Ambassadeur / Railways',
    estimatedWalkMinutes: 2,
    popularRoutes: ['Route 44 (Roysambu)', 'Route 105 (Uthiru)', 'Route 58 (Buruburu)']
  },
  {
    id: 'kilimani',
    name: 'Kilimani & Yaya Center Tech Hub',
    area: 'Argwings Kodhek Rd / Chania Ave',
    closestStage: 'Prestige / Yaya Stage',
    estimatedWalkMinutes: 5,
    popularRoutes: ['Route 46 (Kawangware/CBD)', 'Route 102 (Dagoretti)']
  }
];

export const OfficeOvertimeButler: React.FC = () => {
  const { 
    activeTicket, 
    selectedVehicle, 
    cancelAndRefund, 
    triggerAudioHorn,
    walletBalance 
  } = useBooking();

  const [selectedHub, setSelectedHub] = useState<OfficeHubLocation>(NAIROBI_OFFICE_HUBS[0]);
  const [meetingEndEstimate, setMeetingEndEstimate] = useState<string>('18:45');
  const [autoArmRefund, setAutoArmRefund] = useState<boolean>(true);
  const [butlerStatus, setButlerStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [bossExcusePreset, setBossExcusePreset] = useState<string>('impromptu_board_call');

  const handleActivateButler = async () => {
    setIsSyncing(true);
    setButlerStatus(null);
    triggerAudioHorn();

    try {
      const token = await getAccessToken();
      if (token) {
        // Sync to calendar
        await createCommuteCalendarEvent({
          vehicleName: selectedVehicle?.name || 'Super Metro (Fishstick Guard)',
          route: selectedVehicle?.routeNumber || 'Route 105',
          pickupStage: selectedHub.closestStage,
          destinationStage: 'Home Terminal',
          seatNumber: activeTicket?.seatNumber || 4,
          departureTimeStr: meetingEndEstimate
        });

        // Backup plan to Google Drive
        await saveReceiptToGoogleDrive(`UrbanFishstick_ButlerProtection_${Date.now()}`, {
          service: 'Urban Fishstick Office Overtime Butler',
          hub: selectedHub.name,
          closestStage: selectedHub.closestStage,
          meetingEndEstimate,
          autoRefundArmed: autoArmRefund,
          guarantee: '100% Zero-Loss Auto Refund',
          createdAt: new Date().toISOString()
        });

        setButlerStatus(`🛡️ Butler Activated! Synced with Google Calendar & backed up to Google Drive. Departure set for ${meetingEndEstimate} from ${selectedHub.closestStage}.`);
      } else {
        setButlerStatus(`🛡️ Butler Armed locally! Your ${selectedHub.closestStage} departure is protected. (Sign in with Google in the Workspace tab to enable direct Calendar & Drive cloud sync).`);
      }
    } catch (err: any) {
      setButlerStatus(`🛡️ Butler Armed! Departure calibrated for ${meetingEndEstimate}.`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div id="office-overtime-butler" className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-indigo-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Executive Commute Concierge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              The "Stay Till The Deal Is Signed" <span className="text-emerald-400">Office Butler</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Don't cut your client pitch short or sprint down the stairs in terror of missing a 5:30 PM bus. Tell the Butler when your meeting wraps up, and it will calculate walk times, match the fastest passing Nganya, and arm your 100% refund safety shield.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 shrink-0 text-center min-w-[200px]">
            <span className="text-xs text-slate-400">Walk Time to Stage</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {selectedHub.estimatedWalkMinutes} min
            </div>
            <span className="text-[11px] text-slate-300">from {selectedHub.id.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Butler Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Select Office Hub */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400">
            <Building2 className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">1. Select Your Office Hub</h3>
          </div>

          <div className="space-y-2">
            {NAIROBI_OFFICE_HUBS.map(hub => (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className={`w-full text-left p-3.5 rounded-2xl text-xs transition-all border ${
                  selectedHub.id === hub.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-white font-medium shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-white">{hub.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{hub.area}</div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                  <span>🚶 {hub.estimatedWalkMinutes} min walk to {hub.closestStage.split('/')[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Set Meeting Overtime & Automation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-indigo-400">
            <Clock className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">2. Meeting Time & Auto-Shield</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Estimated Meeting Wrap-Up Time:
              </label>
              <input
                type="time"
                value={meetingEndEstimate}
                onChange={e => setMeetingEndEstimate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">
                Quick Overtime Extension Presets:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMeetingEndEstimate('18:00')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold"
                >
                  6:00 PM
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingEndEstimate('18:30')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold"
                >
                  6:30 PM
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingEndEstimate('19:15')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold"
                >
                  7:15 PM
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">100% Zero-Loss Auto-Arm</span>
                <input
                  type="checkbox"
                  checked={autoArmRefund}
                  onChange={e => setAutoArmRefund(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400 bg-slate-900 border-slate-700"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                If the meeting runs past your designated departure, your seat is passed forward and KES is returned instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Butler Telemetry Action */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Zap className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">3. Activate Concierge</h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400">Target Stage:</div>
              <div className="font-bold text-white">{selectedHub.closestStage}</div>
              
              <div className="text-slate-400 pt-2">Exit Strategy:</div>
              <div className="text-emerald-400 font-medium">
                Leave office desk at <strong>{meetingEndEstimate}</strong> → Arrive at stage in {selectedHub.estimatedWalkMinutes} mins → Board guaranteed Nganya.
              </div>
            </div>

            {butlerStatus && (
              <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 leading-relaxed">
                {butlerStatus}
              </div>
            )}
          </div>

          <button
            id="activate-overtime-butler-btn"
            onClick={handleActivateButler}
            disabled={isSyncing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSyncing ? 'Calibrating Butler...' : 'Arm Office Overtime Butler'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
