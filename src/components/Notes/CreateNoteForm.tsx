// src/components/Notes/CreateNoteForm.tsx
import React, { useState, FormEvent } from 'react';
import { Member } from '../../types/Member';
import { Pc } from '../../types/Pc';
import { Note } from '../../types/Note';
import { NotesApi } from '../../api/notesApi';
import ErrorMessage from '../common/ErrorMessage'; // Use adapted ErrorMessage
import { Send } from 'lucide-react'; // Icon

interface CreateNoteFormProps {
  selectedMember?: Member; // Make member mandatory for creating note
  selectedPc?: Pc; // PC is optional context
  onSuccess: (note: Note) => void; // Callback on success
  className?: string; // Allow parent styling
}

const CreateNoteForm: React.FC<CreateNoteFormProps> = ({
  selectedMember,
  selectedPc,
  onSuccess,
  className = ''
}) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Ensure member is selected and content exists
    if (!selectedMember || !content.trim() || isLoading) return;

    setError(null); // Clear previous errors
    setIsLoading(true);

    try {
      const response = await NotesApi.createNote({
        content: content.trim(),
        memberId: selectedMember.member_id, // Member ID is required
        memberAccount: selectedMember.member_account, // Include account for potential backend use
        pcName: selectedPc?.pc_name // Optional PC context
      });

      if (response.success && response.data) {
        // Construct a Note object to pass to the parent
        const newNote: Note = {
          id: response.data.id,
          content: content.trim(),
          memberId: selectedMember.member_id,
          memberAccount: selectedMember.member_account,
          pcName: selectedPc?.pc_name,
          isActive: true, // New notes are active
          createdAt: new Date().toISOString(), // Use current time (backend might override)
          updatedAt: new Date().toISOString()
        };
        onSuccess(newNote);
        setContent(''); // Clear the form
      } else {
        setError(response.error || 'Failed to create note');
      }
    } catch (err: any) {
        console.error("Note creation error:", err);
        setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = selectedMember && content.trim() && !isLoading;

  return (
    <form onSubmit={handleSubmit} className={`create-note-form ${className}`}>
      {error && <div className="mb-3"><ErrorMessage message={error} /></div>}

      {!selectedMember && (
        <div className="mb-3 p-3 text-sm text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-md">
          Please select a member to add a note.
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="noteContent" className="sr-only">Note Content</label>
        <textarea
          id="noteContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={selectedMember ? `Add note for ${selectedMember.member_account}...` : "Select a member first..."}
          rows={3}
          required
          disabled={isLoading || !selectedMember}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          disabled={!canSubmit}
        >
          <Send size={16} />
          {isLoading ? 'Adding...' : 'Add Note'}
        </button>
      </div>
    </form>
  );
};

export default CreateNoteForm;