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
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs border text-xs font-mono transition-colors cursor-pointer ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
        }`}
        title="Toggle visible table data fields"
      >
        <Columns3 className="w-3.5 h-3.5 text-slate-500" />
        <span className="font-medium">Columns</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-xs font-bold ${
            isOpen
              ? 'bg-slate-800 text-blue-300'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {visibleCount}/{totalCount}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xs border border-slate-200 shadow-lg z-40 p-2 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              DISPLAY FIELDS
            </span>
            <div className="flex items-center gap-2 text-[10px]">
              <button
                type="button"
                onClick={onSelectAll}
                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                All
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={onReset}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-0.5 hover:underline cursor-pointer"
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
                className={`flex items-center justify-between px-2 py-1 rounded-xs transition-colors cursor-pointer select-none ${
                  col.visible ? 'bg-slate-50 hover:bg-slate-100/80' : 'hover:bg-slate-50 text-slate-400'
                }`}
              >
                <span className={`text-[11px] ${col.visible ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                  {col.label}
                  {col.required && (
                    <span className="text-[9px] text-slate-400 ml-1">(Fixed)</span>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={col.visible}
                  disabled={col.required}
                  onChange={() => onToggle(col.id)}
                  className="rounded-xs border-slate-300 text-blue-600 focus:ring-0 cursor-pointer disabled:opacity-50"
                />
              </label>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 text-center">
            {visibleCount} of {totalCount} columns active
          </div>
        </div>
      )}
    </div>
  );
};
