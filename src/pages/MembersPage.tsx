// src/pages/MembersPage.tsx
import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import MemberList from '../components/MemberList/MemberList'; // Use adapted MemberList
import NotesList from '../components/Notes/NotesList'; // Use adapted NotesList
import { Member } from '../types/Member';
import { useWebSocket } from '../contexts/WebSocketContext';

const MembersPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const { isConnected } = useWebSocket();
  
  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
  };

  return (
    <Layout>
      {/* Use Tailwind for layout - Full height flex container */}
      {/* Adjust height calc based on Layout's header/footer */}
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6 h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)]">
        {/* WebSocket Status Indicator */}
        {isConnected && (
          <div className="absolute top-20 right-6 flex items-center">
            <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
            <span className="text-xs text-gray-500">Real-time updates connected</span>
          </div>
        )}

        {/* Member List Section - Takes width, full height in column, fixed height in row */}
        <div className="md:w-1/3 lg:w-1/4 h-1/2 md:h-full flex-shrink-0">
          {/* MemberList component should be flex col h-full internally */}
          <MemberList
            onMemberSelect={handleMemberSelect}
            selectedMemberId={selectedMember?.member_id}
          />
        </div>

        {/* Notes Section - Takes remaining width/height */}
        <div className="flex-1 h-1/2 md:h-full min-h-0"> {/* min-h-0 prevents flex item overflow */}
          {/* NotesList component should be flex col h-full internally */}
          <NotesList selectedMember={selectedMember} />
        </div>
      </div>
    </Layout>
  );
};

export default MembersPage;