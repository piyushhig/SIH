import React, { useState, useRef, useEffect } from 'react';
import { Columns3, Check, RotateCcw } from 'lucide-react';

export interface ColumnDefinition {
  id: string;
  label: string;
  visible: boolean;
  required?: boolean; // If true, cannot be untoggled
}

interface ColumnToggleMenuProps {
  columns: ColumnDefinition[];
  onToggle: (id: string) => void;
  onReset: () => void;
  onSelectAll: () => void;
}

export const ColumnToggleMenu: React.FC<ColumnToggleMenuProps> = ({
  columns,
  onToggle,
  onReset,
  onSelectAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const visibleCount = columns.filter((c) => c.visible).length;
  const totalCount = columns.length;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-colors cursor-pointer ${
          isOpen
            ? 'bg-slate-800 text-white border-slate-600'
            : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white shadow-xs'
        }`}
        title="Toggle visible table data fields"
      >
        <Columns3 className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-medium">Columns</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
            isOpen
              ? 'bg-slate-700 text-blue-300'
              : 'bg-slate-950 text-slate-400 border border-slate-800'
          }`}
        >
          {visibleCount}/{totalCount}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 rounded-lg border border-slate-700 shadow-xl z-40 p-2.5 font-mono text-xs text-slate-200 backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              DISPLAY FIELDS
            </span>
            <div className="flex items-center gap-2 text-[10px]">
              <button
                type="button"
                onClick={onSelectAll}
                className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                All
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={onReset}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {columns.map((col) => (
              <label
                key={col.id}
                className={`flex items-center justify-between px-2 py-1 rounded transition-colors cursor-pointer select-none ${
                  col.visible ? 'bg-slate-800/80 hover:bg-slate-800' : 'hover:bg-slate-800/40 text-slate-500'
                }`}
              >
                <span className={`text-[11px] ${col.visible ? 'text-white font-medium' : 'text-slate-400'}`}>
                  {col.label}
                  {col.required && (
                    <span className="text-[9px] text-slate-500 ml-1">(Fixed)</span>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={col.visible}
                  disabled={col.required}
                  onChange={() => onToggle(col.id)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer disabled:opacity-50"
                />
              </label>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center">
            {visibleCount} of {totalCount} columns active
          </div>
        </div>
      )}
    </div>
  );
};
