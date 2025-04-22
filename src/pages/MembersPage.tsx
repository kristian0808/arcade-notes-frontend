import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import MemberList from '../components/MemberList/MemberList';
import NotesList from '../components/Notes/NotesList';
import MemberRankings from '../components/Members/MemberRankings';
import { Member } from '../types/Member';
import { useWebSocket } from '../contexts/WebSocketContext';

const MembersPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState<'info' | 'notes' | 'rankings'>('rankings');
  const { isConnected } = useWebSocket();
  
  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    // If we're on rankings tab and select a member, switch to info
    if (selectedTab === 'rankings') {
      setSelectedTab('info');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
        {/* WebSocket Status Indicator */}
        {isConnected && (
          <div className="absolute top-20 right-6 flex items-center">
            <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
            <span className="text-xs text-gray-500">Real-time updates connected</span>
          </div>
        )}

        {/* Member List Section - Left Sidebar */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
          <MemberList
            onMemberSelect={handleMemberSelect}
            selectedMemberId={selectedMember?.member_id}
          />
        </div>

        {/* Main Content Area - Right Side */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 rounded-t-lg">
            <div className="flex">
              <button 
                className={`px-4 py-3 font-medium text-sm ${selectedTab === 'info' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setSelectedTab('info')}
                disabled={!selectedMember}
              >
                Member Info
              </button>
              <button 
                className={`px-4 py-3 font-medium text-sm ${selectedTab === 'notes' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setSelectedTab('notes')}
                disabled={!selectedMember}
              >
                Notes
              </button>
              <button 
                className={`px-4 py-3 font-medium text-sm ${selectedTab === 'rankings' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setSelectedTab('rankings')}
              >
                Rankings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {selectedTab === 'rankings' && (
              <MemberRankings />
            )}
            
            {selectedTab === 'notes' && selectedMember && (
              <NotesList selectedMember={selectedMember} />
            )}
            
            {selectedTab === 'info' && selectedMember && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Member Information</h2>
                <div className="space-y-4">
                  <p><strong>Account:</strong> {selectedMember.member_account}</p>
                  <p><strong>Name:</strong> {selectedMember.member_first_name} {selectedMember.member_last_name}</p>
                  <p><strong>Balance:</strong> {selectedMember.member_balance}</p>
                  <p><strong>Status:</strong> {selectedMember.member_is_active ? 'Active' : 'Inactive'}</p>
                  {/* Add more member info fields as needed */}
                </div>
              </div>
            )}
            
            {/* Empty state for info/notes if no member selected */}
            {(selectedTab === 'info' || selectedTab === 'notes') && !selectedMember && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Select a member to view {selectedTab === 'info' ? 'information' : 'notes'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MembersPage;
