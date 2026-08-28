import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  AlertTriangle, 
  Navigation, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Maximize2,
  Volume2,
  Radio,
  Sparkles,
  Search,
  Crosshair
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { NAIROBI_STAGES, NAIROBI_HAZARDS, Stage, HazardZone, MatatuVehicle } from '../data/nairobiRoutes';

export const NairobiLiveMap: React.FC = () => {
  const { 
    vehicles, 
    selectedVehicle, 
    setSelectedVehicle, 
    selectedPickupStage, 
    setSelectedPickupStage,
    language,
    triggerAudioHorn
  } = useBooking();

  const [selectedHazard, setSelectedHazard] = useState<HazardZone | null>(null);
  const [selectedStageDetail, setSelectedStageDetail] = useState<Stage | null>(null);
  const [showTrafficLayer, setShowTrafficLayer] = useState<boolean>(true);
  const [showHazardRadar, setShowHazardRadar] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'cbd' | 'suburbs'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Convert Nairobi GPS coordinates to SVG coordinate space
  // Bounding box: Lat [-1.41 to -1.18], Lng [36.64 to 36.95]
  const minLat = -1.41;
  const maxLat = -1.18;
  const minLng = 36.64;
  const maxLng = 36.95;

  const projectToMap = (lat: number, lng: number): { x: number; y: number } => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 840;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 540;
    return { x, y };
  };

  const filteredStages = NAIROBI_STAGES.filter(stage => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        stage.name.toLowerCase().includes(q) ||
        stage.shengName.toLowerCase().includes(q) ||
        stage.zone.toLowerCase().includes(q)
      );
    }
    if (activeFilter === 'cbd') return stage.type === 'cbd_hub';
    if (activeFilter === 'suburbs') return stage.type === 'suburb_terminal';
    return true;
  });

  return (
    <div id="nairobi-map-container" className="relative w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Map Control Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Live GPS Telemetry Indicator */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{language === 'sheng' ? 'Live Nairobi GPS Radar' : 'Live Nairobi Transit GPS Radar'}</span>
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            {vehicles.length} Nganyas Active
          </span>
        </div>

        {/* Filter & Action Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-lg pointer-events-auto">
          {/* Stage Filters */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            <button
              id="filter-all-stages-btn"
              onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'all' && !searchQuery
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'sheng' ? 'Zote' : 'All'}
            </button>
            <button
              id="filter-cbd-stages-btn"
              onClick={() => { setActiveFilter('cbd'); setSearchQuery(''); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'cbd' && !searchQuery
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CBD Hubs
            </button>
            <button
              id="filter-suburb-stages-btn"
              onClick={() => { setActiveFilter('suburbs'); setSearchQuery(''); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'suburbs' && !searchQuery
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Suburbs
            </button>
          </div>

          <span className="text-slate-700 mx-0.5">|</span>

          {/* Traffic Toggle */}
          <button
            id="toggle-traffic-layer-btn"
            onClick={() => setShowTrafficLayer(!showTrafficLayer)}
            title="Toggle Traffic Speed Radar"
            className={`p-2 rounded-xl text-xs transition-all ${
              showTrafficLayer
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Hazard Radar Toggle */}
          <button
            id="toggle-hazard-radar-btn"
            onClick={() => setShowHazardRadar(!showHazardRadar)}
            title="Toggle Safety Danger Zones"
            className={`p-2 rounded-xl text-xs transition-all ${
              showHazardRadar
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Reset Zoom / Center */}
          <button
            onClick={() => setZoomLevel(prev => (prev === 1 ? 1.25 : 1))}
            title="Toggle Radar Zoom"
            className={`p-2 rounded-xl text-xs transition-all ${
              zoomLevel > 1 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Horn Sound Button */}
          <button
            id="map-play-horn-btn"
            onClick={triggerAudioHorn}
            title="Sound Matatu Horn (Vuvuzela)"
            className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition-all shadow"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Vector Radar Canvas */}
      <div className="relative w-full h-[480px] sm:h-[540px] overflow-hidden select-none bg-slate-950">
        <svg 
          viewBox="0 0 840 540" 
          className="w-full h-full object-cover transition-transform duration-500 cursor-crosshair"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Grid background */}
            <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.3)" strokeWidth="0.8" />
            </pattern>

            {/* Glowing CBD Hub Center */}
            <radialGradient id="nairobi-cbd-pulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>

            {/* Route Highway Gradients */}
            <linearGradient id="waiyaki-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="thika-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="rongai-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
            <linearGradient id="jogoo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <linearGradient id="mombasa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Canvas Background & Grid */}
          <rect width="840" height="540" fill="#030712" />
          <rect width="840" height="540" fill="url(#radar-grid)" />

          {/* Concentric Radar Sweeps */}
          <circle cx="495" cy="245" r="80" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="495" cy="245" r="160" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="495" cy="245" r="260" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1" strokeDasharray="8 8" />
          <circle cx="495" cy="245" r="120" fill="url(#nairobi-cbd-pulse)" />

          {/* Major Nairobi Arteries */}
          <g id="nairobi-arteries" strokeLinecap="round" strokeLinejoin="round">
            {/* Route 105: Waiyaki Way (CBD -> Westlands -> Kangemi -> Uthiru -> Kikuyu) */}
            <path 
              d="M 495 245 L 450 225 L 360 195 L 230 170 L 80 160" 
              fill="none" 
              stroke="url(#waiyaki-grad)" 
              strokeWidth={showTrafficLayer ? "6" : "4"} 
              strokeOpacity="0.85"
            />
            {/* Route 44/45: Thika Superhighway (CBD -> Ngara -> Roysambu -> Kasarani -> Kahawa Sukari) */}
            <path 
              d="M 500 240 L 540 200 L 610 140 L 710 80 L 780 40" 
              fill="none" 
              stroke="url(#thika-grad)" 
              strokeWidth={showTrafficLayer ? "7" : "5"} 
              strokeOpacity="0.85"
            />
            {/* Route 125/126: Langata & Magadi Road (CBD -> Strathmore -> Galleria -> Rongai -> Kiserian) */}
            <path 
              d="M 505 255 L 470 300 L 420 360 L 350 440 L 325 500" 
              fill="none" 
              stroke="url(#rongai-grad)" 
              strokeWidth={showTrafficLayer ? "6" : "4"} 
              strokeOpacity="0.85"
            />
            {/* Route 58: Jogoo Road / Eastlands (CBD -> City Stadium -> Donholm -> Buruburu) */}
            <path 
              d="M 505 250 L 570 260 L 630 250 L 690 245 L 740 245" 
              fill="none" 
              stroke="url(#jogoo-grad)" 
              strokeWidth={showTrafficLayer ? "5" : "3.5"} 
              strokeOpacity="0.8"
            />
            {/* Route 33/34: Mombasa Road / Embakasi (CBD -> South B -> Bellevue -> Cabanas -> Airport) */}
            <path 
              d="M 505 255 L 550 300 L 610 340 L 690 380 L 770 410" 
              fill="none" 
              stroke="url(#mombasa-grad)" 
              strokeWidth={showTrafficLayer ? "7" : "4.5"} 
              strokeOpacity="0.8"
            />
          </g>

          {/* Traffic Jams & Corridors Layer */}
          {showTrafficLayer && (
            <g id="traffic-radar-glow">
              {/* Westlands Roundabout jam indicator */}
              <circle cx="450" cy="225" r="16" fill="#EF4444" fillOpacity="0.25" className="animate-pulse" />
              <text x="450" y="212" textAnchor="middle" fill="#FCA5A5" fontSize="7" fontWeight="bold">Slow (18 km/h)</text>

              {/* Ngara / Globe Roundabout jam */}
              <circle cx="540" cy="200" r="18" fill="#F59E0B" fillOpacity="0.25" className="animate-pulse" />
              <text x="540" y="188" textAnchor="middle" fill="#FDE68A" fontSize="7" fontWeight="bold">Moderate (32 km/h)</text>
            </g>
          )}

          {/* Hazard Zones Radar */}
          {showHazardRadar && NAIROBI_HAZARDS.map(hazard => {
            const pos = projectToMap(hazard.lat, hazard.lng);
            return (
              <g
                key={hazard.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  setSelectedHazard(hazard);
                  setSelectedStageDetail(null);
                }}
                className="cursor-pointer group"
              >
                <circle r="14" fill="#F43F5E" fillOpacity="0.25" className="animate-ping" />
                <circle r="8" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="black">!</text>
                <text 
                  x="0" 
                  y="18" 
                  textAnchor="middle" 
                  fill="#FDA4AF" 
                  fontSize="7.5" 
                  fontWeight="bold"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {hazard.name.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Stage Pins */}
          {filteredStages.map(stage => {
            const pos = projectToMap(stage.lat, stage.lng);
            const isSelected = selectedPickupStage?.id === stage.id;
            const isCbd = stage.type === 'cbd_hub';

            return (
              <g
                key={stage.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  setSelectedStageDetail(stage);
                  setSelectedPickupStage(stage);
                  setSelectedHazard(null);
                }}
                className="cursor-pointer group"
              >
                {isSelected && (
                  <circle r="18" fill="#10B981" fillOpacity="0.3" className="animate-ping" />
                )}
                <circle 
                  r={isCbd ? 7 : 5} 
                  fill={isSelected ? '#10B981' : isCbd ? '#38BDF8' : '#64748B'} 
                  stroke="#0F172A" 
                  strokeWidth="2" 
                />
                <text 
                  x="9" 
                  y="3" 
                  fill={isSelected ? '#34D399' : isCbd ? '#F8FAFC' : '#94A3B8'} 
                  fontSize={isCbd ? "10" : "8"}
                  fontWeight={isCbd ? "bold" : "normal"}
                  className="select-none"
                >
                  {stage.name.split('(')[0]}
                </text>
              </g>
            );
          })}

          {/* Live Matatus (Nganyas) Real-Time Positions */}
          {vehicles.map(matatu => {
            const pos = projectToMap(matatu.currentLat, matatu.currentLng);
            const isSelected = selectedVehicle?.id === matatu.id;

            return (
              <g
                key={matatu.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  setSelectedVehicle(matatu);
                  setSelectedStageDetail(null);
                  setSelectedHazard(null);
                  triggerAudioHorn();
                }}
                className="cursor-pointer transition-transform duration-700 ease-out group"
              >
                {isSelected && (
                  <circle r="22" fill={matatu.colorHex} fillOpacity="0.35" className="animate-ping" />
                )}

                {/* Matatu Bus Body */}
                <rect 
                  x="-14" 
                  y="-9" 
                  width="28" 
                  height="18" 
                  rx="5" 
                  fill={matatu.colorHex} 
                  stroke="#FFFFFF" 
                  strokeWidth={isSelected ? '2.5' : '1.2'} 
                  className="filter drop-shadow-md"
                />

                {/* Windshield */}
                <rect x="-12" y="-7" width="7" height="14" rx="2" fill="#0F172A" />

                {/* Headlights */}
                <circle cx="-13" cy="-5" r="1.5" fill="#FEF08A" />
                <circle cx="-13" cy="5" r="1.5" fill="#FEF08A" />

                {/* Name Label */}
                <text 
                  x="0" 
                  y="-13" 
                  textAnchor="middle" 
                  fill="#FFFFFF" 
                  fontSize="8" 
                  fontWeight="black"
                  className="filter drop-shadow"
                >
                  {matatu.name.split(' ')[0]} ({matatu.speedKmh}k/h)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Stage Detail Card */}
        {selectedStageDetail && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-30 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedStageDetail.name}</h4>
                  <p className="text-xs text-emerald-400 font-medium">{selectedStageDetail.shengName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStageDetail(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
              {selectedStageDetail.safetyTip}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Zone: <strong className="text-white">{selectedStageDetail.zone}</strong>
              </span>
              <button
                onClick={() => {
                  setSelectedPickupStage(selectedStageDetail);
                  setSelectedStageDetail(null);
                }}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow"
              >
                Pick This Stage
              </button>
            </div>
          </div>
        )}

        {/* Floating Hazard Detail Card */}
        {selectedHazard && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-slate-900/95 border border-rose-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-30 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedHazard.name}</h4>
                  <span className="text-xs text-rose-400 uppercase font-semibold">
                    Risk Level: {selectedHazard.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedHazard(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-200 leading-relaxed">
              <p>{language === 'sheng' ? selectedHazard.shengWarning : selectedHazard.englishAdvice}</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Waiyaki Way (Route 105)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Thika Superhighway (Route 44)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
            <span>Langata / Rongai (Route 125)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Mombasa Road (Route 33)</span>
          </div>
        </div>

        <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
          <span>● Live GPS Feed Online</span>
        </div>
      </div>
    </div>
  );
};
