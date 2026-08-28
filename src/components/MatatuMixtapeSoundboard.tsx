import React, { useState } from 'react';
import { 
  AudioWaveform, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Flame, 
  Radio, 
  Disc, 
  Music2, 
  Sparkles, 
  Headphones, 
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

interface MixtapeStation {
  id: string;
  sacco: string;
  name: string;
  dj: string;
  genre: string;
  frequency: string;
  vibe: 'rush_hour_hype' | 'chill_evening_rnb' | 'roots_reggae' | 'gospel_sunday';
  bpm: number;
}

const NAIROBI_MATATU_MIXTAPES: MixtapeStation[] = [
  {
    id: 'westlands_express',
    sacco: 'Super Metro',
    name: 'Waiyaki Way Twilight Smooth',
    dj: 'DJ Demakufu & Urban Fishstick',
    genre: 'Afro-Soul & Kenyan Classics',
    frequency: 'FM 105.4',
    vibe: 'chill_evening_rnb',
    bpm: 94
  },
  {
    id: 'thika_rush',
    sacco: 'Matrix SACCO',
    name: 'Thika Superhighway Bass Cannon',
    dj: 'DJ Kalonje Non-Stop Express',
    genre: 'Gengetone & Amapiano Hits',
    frequency: 'FM 44.0',
    vibe: 'rush_hour_hype',
    bpm: 128
  },
  {
    id: 'rongai_roots',
    sacco: 'Embassava & Ostrich',
    name: 'Rongai One-Drop Roots Reggae',
    dj: 'King Lion Sound System',
    genre: 'Rub-a-Dub & Roots Reggae',
    frequency: 'FM 125.8',
    vibe: 'roots_reggae',
    bpm: 78
  },
  {
    id: 'jogoo_groove',
    sacco: 'City Hoppa',
    name: 'Eastlands Sunset Riddim',
    dj: 'DJ Joe Mfalme Sunset Set',
    genre: 'Dancehall & 90s Throwback',
    frequency: 'FM 58.2',
    vibe: 'chill_evening_rnb',
    bpm: 102
  }
];

export const MatatuMixtapeSoundboard: React.FC = () => {
  const { triggerAudioHorn, soundEnabled, setSoundEnabled, language } = useBooking();
  const [activeStation, setActiveStation] = useState<MixtapeStation>(NAIROBI_MATATU_MIXTAPES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bassBoost, setBassBoost] = useState<number>(75);
  const [synthesizerNotes, setSynthesizerNotes] = useState<string | null>(null);

  // Web Audio synthetic bass & matatu sound generator
  const playSynthesizedChime = (tone: 'sub_bass' | 'conductor_coin' | 'air_brake' | 'siren') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (tone === 'sub_bass') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A sub bass
        osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
        setSynthesizerNotes('🔊 35Hz Sub-Bass Boom (Pioneer 10,000W)');
      } else if (tone === 'conductor_coin') {
        // Conductor tapping coin on metal window frame (authentic Nairobi sound)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(3200, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
        setSynthesizerNotes('🪙 Ting! Ting! (Donda Akigonga Bob)');
      } else if (tone === 'air_brake') {
        // Air brake hiss
        const bufferSize = audioCtx.sampleRate * 0.4;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
        noise.stop(audioCtx.currentTime + 0.4);
        setSynthesizerNotes('💨 Psshh! (Matatu Air Brake Released)');
      } else if (tone === 'siren') {
        triggerAudioHorn();
        setSynthesizerNotes('🎺 Vuvuzela Horn Honk!');
      }

      setTimeout(() => setSynthesizerNotes(null), 2500);
    } catch (e) {
      console.warn('Audio Context interaction error:', e);
    }
  };

  return (
    <div id="matatu-mixtape-soundboard" className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 border border-teal-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5 text-teal-400" />
              <span>Nairobi Nganya Culture & Soundboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Matatu DJ Mixtape & Sound Effects Desk
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Experience the world-famous Nairobi matatu acoustic culture directly in your browser. Tap conductor coins, test sub-bass subwoofers, release air-brakes, and switch SACCO DJ radio frequencies.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-teal-500/30 rounded-2xl p-4 shrink-0 text-center min-w-[200px]">
            <div className="flex items-center justify-center gap-2 text-teal-400 mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold uppercase">{activeStation.frequency}</span>
            </div>
            <div className="text-base font-black text-white">{activeStation.sacco}</div>
            <span className="text-[11px] text-slate-400 font-mono">{activeStation.genre}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mixtape Channel Selector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-400">
              <Disc className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Nairobi Mixtape Frequencies</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">4 Stations</span>
          </div>

          <div className="space-y-2.5">
            {NAIROBI_MATATU_MIXTAPES.map(station => (
              <button
                key={station.id}
                onClick={() => {
                  setActiveStation(station);
                  setIsPlaying(true);
                  playSynthesizedChime('sub_bass');
                }}
                className={`w-full text-left p-3.5 rounded-2xl text-xs transition-all border ${
                  activeStation.id === station.id
                    ? 'bg-teal-500/20 border-teal-400 text-white font-medium shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{station.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-teal-300 border border-slate-700">
                    {station.frequency}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{station.dj}</div>
                <div className="text-[10px] text-teal-400/80 mt-1 font-mono">
                  {station.genre} • {station.bpm} BPM
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Graphic Equalizer & Subwoofer Bass Controller */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <AudioWaveform className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Equalizer & Sub-Bass</h3>
            </div>
            <span className="text-xs text-indigo-300 font-bold font-mono">{bassBoost}% Bass</span>
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="h-28 bg-slate-950 rounded-2xl p-4 flex items-end justify-between gap-1.5 border border-slate-800">
            {[45, 68, 92, 74, 55, 88, 98, 70, 85, 60, 78, 95, 50, 65].map((height, i) => (
              <div
                key={i}
                className="w-full bg-gradient-to-t from-teal-500 via-indigo-500 to-pink-500 rounded-t-sm transition-all duration-300"
                style={{
                  height: isPlaying ? `${(height * bassBoost) / 100}%` : '8%',
                  opacity: isPlaying ? 0.9 : 0.2
                }}
              />
            ))}
          </div>

          {/* Bass Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Subwoofer Gain</span>
              <span className="font-mono text-teal-400">Pioneer 10k Watts</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={bassBoost}
              onChange={e => setBassBoost(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>

          {/* Play/Pause Toggle */}
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              playSynthesizedChime('sub_bass');
            }}
            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isPlaying
                ? 'bg-teal-500 text-slate-950 shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Mixtape Simulator' : 'Play Live Mixtape Audio'}</span>
          </button>
        </div>

        {/* Matatu Cultural SFX Soundboard */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Music2 className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Interactive SFX Pads</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Real Synthetic SFX</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="sfx-coin-tap-btn"
                onClick={() => playSynthesizedChime('conductor_coin')}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all active:scale-95 group"
              >
                <div className="text-amber-400 font-bold text-xs group-hover:text-amber-300">🪙 Donda Coins</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Tapping on door frame</div>
              </button>

              <button
                id="sfx-sub-bass-btn"
                onClick={() => playSynthesizedChime('sub_bass')}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all active:scale-95 group"
              >
                <div className="text-teal-400 font-bold text-xs group-hover:text-teal-300">🔊 Sub-Bass Hit</div>
                <div className="text-[10px] text-slate-400 mt-0.5">35Hz deep thump</div>
              </button>

              <button
                id="sfx-air-brake-btn"
                onClick={() => playSynthesizedChime('air_brake')}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all active:scale-95 group"
              >
                <div className="text-indigo-400 font-bold text-xs group-hover:text-indigo-300">💨 Air Brakes</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Pneumatic brake hiss</div>
              </button>

              <button
                id="sfx-vuvuzela-horn-btn"
                onClick={() => playSynthesizedChime('siren')}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all active:scale-95 group"
              >
                <div className="text-rose-400 font-bold text-xs group-hover:text-rose-300">🎺 Fishstick Horn</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Nairobi stage trumpet</div>
              </button>
            </div>

            {synthesizerNotes && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-teal-500/40 text-xs text-teal-300 animate-in fade-in">
                {synthesizerNotes}
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 text-center font-mono pt-2">
            Urban Fishstick Synthetic Audio Engine • Web Audio API Powered
          </div>
        </div>
      </div>
    </div>
  );
};
