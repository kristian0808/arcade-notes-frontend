import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import PcGrid from '../components/PcGrid/PcGrid';
import MemberList from '../components/MemberList/MemberList';
import NotesList from '../components/Notes/NotesList';
import { Member } from '../types/Member';
import { Pc } from '../types/Pc';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const [selectedPc, setSelectedPc] = useState<Pc | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);


  // This function is called when a PC is selected from the grid
  const handlePcSelect = (pc: Pc) => {
    setSelectedPc(pc);
    // setSelectedMember(undefined); // Clear member selection
     // If PC has a current member, auto-select that member
     if (pc.current_member_id && pc.current_member_account) {
      // Option 1: Using the current_member fields directly if they're sufficient
      const simpleMember: Member = {
        member_id: pc.current_member_id,
        member_account: pc.current_member_account,
        member_is_active: 1,
      };
      setSelectedMember(simpleMember);
      
      // Option 2: Fetch full member details for more info
      /* 
      setLoading(true);
      try {
        const response = await IcafeApi.getMemberById(pc.current_member_id);
        if (response.success && response.data) {
          setSelectedMember(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch member details", error);
      } finally {
        setLoading(false);
      }
      */
    } else {
      // If no member is using the PC, clear member selection
      setSelectedMember(undefined);
    }
  };


  // This function is called when a member is selected from the list
  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    // setSelectedPc(undefined); // Clear PC selection
  };

  // This is called when a note is successfully created
  const handleNoteCreated = () => {
    // You could refresh PC or member data here if needed
  };
 
  // return (
  //   <Layout>
  //     <div className="dashboard-container">
  //       <div className="dashboard-main">
  //         <PcGrid onPcSelect={handlePcSelect} />
  //       </div>
        
  //       <div className="dashboard-sidebar">
  //         <div className="dashboard-members">
  //           <MemberList onMemberSelect={handleMemberSelect} />
  //         </div>
          
  //         <div className="dashboard-notes">
  //           <NotesList 
  //             selectedMember={selectedMember}
  //             selectedPc={selectedPc}
  //             onCreateSuccess={handleNoteCreated}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </Layout>
  // );
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-main">
          <PcGrid onPcSelect={handlePcSelect} />
        </div>
        
        <div className="dashboard-sidebar">
          <div className="dashboard-members">
            <MemberList 
              onMemberSelect={handleMemberSelect}
              selectedMemberId={selectedMember?.member_id}
            />
          </div>
          
          <div className="dashboard-notes">
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