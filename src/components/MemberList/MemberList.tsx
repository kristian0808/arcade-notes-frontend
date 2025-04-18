// src/components/MemberList/MemberList.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Member } from '../../types/Member';
import MemberCard from './MemberCard'; // Use adapted MemberCard
import { IcafeApi } from '../../api/icafeApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { Search, Users } from 'lucide-react'; // Icons
import { useWebSocket } from '../../contexts/WebSocketContext';

interface MemberListProps {
  onMemberSelect: (member: Member) => void;
  selectedMemberId?: number; // Keep this prop to indicate selection
}

const MemberList: React.FC<MemberListProps> = ({ onMemberSelect, selectedMemberId }) => {
  const { members: webSocketMembers, isConnected } = useWebSocket();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching logic with WebSocket integration
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

  // Initialize data with WebSocket or fetching
  useEffect(() => {
    if (!webSocketMembers) {
      fetchMembers(); // Initial fetch if we don't have WebSocket data
      const intervalId = setInterval(() => {
        if (!isConnected) {
          console.log("WebSocket disconnected, using polling fallback for members");
          fetchMembers();
        }
      }, 60000); // Poll every minute if WebSocket disconnected
      return () => clearInterval(intervalId);
    } else {
      // Use WebSocket data if available
      setMembers(webSocketMembers);
      filterMembers(searchQuery, webSocketMembers);
      setLoading(false);
    }
  }, [webSocketMembers, isConnected]); // Depend on WebSocket data and connection state

  // Update members when WebSocket sends updates
  useEffect(() => {
    if (webSocketMembers) {
      console.log("MemberList: Updating from WebSocket data");
      setMembers(webSocketMembers);
      filterMembers(searchQuery, webSocketMembers);
      setLoading(false);
      setError(null);
    }
  }, [webSocketMembers, searchQuery]);

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
        {/* WebSocket indicator */}
        {isConnected && (
          <div className="mt-2 flex items-center text-xs text-green-700">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Real-time updates active
          </div>
        )}
      </div>

      {/* Content Area (List or Messages) */}
      {renderContent()}

    </div>
  );
};

export default MemberList;