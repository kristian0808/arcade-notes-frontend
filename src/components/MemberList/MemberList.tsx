// import React, { useState, useEffect } from 'react';
// import { Member } from '../../types/Member';
// import MemberCard from './MemberCard';
// import { IcafeApi } from '../../api/icafeApi';
// import './MemberList.css';

// interface MemberListProps {
//   onMemberSelect: (member: Member) => void;
//   selectedMemberId?: number;
// }

// const MemberList: React.FC<MemberListProps> = ({ onMemberSelect, selectedMemberId }) => {
//   const [members, setMembers] = useState<Member[]>([]);
//   const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   // const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
//   const [selectedMemberIdState, setSelectedMemberIdState] = useState<number | null>(
//     selectedMemberId || null
//   );

//   // Add useEffect to update local state when prop changes
//   useEffect(() => {
//     if (selectedMemberId) {
//       setSelectedMemberIdState(selectedMemberId);
//     }
//   }, [selectedMemberId]);


//   // Fetch all members on component mount
//   useEffect(() => {
//     const fetchMembers = async () => {
//       setLoading(true);
//       try {
//         const response = await IcafeApi.getAllMembers();
//         if (response.success && response.data) {
//           setMembers(response.data);
//           setFilteredMembers(response.data);
//         } else {
//           setError(response.error || 'Failed to fetch members');
//         }
//       } catch (err) {
//         setError('An unexpected error occurred');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMembers();
    
//     // Set up polling for real-time updates
//     const intervalId = setInterval(fetchMembers, 60000); // Poll every minute
    
//     return () => clearInterval(intervalId); // Cleanup on unmount
//   }, []);

//   // Filter members when search query changes
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredMembers(members);
//     } else {
//       const lowerCaseQuery = searchQuery.toLowerCase();
//       const filtered = members.filter(member => 
//         member.member_account.toLowerCase().includes(lowerCaseQuery) ||
//         (member.member_first_name && member.member_first_name.toLowerCase().includes(lowerCaseQuery)) ||
//         (member.member_last_name && member.member_last_name.toLowerCase().includes(lowerCaseQuery))
//       );
//       setFilteredMembers(filtered);
//     }
//   }, [searchQuery, members]);

//   const handleMemberClick = (member: Member) => {
//     setSelectedMemberId(member.member_id);
//     onMemberSelect(member);
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   if (loading && members.length === 0) {
//     return <div className="member-list-loading">Loading members...</div>;
//   }

//   if (error && members.length === 0) {
//     return <div className="member-list-error">Error: {error}</div>;
//   }

//   return (
//     <div className="member-list-container">
//       <div className="member-list-header">
//         <div className="member-search">
//           <input
//             type="text"
//             placeholder="Search members..."
//             value={searchQuery}
//             onChange={handleSearch}
//           />
//         </div>
//       </div>
      
//       <div className="member-list">
//         {filteredMembers.length === 0 ? (
//           <div className="no-members-found">
//             {searchQuery ? 'No members match your search' : 'No members available'}
//           </div>
//         ) : (
//           filteredMembers.map((member) => (
//             <MemberCard 
//               key={member.member_id} 
//               member={member} 
//               isSelected={selectedMemberId === member.member_id}
//               onClick={() => handleMemberClick(member)} 
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default MemberList;
import React, { useState, useEffect } from 'react';
import { Member } from '../../types/Member';
import MemberCard from './MemberCard';
import { IcafeApi } from '../../api/icafeApi';
import './MemberList.css';

interface MemberListProps {
  onMemberSelect: (member: Member) => void;
  selectedMemberId?: number;
}

const MemberList: React.FC<MemberListProps> = ({ onMemberSelect, selectedMemberId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMemberIdState, setSelectedMemberIdState] = useState<number | null>(
    selectedMemberId || null
  );

  // Update local state when prop changes
  useEffect(() => {
    if (selectedMemberId) {
      setSelectedMemberIdState(selectedMemberId);
    }
  }, [selectedMemberId]);

  // Fetch all members on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await IcafeApi.getAllMembers();
        if (response.success && response.data) {
          setMembers(response.data);
          setFilteredMembers(response.data);
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

    fetchMembers();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchMembers, 60000); // Poll every minute
    
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Filter members when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = members.filter(member => 
        member.member_account.toLowerCase().includes(lowerCaseQuery) ||
        (member.member_first_name && member.member_first_name.toLowerCase().includes(lowerCaseQuery)) ||
        (member.member_last_name && member.member_last_name.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  const handleMemberClick = (member: Member) => {
    setSelectedMemberIdState(member.member_id);
    onMemberSelect(member);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading && members.length === 0) {
    return <div className="member-list-loading">Loading members...</div>;
  }

  if (error && members.length === 0) {
    return <div className="member-list-error">Error: {error}</div>;
  }

  return (
    <div className="member-list-container">
      <div className="member-list-header">
        <div className="member-search">
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <div className="member-list">
        {filteredMembers.length === 0 ? (
          <div className="no-members-found">
            {searchQuery ? 'No members match your search' : 'No members available'}
          </div>
        ) : (
          filteredMembers.map((member) => (
            <MemberCard 
              key={member.member_id} 
              member={member} 
              isSelected={selectedMemberIdState === member.member_id}
              onClick={() => handleMemberClick(member)} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MemberList;