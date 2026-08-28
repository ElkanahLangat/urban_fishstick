import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  Compass, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  HeartHandshake, 
  Smile, 
  Search,
  Volume2,
  Bus
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { NAIROBI_HAZARDS, COMMUTE_BENEFITS, HazardZone } from '../data/nairobiRoutes';
import { SHENG_DICTIONARY, ShengEntry } from '../utils/shengDict';

export const SafetyRadar: React.FC = () => {
  const { language, triggerAudioHorn } = useBooking();
  const [activeTab, setActiveTab] = useState<'safety' | 'cooperation' | 'adventure' | 'dictionary'>('safety');
  const [shengSearch, setShengSearch] = useState<string>('');

  const filteredSheng = SHENG_DICTIONARY.filter(item =>
    item.sheng.toLowerCase().includes(shengSearch.toLowerCase()) ||
    item.english.toLowerCase().includes(shengSearch.toLowerCase()) ||
    item.context.toLowerCase().includes(shengSearch.toLowerCase())
  );

  return (
    <div id="safety-radar-guide-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {language === 'sheng' ? 'Rada ya Usalama & Adventure za Kanairo' : 'Nairobi Safety Radar & Adventure Guide'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'sheng' ? 'Kaa rada na vitongoji vyote, okoa muda na ufurahie safari' : 'City hazard intelligence, time-saving cooperation, & Nairobi commuter culture'}
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'safety' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ {language === 'sheng' ? 'Rada ya Mtaa' : 'Hazard Radar'}
          </button>
          <button
            onClick={() => setActiveTab('cooperation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cooperation' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏱️ {language === 'sheng' ? 'Kwanini Uokoe Muda?' : 'Save Time & Cooperate'}
          </button>
          <button
            onClick={() => setActiveTab('adventure')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'adventure' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎨 {language === 'sheng' ? 'Matatu Culture & Adventure' : 'The Great Adventure'}
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dictionary' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📖 Sheng Lexicon
          </button>
        </div>
      </div>

      {/* Content based on Tab */}
      <div className="mt-5">
        {/* 1. Safety & Danger Zones */}
        {activeTab === 'safety' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-200">
                <strong className="text-white font-bold block mb-1">
                  {language === 'sheng' ? 'Kaa Macho Kanairo (Nairobi Commuter Caution):' : 'Nairobi Urban Safety Guidelines:'}
                </strong>
                <p className="leading-relaxed">
                  {language === 'sheng'
                    ? 'Jiji letu ni safi na lina adventure kubwa, lakini ni muhimu kujua sehemu za kuwa makini kama vile River Road, footbridges za Thika Road na nyakati za mvua. Kutumia app yetu inakuondolea misururu ya giza na kukuhakikishia usalama.'
                    : 'Nairobi is vibrant and exhilarating, but being vigilant across high-density stages, night footbridges, and during sudden rainstorms keeps you safe. Pre-booking eliminates standing in dark, unmonitored queues.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NAIROBI_HAZARDS.map(hazard => (
                <div
                  key={hazard.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{hazard.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        hazard.riskLevel === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {hazard.riskType.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-2 italic">
                      "{language === 'sheng' ? hazard.shengWarning : hazard.englishAdvice}"
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">Safe Route:</span> {hazard.safeAlternative}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Why Save Time & Cooperate */}
        {activeTab === 'cooperation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COMMUTE_BENEFITS.map((benefit, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 text-center">
                  <span className="text-2xl font-black text-emerald-400 block mb-1">{benefit.metric}</span>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {language === 'sheng' ? benefit.shengLabel : benefit.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                {language === 'sheng' ? 'Kwanini Ushirikiano wa Abiria na Makanga Ni Muhimu?' : 'The Power of Seamless Cooperation'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'sheng'
                  ? 'Matatu ni damu ya uchumi wa Nairobi. Tunapobook tukiwa ofisini, makanga anajua idadi kamili ya viti, gari haizunguki bure ikichoma mafuta, na hakuna msukumano kwa milango. Ukichelewa, mfumo wetu wa automated refund unakurudishia bob zako papo hapo bila kubishana.'
                  : 'Matatus are the heartbeat of Nairobi commerce. When commuters book in advance from the office, conductors know precise seat occupancy, vehicles avoid idling in traffic to fill up, and dangerous door scrambles are eliminated. If a meeting delays you, our automated refund ensures zero financial loss.'}
              </p>
            </div>
          </div>
        )}

        {/* 3. The Great Adventure & Culture */}
        {activeTab === 'adventure' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-amber-500/30">
              <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {language === 'sheng' ? 'Matatu Culture: Sanaa, Mziki na Furaha ya Jiji' : 'Nairobi Matatu Culture: The World’s Greatest Urban Commute'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {language === 'sheng'
                  ? 'Nganya za Nairobi siyo magari tu ya kusafiri—ni canvas ya wasanii, studio ya mziki wa Gengetone na Afrobeats, na alama ya umoja wetu. Kuanzia Route 125 ya Rongai yenye ma-screen ya 4K hadi Super Metro ya Waiyaki Way inayojulikana kwa ustaarabu, kila safari ni adventure.'
                  : 'Nairobi matatus are more than transit—they are moving art galleries, bespoke sound lounges, and dynamic hubs of Kenyan youth culture. From Rongai’s high-tech bass beasts to Super Metro’s legendary punctual discipline, your daily commute is an authentic urban adventure.'}
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerAudioHorn}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Sound Matatu Horn ("Pee-Peee!")</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Sheng Lexicon & Slang Explorer */}
        {activeTab === 'dictionary' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={shengSearch}
                  onChange={(e) => setShengSearch(e.target.value)}
                  placeholder="Tafuta neno la Sheng (Search slang e.g., Nishushe, Nganya, Chapaa)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredSheng.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-amber-400 font-bold text-sm">{entry.sheng}</strong>
                    <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 text-[10px] rounded uppercase font-semibold">
                      {entry.category}
                    </span>
                  </div>
                  <p className="text-white font-medium mb-1">{entry.english}</p>
                  <p className="text-[11px] text-slate-400 italic mb-2">Swahili: {entry.swahili}</p>
                  <p className="text-[10px] text-emerald-400/90 font-mono bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                    "{entry.example}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
