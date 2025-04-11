// src/components/PcGrid/PcCard.tsx
import React from 'react';
import { Pc, PcStatus } from '../../types/Pc';
import { FileText, ShoppingCart } from 'lucide-react'; // Use icons

interface PcCardProps {
  pc: Pc;
  isSelected: boolean;
  onClick: (pc: Pc) => void; // Use the existing onClick handler type
}

const PcCard: React.FC<PcCardProps> = ({ pc, isSelected, onClick }) => {
  // Tailwind classes based on status
  const getStatusClasses = (status: PcStatus): { bg: string; border: string; dot: string; text: string } => {
    switch (status) {
      case PcStatus.IN_USE:
        return { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', text: 'text-blue-800' };
      case PcStatus.AVAILABLE:
        return { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', text: 'text-green-800' };
      case PcStatus.OFFLINE:
        return { bg: 'bg-gray-100', border: 'border-gray-300', dot: 'bg-gray-400', text: 'text-gray-600' };
      case PcStatus.MAINTENANCE:
        return { bg: 'bg-yellow-50', border: 'border-yellow-300', dot: 'bg-yellow-500', text: 'text-yellow-800' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400', text: 'text-gray-500' };
    }
  };

  const statusClasses = getStatusClasses(pc.status);

  return (
    <div
      className={`rounded-lg border ${statusClasses.border} ${statusClasses.bg} shadow-sm overflow-hidden cursor-pointer focus:outline-none transition-transform duration-150 hover:shadow-md hover:-translate-y-0.5 ${isSelected ? 'outline outline-2 outline-blue-500' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(pc);
      }}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(pc);
        }
      }}
    >
      <div className="p-3">
        {/* Header: Status Dot, Name, Icons */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0"> {/* Ensure name doesn't overflow */}
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusClasses.dot}`}></div>
            <h3 className={`font-semibold text-sm truncate ${statusClasses.text}`}>{pc.pc_name}</h3>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            {pc.has_notes && (
              <div className="text-yellow-600 hover:text-yellow-700" title="Has active notes">
                <FileText size={14} strokeWidth={2.5}/>
              </div>
            )}
            {pc.has_active_tab && (
              <div className="text-blue-600 hover:text-blue-700" title="Has active tab/order">
                <ShoppingCart size={14} strokeWidth={2.5}/>
              </div>
            )}
          </div>
        </div>

        {/* Body: User Info or Status Text */}
        <div className="h-8 flex items-center"> {/* Fixed height for consistency */}
          {pc.status === PcStatus.IN_USE && pc.current_member_account ? (
            <div className={`text-xs ${statusClasses.text} min-w-0`}>
              <div className="font-medium truncate">{pc.current_member_account}</div>
              {pc.time_left && <div className="opacity-80">{pc.time_left} left</div>}
            </div>
          ) : (
            <div className={`text-xs italic ${statusClasses.text} capitalize`}>
              {pc.status.replace('_', ' ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PcCard;
