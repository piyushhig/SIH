import React from 'react';
import { X, ShieldAlert, Sliders, RefreshCw, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetFilters: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Platform & Demo Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Demonstration Environment Active</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            This prototype demonstrates the enterprise decision-support interface for senior
            government secretariats and infrastructure evaluation committees.
            All project names and numbers are synthetic test cases.
          </p>
        </div>

        {/* Configuration settings */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Active Predictive Model Configuration:
            </label>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
              <div>Algorithm: Gradient Boosted Delay Classifier (v2.4-SIM)</div>
              <div>Sensitivity Threshold: 0.65 Probability cutoff</div>
              <div>Evaluation Window: Rolling 90-day horizon</div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              State Revenue Department Jurisdictions:
            </label>
            <p className="text-slate-600 text-[11px]">
              Pre-configured for Maharashtra (RFCTLARR Act), Gujarat (NH Act / RFCTLARR), Karnataka (KIADB Act), and Tamil Nadu (Industrial Land Acquisition Act).
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
