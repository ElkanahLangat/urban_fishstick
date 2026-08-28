/**
 * Urban Fishstick - Nairobi Matatu Transit, Time Freedom & Google Workspace Hub
 */

import React, { useState } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { NairobiLiveMap } from './components/NairobiLiveMap';
import { MatatuFleetList } from './components/MatatuFleetList';
import { MatatuBookingCard } from './components/MatatuBookingModal';
import { ActiveTicketPass } from './components/ActiveTicketPass';
import { ConductorMode } from './components/ConductorMode';
import { MatatuChat } from './components/MatatuChat';
import { SafetyRadar } from './components/SafetyRadar';
import { CodeEngineSandbox } from './components/CodeEngineSandbox';
import { RefundHistoryCard } from './components/RefundHistoryCard';
import { CommutePsychologyPanel } from './components/CommutePsychologyPanel';
import { GoogleWorkspaceHub } from './components/GoogleWorkspaceHub';
import { RefundHub } from './components/RefundHub';
import { OfficeOvertimeButler } from './components/OfficeOvertimeButler';
import { MatatuMixtapeSoundboard } from './components/MatatuMixtapeSoundboard';
import { 
  Bus, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Code2, 
  MessageSquare, 
  RotateCcw,
  Compass,
  AlertTriangle,
  Info,
  Brain,
  Calendar,
  HardDrive,
  Coins,
  RefreshCcw,
  Building2,
  Headphones
} from 'lucide-react';

const MainDashboard: React.FC = () => {
  const { userRole, language, activeTicket } = useBooking();
  const [activeTab, setActiveTab] = useState<
    'booking' | 'butler' | 'mixtape' | 'psychology' | 'refunds' | 'workspace' | 'safety' | 'chat' | 'code'
  >('booking');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Active Ticket Banner (If Passenger Has Booked) */}
        {activeTicket && <ActiveTicketPass />}

        {/* Mode-Specific Views */}
        {userRole === 'conductor' ? (
          /* Conductor (Makanga) Operations View */
          <div className="space-y-6">
            <ConductorMode />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NairobiLiveMap />
              </div>
              <div>
                <MatatuChat />
              </div>
            </div>
          </div>
        ) : (
          /* Passenger Booking & Explorer View */
          <div className="space-y-6">
            {/* Primary Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                id="tab-booking-view-btn"
                onClick={() => setActiveTab('booking')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'booking'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Bus className="w-4 h-4" />
                <span>{language === 'sheng' ? 'Weka Form & Live Radar' : 'Booking & Live Radar'}</span>
              </button>

              <button
                id="tab-butler-view-btn"
                onClick={() => setActiveTab('butler')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'butler'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'sheng' ? 'Office Overtime Butler' : 'Office Butler & Overtime'}</span>
              </button>

              <button
                id="tab-mixtape-view-btn"
                onClick={() => setActiveTab('mixtape')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'mixtape'
                    ? 'bg-teal-500 text-slate-950 font-black shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Headphones className="w-4 h-4 text-teal-400" />
                <span>{language === 'sheng' ? 'Nganya Mixtape & DJ SFX' : 'Matatu Mixtape & SFX'}</span>
              </button>

              <button
                id="tab-psychology-view-btn"
                onClick={() => setActiveTab('psychology')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'psychology'
                    ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Brain className="w-4 h-4 text-emerald-300" />
                <span>{language === 'sheng' ? 'Deep Psychology & Overtime' : 'Commute Psychology & Time Freedom'}</span>
              </button>

              <button
                id="tab-refunds-view-btn"
                onClick={() => setActiveTab('refunds')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'refunds'
                    ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="flex items-center gap-1">
                  <span>{language === 'sheng' ? '100% Refund Hub' : '100% Refund Hub'}</span>
                  <span className="bg-emerald-500 text-slate-950 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">0% LOSS</span>
                </span>
              </button>

              <button
                id="tab-workspace-view-btn"
                onClick={() => setActiveTab('workspace')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'workspace'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Google Drive & Calendar</span>
              </button>

              <button
                id="tab-safety-view-btn"
                onClick={() => setActiveTab('safety')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'safety'
                    ? 'bg-rose-500 text-white shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'sheng' ? 'Rada ya Mtaa & Safety' : 'Safety Radar & Guide'}</span>
              </button>

              <button
                id="tab-chat-view-btn"
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'chat'
                    ? 'bg-teal-500 text-slate-950 shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'sheng' ? 'Nganya Chat' : 'In-App Chat'}</span>
              </button>

              <button
                id="tab-code-view-btn"
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'code'
                    ? 'bg-cyan-500 text-slate-950 shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>C++ & Python Engine</span>
              </button>
            </div>

            {/* Tab 1: Booking & Live Radar */}
            {activeTab === 'booking' && (
              <div className="space-y-6">
                {/* Live Interactive Vector Radar */}
                <NairobiLiveMap />

                {/* Available Fleet & Selected Booking Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Matatu Fleet List & Refund Status */}
                  <div className="lg:col-span-5 space-y-6">
                    <MatatuFleetList />
                    <RefundHistoryCard />
                  </div>

                  {/* Right: Booking Panel */}
                  <div className="lg:col-span-7">
                    <MatatuBookingCard />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Office Overtime Butler & Concierge */}
            {activeTab === 'butler' && <OfficeOvertimeButler />}

            {/* Tab 3: Matatu Mixtape & DJ Soundboard */}
            {activeTab === 'mixtape' && <MatatuMixtapeSoundboard />}

            {/* Tab 4: Commuter Psychology & Office Overtime Freedom */}
            {activeTab === 'psychology' && (
              <CommutePsychologyPanel onOpenCalendarSync={() => setActiveTab('workspace')} />
            )}

            {/* Tab 3: 100% Refund Hub */}
            {activeTab === 'refunds' && <RefundHub />}

            {/* Tab 4: Google Workspace Hub (Drive & Calendar) */}
            {activeTab === 'workspace' && <GoogleWorkspaceHub />}

            {/* Tab 5: Safety Radar & Nairobi Adventure Guide */}
            {activeTab === 'safety' && <SafetyRadar />}

            {/* Tab 6: In-App Commuter Chat */}
            {activeTab === 'chat' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MatatuChat />
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      {language === 'sheng' ? 'Msimbo wa Maadili ya Fishstick' : 'Commuter Etiquette'}
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                      <li>• <strong>Nishushe Hapo:</strong> Tap the bell button early before reaching your stage to alert the conductor safely.</li>
                      <li>• <strong>Office Delay:</strong> Never rush through traffic; if delayed past the window, your money is refunded automatically.</li>
                      <li>• <strong>Keep Valuables Safe:</strong> Follow the real-time safety radar recommendations.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: C++ & Python Code Engine Inspector */}
            {activeTab === 'code' && <CodeEngineSandbox />}
          </div>
        )}

        {/* Global Footer with Nairobi Matatu Culture Note & Google Maps Notice */}
        <footer className="mt-12 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐟</span>
            <span>Urban Fishstick Nairobi — Stress-free matatus, Google Calendar overtime sync & 100% zero-loss auto-refunds.</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Nairobi Live GPS Radar & Google Workspace Sync Enabled</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BookingProvider>
      <MainDashboard />
    </BookingProvider>
  );
}
