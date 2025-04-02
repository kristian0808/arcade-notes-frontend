import React from 'react';
import { Member } from '../../types/Member';
import './MemberCard.css';

interface MemberCardProps {
  member: Member;
  isSelected: boolean;
  onClick: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, isSelected, onClick }) => {
  // Format name based on available fields
  const getDisplayName = () => {
    if (member.member_first_name || member.member_last_name) {
      return `${member.member_first_name || ''} ${member.member_last_name || ''}`.trim();
    }
    return member.member_account;
  };

  // Get first letter for avatar
  const getAvatarText = () => {
    return getDisplayName().charAt(0).toUpperCase();
  };

  return (
    <div 
      className={`member-card ${isSelected ? 'selected' : ''} ${member.member_is_active !== 1 ? 'inactive' : ''}`}
      onClick={onClick}
    >
      <div className="member-avatar">
        {getAvatarText()}
      </div>
      
      <div className="member-info">
        <div className="member-name">{getDisplayName()}</div>
        <div className="member-account">@{member.member_account}</div>
        
        {member.member_balance && (
          <div className="member-balance">
            {member.member_balance}
          </div>
        )}
      </div>
      
      <div className="member-status-text">
        {member.member_is_active === 1 ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
};

export default MemberCard;
