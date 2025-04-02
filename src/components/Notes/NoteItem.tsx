// Enhanced NoteItem.tsx with member focus
import React from 'react';
import { Note } from '../../types/Note';
import './Notes.css';

interface NoteItemProps {
  note: Note;
  onResolve: (noteId: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onResolve }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleResolve = () => {
    if (window.confirm('Are you sure you want to resolve this note?')) {
      onResolve(note.id);
    }
  };

  // Hide resolve button if note is already resolved
  const showResolveButton = note.isActive;

  return (
    <div className={`note-item-container ${!note.isActive ? 'resolved' : ''}`}>
      <div className="note-item">
        <div className="note-header">
          <div className="note-meta">
            <span className="note-member">Member: {note.memberAccount}</span>
            {note.pcName && (
              <span className="note-pc-reference">PC: {note.pcName}</span>
            )}
            <span className="note-date">{formatDate(note.createdAt)}</span>
          </div>
          {showResolveButton && (
            <button 
              className="note-resolve-button"
              onClick={handleResolve}
              aria-label="Resolve note"
              title="Mark as resolved"
            >
              ✓
            </button>
          )}
        </div>
        
        <div className="note-content">
          {note.content}
        </div>
      </div>
      {!note.isActive && (
        <div className="note-status-text">
          Resolved
        </div>
      )}
    </div>
  );
};

export default NoteItem;