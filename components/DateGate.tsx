
import React, { useState } from 'react';
import { AccessLevel, DATE_GATE_USER, DATE_GATE_ADMIN } from '../types';
import { Heart, ArrowRight, AlertCircle } from 'lucide-react';

interface DateGateProps {
  onUnlock: (level: AccessLevel) => void;
}

const DateGate: React.FC<DateGateProps> = ({ onUnlock }) => {
  const [dateInput, setDateInput] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError('');

    // Artificial delay for dramatic effect
    setTimeout(() => {
      if (dateInput === DATE_GATE_USER) {
        onUnlock(AccessLevel.USER);
      } else if (dateInput === DATE_GATE_ADMIN) {
        onUnlock(AccessLevel.ADMIN);
      } else {
        setError("Mali love, try mo ulit.");
        setIsChecking(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-love-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-love-100 text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-3 bg-love-100 rounded-full text-love-600 animate-pulse">
            <Heart size={32} fill="currentColor" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-medium text-slate-800 mb-2">
          Hi Love, kailan naging tayo?
        </h1>
        <p className="text-slate-500 mb-8 text-sm">
          Input mo yung date kung kailan mo ko sinagot.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="date"
              required
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-love-400 text-center text-slate-700 font-mono"
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-love-600 text-sm animate-shake-hard">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isChecking || !dateInput}
            className="w-full py-3 bg-love-600 hover:bg-love-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? 'Checking...' : 'Unlock'}
            {!isChecking && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DateGate;
