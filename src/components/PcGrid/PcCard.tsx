// src/components/PcGrid/PcCard.tsx
import React from 'react';
import { Pc, PcStatus } from '../../types/Pc';
import { Monitor, FileText, ShoppingCart, User, Power, Wrench, CheckCircle } from 'lucide-react';

// Import shadcn/ui Tooltip components - Adjust path if your alias is different
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface PcCardProps {
  pc: Pc;
  isSelected: boolean;
  onClick: (pc: Pc) => void;
}

// Helper function (getStatusInfo) remains the SAME as the previous Radix version
const getStatusInfo = (status: PcStatus): {
  iconColor: string;
  dotColor: string;
  bgColor: string;
  statusText: string;
  statusIcon: React.ReactNode;
} => {
  switch (status) {
    case PcStatus.IN_USE:
      return { iconColor: 'text-blue-600', dotColor: 'bg-blue-500', bgColor: 'bg-blue-100', statusText: 'In Use', statusIcon: <User size={14} className="mr-1 text-blue-600" /> };
    case PcStatus.AVAILABLE:
      return { iconColor: 'text-green-600', dotColor: 'bg-green-500', bgColor: 'bg-green-100', statusText: 'Available', statusIcon: <CheckCircle size={14} className="mr-1 text-green-600" /> };
    case PcStatus.OFFLINE:
      return { iconColor: 'text-gray-500', dotColor: 'bg-gray-400', bgColor: 'bg-gray-100', statusText: 'Offline', statusIcon: <Power size={14} className="mr-1 text-gray-500" /> };
    case PcStatus.MAINTENANCE:
      return { iconColor: 'text-yellow-600', dotColor: 'bg-yellow-500', bgColor: 'bg-yellow-100', statusText: 'Maintenance', statusIcon: <Wrench size={14} className="mr-1 text-yellow-600" /> };
    default:
      return { iconColor: 'text-gray-400', dotColor: 'bg-gray-300', bgColor: 'bg-gray-50', statusText: 'Unknown', statusIcon: <Power size={14} className="mr-1 text-gray-400" /> };
  }
};


const PcCard: React.FC<PcCardProps> = ({ pc, isSelected, onClick }) => {
  const statusInfo = getStatusInfo(pc.status);

  return (
    <TooltipProvider delayDuration={200}>0808
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Main clickable and focusable element - Structure remains the same */}
          <div
            className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-all duration-150 focus:outline-none `}
            onClick={() => onClick(pc)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(pc);
              }
            }}
            role="button"
            aria-pressed={isSelected}
            tabIndex={0}
            aria-label={`PC ${pc.pc_name}, Status: ${statusInfo.statusText}`}
          >
            {/* Icon container - Structure remains the same */}
            <div className={`relative rounded-full p-3 flex items-center justify-center ${statusInfo.bgColor}`}>
              <Monitor className={`h-6 w-6 sm:h-7 sm:w-7 ${statusInfo.iconColor}`} />
              <div
                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white ${statusInfo.dotColor}`}
                title={`Status: ${statusInfo.statusText}`}
              />
            </div>
            {/* PC Name - Structure remains the same */}
            <span className="mt-1.5 text-xs sm:text-sm font-medium text-gray-700 text-center truncate w-full px-1">
              {pc.pc_name}
            </span>
          </div>
        </TooltipTrigger>

        {/* Tooltip Content - Uses shadcn/ui component which handles styling */}
        <TooltipContent side="top"> {/* shadcn/ui handles styling via its CSS */}
          <div className="flex flex-col space-y-1 text-xs"> {/* Adjust text size if needed */}
            <p className="font-semibold text-sm">{pc.pc_name}</p>
            <div className="flex items-center">
              {statusInfo.statusIcon}
              <span>{statusInfo.statusText}</span>
            </div>
            {pc.status === PcStatus.IN_USE && (
              <div className="flex items-center">
                <User size={14} className="mr-1" />
                <span>{pc.current_member_account || 'Loading user...'}</span>
              </div>
            )}
            {pc.time_left && pc.status === PcStatus.IN_USE && (
              <p className="text-xs text-muted-foreground">Time Left: {pc.time_left}</p>
                 )}
            {pc.has_notes && (
              <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                <FileText size={14} className="mr-1" />
                <span>Has Active Notes</span>
              </div>
            )}
            {pc.has_active_tab && (
              <div className="flex items-center text-purple-500 dark:text-purple-400">
                <ShoppingCart size={14} className="mr-1" />
                <span>Has Active Tab</span>
              </div>
            )}
          </div>
          {/* Tooltip.Arrow is usually implicitly handled or styled within shadcn/ui TooltipContent */}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PcCard;