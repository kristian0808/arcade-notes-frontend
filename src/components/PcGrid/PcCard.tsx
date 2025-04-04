import React from 'react';
import { Pc, PcStatus } from '../../types/Pc';
import './PcCard.css';

interface PcCardProps {
  pc: Pc;
  isSelected: boolean;
  onClick: () => void;
}

const PcCard: React.FC<PcCardProps> = ({ pc, isSelected, onClick }) => {
  // Get status text
  const getStatusText = () => {
    switch (pc.status) {
      case PcStatus.IN_USE:
        return 'In Use';
      case PcStatus.AVAILABLE:
        return 'Available';
      case PcStatus.OFFLINE:
        return 'Offline';
      case PcStatus.MAINTENANCE:
        return 'Maintenance';
      default:
        return pc.status;
    }
  };

  return (
    <div 
      className={`pc-card ${pc.status} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="pc-name">{pc.pc_name}</div>
      
      {pc.status === PcStatus.IN_USE && pc.current_member_account && (
        <div className="pc-user-info">
          <div className="pc-user">{pc.current_member_account}</div>
          {pc.time_left && <div className="pc-time-left">{pc.time_left}</div>}
        </div>
      )}
      
      {/* Display status text for non-'in-use' states */}
      {pc.status !== PcStatus.IN_USE && (
        <div className="pc-status-text-display">{getStatusText()}</div>
      )}
      
      <div className="pc-indicators">
        {pc.has_notes && (
          <div className="pc-has-notes" title="Has active notes">
            📝
          </div>
        )}
        {pc.has_active_tab && (
          <div className="pc-has-tab" title="Has active tab">
            🛒
          </div>
        )}
      </div>
    </div>
  );
};

export default PcCard;
