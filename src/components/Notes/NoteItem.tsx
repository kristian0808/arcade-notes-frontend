// src/components/Notes/NoteItem.tsx
import React from 'react';
import { Note } from '../../types/Note';
import { Check, Clock } from 'lucide-react'; // Icons

interface NoteItemProps {
  note: Note;
  onResolve?: (noteId: string) => void; // Make resolve optional for history view
  isResolving?: boolean; // Optional flag for loading state
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onResolve, isResolving = false }) => {
  const formatDate = (dateString: string) => {
    try {
        return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true // Use AM/PM
        }).format(new Date(dateString));
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return "Invalid Date";
    }
  };

  const handleResolveClick = () => {
    if (onResolve && note.isActive && !isResolving) {
        // Optional: Add confirmation dialog
        // if (window.confirm('Are you sure you want to resolve this note?')) {
             onResolve(note.id);
        // }
    }
  };

  const isActive = note.isActive;

  return (
    <div className={`border rounded-md shadow-sm transition-opacity ${isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
      <div className="p-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-1 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-semibold text-indigo-700">{note.memberAccount || 'System'}</span>
            {note.pcName && (
              <span className="text-gray-500">(PC: {note.pcName})</span>
            )}
          </div>
           <div className="flex items-center gap-1 text-gray-500" title={`Created at: ${formatDate(note.createdAt)}`}>
                <Clock size={12} />
                <span>{formatDate(note.createdAt)}</span>
           </div>
        </div>

        {/* Content */}
        <p className={`text-sm my-2 ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
          {note.content}
        </p>

        {/* Footer/Actions */}
        <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-100">
          {isActive && onResolve ? (
            <button
              onClick={handleResolveClick}
              disabled={isResolving}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 hover:text-green-800 focus:outline-none focus:ring-1 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Mark as resolved"
            >
              <Check size={14} />
              {isResolving ? 'Resolving...' : 'Resolve'}
            </button>
          ) : !isActive ? (
             <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <Check size={14}/> Resolved
             </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NoteItem;