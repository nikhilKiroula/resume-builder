import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Collapsible section wrapper for the editor left panel.
 */
const EditorSection = ({ title, icon: Icon, children, defaultOpen = false, badge }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
          {badge !== undefined && (
            <span className="badge badge-blue text-xs">{badge}</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 bg-white dark:bg-slate-900 animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
};

export default EditorSection;
