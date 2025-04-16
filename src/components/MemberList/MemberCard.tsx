// src/components/MemberList/MemberCard.tsx
import React from 'react';
import { Member } from '../../types/Member';
import { CheckCircle, XCircle } from 'lucide-react'; // Icons for status

interface MemberCardProps {
  member: Member;
  isSelected: boolean;
  onClick: (member: Member) => void; // Use existing handler type
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
    const name = getDisplayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const isActive = member.member_is_active === 1;

  return (
    <div
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-150 ${isSelected ? 'bg-indigo-100 ring-1 ring-indigo-200' : 'hover:bg-gray-100'} ${!isActive ? 'opacity-70' : ''}`}
      onClick={() => onClick(member)}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(member)}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-sm font-medium ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-400 text-white'}`}>
        {getAvatarText()}
      </div>

      {/* Member Info */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{getDisplayName()}</p>
        <p className="text-xs text-gray-500 truncate">@{member.member_account}</p>
        {member.member_balance && (
          <div className="text-xs text-green-700 font-semibold mt-0.5">
            {member.member_balance}
          </div>
        )}
      </div>

      {/* Status Indicator (Optional) */}
      {/* <div className={`ml-2 flex-shrink-0 ${isActive ? 'text-green-500' : 'text-red-500'}`} title={isActive ? 'Active' : 'Inactive'}>
        {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
      </div> */}
       <div className={`ml-2 flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
           {isActive ? 'Active' : 'Inactive'}
       </div>
    </div>
  );
};

export default MemberCard;