import React from 'react';
import { 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Coins
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const RefundHistoryCard: React.FC = () => {
  const { refundHistory, language } = useBooking();

  return (
    <div id="refund-history-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {language === 'sheng' ? 'Historia ya Auto-Refund (M-Pesa)' : 'Office Delay Auto-Refund Ledger'}
            </h3>
            <p className="text-[11px] text-slate-400">
              100% money-back records if you are delayed in the office
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
        {refundHistory.map(item => (
          <div
            key={item.id}
            className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{item.vehicleName}</span>
                <span className="text-[10px] font-mono text-slate-500">{item.bookingId}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.reason}</p>
              <span className="text-[10px] text-slate-500">{item.timestamp}</span>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-emerald-400 text-sm">
                +KES {item.amountKes}
              </span>
              <span className="block text-[9px] uppercase font-bold text-emerald-500/90">
                ✓ Credited to M-Pesa
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
