// src/components/MemberList/MemberList.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Member } from '../../types/Member';
import MemberCard from './MemberCard'; // Use adapted MemberCard
import { IcafeApi } from '../../api/icafeApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { Search, Users } from 'lucide-react'; // Icons

interface MemberListProps {
  onMemberSelect: (member: Member) => void;
  selectedMemberId?: number; // Keep this prop to indicate selection
}

const MemberList: React.FC<MemberListProps> = ({ onMemberSelect, selectedMemberId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching logic remains the same
  const fetchMembers = async () => {
    // Only set loading true on initial fetch or retry
    if (members.length === 0) setLoading(true);
    setError(null);
    try {
      const response = await IcafeApi.getAllMembers();
      if (response.success && response.data) {
        setMembers(response.data);
        // Apply filter immediately after fetching
        filterMembers(searchQuery, response.data);
      } else {
        setError(response.error || 'Failed to fetch members');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    const intervalId = setInterval(fetchMembers, 60000); // Poll every minute
    return () => clearInterval(intervalId);
  }, []); // Initial fetch only

  // Filtering logic
  const filterMembers = (query: string, sourceMembers: Member[]) => {
    if (query.trim() === '') {
      setFilteredMembers(sourceMembers);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = sourceMembers.filter(member =>
        member.member_account.toLowerCase().includes(lowerCaseQuery) ||
        (member.member_first_name && member.member_first_name.toLowerCase().includes(lowerCaseQuery)) ||
        (member.member_last_name && member.member_last_name.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredMembers(filtered);
    }
  };

  // Update filtered list when search query changes
  useEffect(() => {
    filterMembers(searchQuery, members);
  }, [searchQuery, members]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Selection logic remains the same
  const handleMemberClick = (member: Member) => {
    onMemberSelect(member); // Propagate selection up
  };

  // Render Content
  const renderContent = () => {
    if (loading) {
        return <div className="flex justify-center items-center flex-grow"><LoadingSpinner message="Loading members..." /></div>;
    }
    if (error) {
        return <div className="p-4 flex-grow"><ErrorMessage message={error} onRetry={fetchMembers} /></div>;
    }
    if (filteredMembers.length === 0) {
        return (
            <div className="text-center py-6 text-gray-500 flex-grow flex flex-col items-center justify-center">
                 <Users size={40} className="mb-3 text-gray-400"/>
                 <p className="text-sm">
                    {searchQuery ? 'No members match search.' : 'No members found.'}
                 </p>
            </div>
        );
    }
    return (
         <div className="space-y-1 p-2 overflow-y-auto flex-grow"> {/* List container */}
           {filteredMembers.map((member) => (
             <MemberCard
               key={member.member_id}
               member={member}
               isSelected={selectedMemberId === member.member_id}
               onClick={handleMemberClick}
             />
           ))}
         </div>
    );
  };

  return (
    // Use Tailwind for the container and layout
    <div className="member-list-container bg-white rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header/Search Area */}
      <div className="p-3 border-b flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <input
            type="text"
            placeholder="Search members..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search members"
          />
        </div>
      </div>

      {/* Content Area (List or Messages) */}
      {renderContent()}

    </div>
  );
};

export default MemberList;