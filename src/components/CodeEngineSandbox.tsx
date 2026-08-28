import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Play, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Copy, 
  FileCode, 
  Sparkles,
  Layers
} from 'lucide-react';
import { CODE_ENGINES, CodeSnippet } from '../data/simulatedCodeEngines';
import { useBooking } from '../context/BookingContext';

export const CodeEngineSandbox: React.FC = () => {
  const { language } = useBooking();
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(CODE_ENGINES[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string>(selectedSnippet.simulatedOutput);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRun = () => {
    setIsRunning(true);
    setConsoleOutput('Compiling & Executing code in high-performance sandbox...');
    
    setTimeout(() => {
      setConsoleOutput(selectedSnippet.simulatedOutput);
      setIsRunning(false);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="code-engine-sandbox-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wide">
                C++20 & Python 3.12 Core
              </span>
              <span className="text-xs text-slate-400 font-mono">Real-Time Routing & Safety Engine</span>
            </div>
            <h2 className="text-lg font-black text-white">
              {language === 'sheng' ? 'Engine ya C++ & Python (Algorithm Sandbox)' : 'High-Performance C++ & Python Engine'}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="run-code-engine-btn"
            disabled={isRunning}
            onClick={handleRun}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing...' : 'Run Engine'}</span>
          </button>
        </div>
      </div>

      {/* Code Selector Tabs */}
      <div className="my-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CODE_ENGINES.map(snip => (
          <button
            key={snip.id}
            id={`tab-snippet-${snip.id}`}
            onClick={() => {
              setSelectedSnippet(snip);
              setConsoleOutput(snip.simulatedOutput);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 ${
              selectedSnippet.id === snip.id
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40 shadow'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{snip.filename}</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase ${
              snip.language === 'cpp' ? 'bg-blue-500/20 text-blue-300' : snip.language === 'python' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {snip.language}
            </span>
          </button>
        ))}
      </div>

      {/* Snippet Description */}
      <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl mb-4 text-xs text-slate-300 flex items-center justify-between">
        <div>
          <strong className="text-white block mb-0.5">{selectedSnippet.title}</strong>
          <p className="text-slate-400">
            {language === 'sheng' ? selectedSnippet.shengDescription : selectedSnippet.description}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-all"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Editor Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs shadow-inner">
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="ml-2 text-slate-300">{selectedSnippet.filename}</span>
          </div>
          <span>Execution Latency: &lt;{selectedSnippet.executionTimeMs} ms</span>
        </div>

        <pre className="p-4 text-slate-300 overflow-x-auto max-h-72 leading-relaxed text-[11.5px] no-scrollbar">
          <code>{selectedSnippet.code}</code>
        </pre>
      </div>

      {/* Console Output Terminal */}
      <div className="mt-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 text-[11px] pb-2 mb-2 border-b border-slate-800">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">Standard Output Terminal (Live Benchmark)</span>
        </div>
        <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed text-[11px]">
          {consoleOutput}
        </pre>
      </div>
    </div>
  );
};
