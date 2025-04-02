import React, { useState, useEffect } from 'react';
import { Note } from '../../types/Note';
import { Member } from '../../types/Member';
import { Pc } from '../../types/Pc';
import NoteItem from './NoteItem';
import CreateNoteForm from './CreateNoteForm';
import { NotesApi } from '../../api/notesApi';
import './Notes.css';

interface NotesListProps {
  selectedMember?: Member;
  selectedPc?: Pc;
  onCreateSuccess?: () => void;
}

const NotesList: React.FC<NotesListProps> = ({ 
  selectedMember, 
  selectedPc, 
  onCreateSuccess 
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load notes when selected member or PC changes
  useEffect(() => {
    if (!selectedMember && !selectedPc) {
      setNotes([]);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await NotesApi.getNotes(
          1, // page
          20, // limit
          selectedMember?.member_id,
          undefined, // memberAccount
          selectedPc?.pc_name,
          'active' // status
        );
        
        if (response.success && response.data) {
          setNotes(response.data.notes);
        } else {
          setError(response.error || 'Failed to fetch notes');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedMember, selectedPc]);

  const handleResolveNote = async (noteId: string) => {
    try {
      const response = await NotesApi.resolveNote(noteId);
      if (response.success) {
        // Remove the resolved note from the list
        setNotes(notes.filter(note => note.id !== noteId));
      } else {
        setError(response.error || 'Failed to resolve note');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    }
  };

  const handleCreateSuccess = (newNote: Note) => {
    setNotes([newNote, ...notes]);
    if (onCreateSuccess) {
      onCreateSuccess();
    }
  };

  const renderContext = () => {
    if (selectedPc && !selectedMember) {
      return (
        <div className="notes-context">
          <h3>PC: {selectedPc.pc_name}</h3>
          <p className="notes-warning">Select a member to view or create notes.</p>
        </div>
      );
    }
    
    else if (selectedMember) {
      return (
        <div className="notes-context">
          <h3>Notes for Member: {selectedMember.member_account}</h3>
        </div>
      );
    } else if (selectedPc) {
      return (
        <div className="notes-context">
          <h3>Notes for PC: {selectedPc.pc_name}</h3>
          {selectedPc.current_member_account && (
            <p>Current user: {selectedPc.current_member_account}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!selectedMember && !selectedPc) {
    return (
      <div className="notes-empty-state">
        <p>Select a member or PC to view notes</p>
      </div>
    );
  }

  // return (
  //   <div className="notes-container">
  //     {renderContext()}
      
  //     {/* Always show create form if selection exists */}
  //     {(selectedMember || selectedPc) && (
  //       <CreateNoteForm
  //         selectedMember={selectedMember}
  //         selectedPc={selectedPc}
  //         onSuccess={handleCreateSuccess}
  //         // Remove onCancel prop
  //       />
  //     )}

  //     {loading ? (
  //       <div className="notes-loading">Loading notes...</div>
  //     ) : error ? (
  //       <div className="notes-error">{error}</div>
  //     ) : notes.length === 0 ? (
  //       <div className="notes-empty">
  //         <p>No active notes found</p>
  //       </div>
  //     ) : (
  //       <div className="notes-list">
  //         {notes.map(note => (
  //           <NoteItem 
  //             key={note.id} 
  //             note={note} 
  //             onResolve={handleResolveNote} 
  //           />
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="notes-container">
      {renderContext()}
      
      {/* Only show create form if we have a member */}
      {selectedMember && (
        <CreateNoteForm
          selectedMember={selectedMember}
          selectedPc={selectedPc}
          onSuccess={handleCreateSuccess}
        />
      )}

      {loading ? (
        <div className="notes-loading">Loading notes...</div>
      ) : error ? (
        <div className="notes-error">{error}</div>
      ) : notes.length === 0 ? (
        <div className="notes-empty">
          <p>No active notes found</p>
        </div>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              onResolve={handleResolveNote} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
