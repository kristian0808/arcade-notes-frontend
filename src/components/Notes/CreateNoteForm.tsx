// import React, { useState, FormEvent } from 'react';
// import './Notes.css';

// import { Member } from '../../types/Member';
// import { Pc } from '../../types/Pc';
// import { Note } from '../../types/Note';
// import { NotesApi } from '../../api/notesApi';

// interface CreateNoteFormProps {
//   selectedMember?: Member;
//   selectedPc?: Pc;
//   onSuccess: (note: Note) => void;
// }

// const CreateNoteForm: React.FC<CreateNoteFormProps> = ({
//   selectedMember,
//   selectedPc,
//   onSuccess
// }) => {
//   const [content, setContent] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!content.trim() || isLoading) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await NotesApi.createNote({
//         content: content.trim(),
//         memberId: selectedMember?.member_id || undefined,
//         pcName: selectedPc?.pc_name || undefined
//       });

//       if (response.success && response.data) {
//         // Construct a complete Note object from the request data and response
//         const newNote: Note = {
//           id: response.data.id,
//           content: content.trim(),
//           memberId: selectedMember?.member_id || 0,
//           memberAccount: selectedMember?.member_account,
//           pcName: selectedPc?.pc_name,
//           isActive: true,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString()
//         };
//         onSuccess(newNote);
//         setContent('');
//       } else {
//         setError(response.error || 'Failed to create note');
//       }
//     } catch (err) {
//       setError('An unexpected error occurred');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="create-note-form-inner">
//       {error && <div className="form-error">{error}</div>}

//       <div className="form-group">
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Add a new note..."
//           rows={3}
//           required
//           disabled={isLoading}
//         />
//       </div>

//       <div className="create-note-form-submit-area">
//         <button
//           type="submit"
//           className="submit-button"
//           disabled={isLoading || !content.trim()}
//         >
//           {isLoading ? 'Adding...' : 'Add Note'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CreateNoteForm;

import React, { useState, FormEvent } from 'react';
import './Notes.css';

import { Member } from '../../types/Member';
import { Pc } from '../../types/Pc';
import { Note } from '../../types/Note';
import { NotesApi } from '../../api/notesApi';

interface CreateNoteFormProps {
  selectedMember?: Member;
  selectedPc?: Pc;
  onSuccess: (note: Note) => void;
}

const CreateNoteForm: React.FC<CreateNoteFormProps> = ({
  selectedMember,
  selectedPc,
  onSuccess
}) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;
    
    // Enforce member selection
    if (!selectedMember) {
      setError('Please select a member to create a note.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await NotesApi.createNote({
        content: content.trim(),
        memberId: selectedMember.member_id,
        pcName: selectedPc?.pc_name // Optional metadata
      });

      if (response.success && response.data) {
        // Construct a complete Note object from the request data and response
        const newNote: Note = {
          id: response.data.id,
          content: content.trim(),
          memberId: selectedMember.member_id,
          memberAccount: selectedMember.member_account,
          pcName: selectedPc?.pc_name,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        onSuccess(newNote);
        setContent('');
      } else {
        setError(response.error || 'Failed to create note');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-note-form-inner">
      {error && <div className="form-error">{error}</div>}
      
      {!selectedMember && (
        <div className="form-warning">
          Please select a member to create a note.
        </div>
      )}

      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={selectedMember ? "Add a new note..." : "Select a member first to add a note"}
          rows={3}
          required
          disabled={isLoading || !selectedMember}
        />
      </div>

      <div className="create-note-form-submit-area">
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || !content.trim() || !selectedMember}
        >
          {isLoading ? 'Adding...' : 'Add Note'}
        </button>
      </div>
    </form>
  );
};

export default CreateNoteForm;
