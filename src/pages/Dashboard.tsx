import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import PcGrid from '../components/PcGrid/PcGrid';
import MemberList from '../components/MemberList/MemberList';
import NotesList from '../components/Notes/NotesList';

import './Dashboard.css';
import { Member } from '../types/Member';
import { Pc } from '../types/Pc';
import { TabsApi } from '../api/TabsApi';
import { Tab } from '../types/Tab';
import { TabManager } from '../components/Tabs/TabManager';

const Dashboard: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const [selectedPc, setSelectedPc] = useState<Pc | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false);
  const [tabError, setTabError] = useState<string | null>(null);

  // This function is called when a PC is selected from the grid
  // In Dashboard.tsx
  const handlePcSelect = async (pc: Pc) => {
    setSelectedPc(pc);

    // If PC has a current member, create a member object and set it
    if (pc.current_member_id && pc.current_member_account) {
      console.log('PC has active member, setting selectedMember');
      const memberFromPc: Member = {
        member_id: pc.current_member_id,
        member_account: pc.current_member_account,
        // Add other required Member properties with default values if needed
        member_is_active: 1 // Assuming active since they're on a PC
      };

      setSelectedMember(memberFromPc);
      await checkForActiveTab(pc.current_member_id);
    } else {
      // Clear member selection if PC has no current member
      console.log('PC has no active member, clearing selectedMember');
      setSelectedMember(undefined);
      setActiveTab(null);
    }
  };

  // This function is called when a member is selected from the list
  const handleMemberSelect = async (member: Member) => {
    setSelectedMember(member);
    setSelectedPc(undefined); // Clear PC selection

    // Check for active tab for this member
    await checkForActiveTab(member.member_id);
  };

  // Check if the selected member has an active tab
  const checkForActiveTab = async (memberId: number) => {
    setIsTabLoading(true);
    setTabError(null);

    try {
      const response = await TabsApi.getActiveTabForMember(memberId);

      if (response.success && response.data) {
        if ('active' in response.data && response.data.active === false) {
          // No active tab
          setActiveTab(null);
        } else {
          // Active tab found
          setActiveTab(response.data as Tab);
        }
      } else {
        setTabError(response.error || 'Failed to check for active tab');
        setActiveTab(null);
      }
    } catch (error) {
      console.error('Error checking for active tab:', error);
      setTabError('An unexpected error occurred');
      setActiveTab(null);
    } finally {
      setIsTabLoading(false);
    }
  };

  // Create a new tab for the selected member
// In Dashboard.tsx, update the handleCreateTab function
const handleCreateTab = async () => {
  if (!selectedMember) {
    console.log('No member selected, cannot create tab');
    return;
  }
  
  console.log('About to create tab for member:', selectedMember);
  setIsTabLoading(true);
  setTabError(null);
  
  try {
    const tabData = {
      memberId: selectedMember.member_id,
      memberAccount: selectedMember.member_account,
      pcName: selectedPc?.pc_name
    };
    
    console.log('Sending tab creation request with data:', tabData);
    
    // Use fetch directly instead of TabsApi
    const response = await fetch('http://localhost:3000/api/tabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tabData)
    });
    
    console.log('Tab creation response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Tab created successfully:', data);
      setActiveTab(data);
    } else {
      const errorText = await response.text();
      console.error('Tab creation failed:', errorText);
      setTabError(`Failed to create tab: ${response.status} ${errorText}`);
    }
  } catch (error) {
    console.error('Error creating tab:', error);
    const err = error as Error;
    setTabError(err.message || 'An unexpected error occurred');
  } finally {
    setIsTabLoading(false);
  }
};

  // Close the active tab
  const handleCloseTab = async () => {
    if (!activeTab) return;

    setIsTabLoading(true);
    setTabError(null);

    try {
      const response = await TabsApi.closeTab(activeTab.id);

      if (response.success) {
        setActiveTab(null);
      } else {
        setTabError(response.error || 'Failed to close tab');
      }
    } catch (error) {
      console.error('Error closing tab:', error);
      setTabError('An unexpected error occurred');
    } finally {
      setIsTabLoading(false);
    }
  };

  // This is called when a note is successfully created
  const handleNoteCreated = () => {
    // You could refresh PC or member data here if needed
  };

  // This is called when the tab is successfully updated
  const handleTabUpdated = (updatedTab: Tab) => {
    setActiveTab(updatedTab);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-main">
          <PcGrid onPcSelect={handlePcSelect} />
        </div>

        <div className="dashboard-sidebar">
          <div className="dashboard-members">
            <MemberList onMemberSelect={handleMemberSelect} />
          </div>

          <div className="dashboard-tabs-notes">
            {(selectedMember || (selectedPc?.current_member_id && selectedPc?.current_member_account)) && (
              <TabManager
                selectedMember={selectedMember}
                selectedPc={selectedPc}
                activeTab={activeTab}
                isLoading={isTabLoading}
                error={tabError}
                onCreateTab={handleCreateTab}
                onCloseTab={handleCloseTab}
                onTabUpdated={handleTabUpdated}
              />
            )}
            <NotesList
              selectedMember={selectedMember}
              selectedPc={selectedPc}
              onCreateSuccess={handleNoteCreated}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;