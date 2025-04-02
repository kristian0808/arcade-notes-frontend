import React from 'react';
import Layout from '../components/Layout/Layout';
import MemberList from '../components/MemberList/MemberList';
import NotesList from '../components/Notes/NotesList';
import { Member } from '../types/Member';
import './MembersPage.css';

const MembersPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = React.useState<Member | undefined>(undefined);

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
  };

  return (
    <Layout>
      <div className="members-page">
        <div className="members-list-container">
          <MemberList onMemberSelect={handleMemberSelect} />
        </div>
        <div className="members-notes-container">
          <NotesList selectedMember={selectedMember} />
        </div>
      </div>
    </Layout>
  );
};

export default MembersPage;