import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { Note } from '../types/Note';
import NoteItem from '../components/Notes/NoteItem';
import { NotesApi } from '../api/notesApi';
import './NotesHistory.css';

const NotesHistory: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await NotesApi.getNotes(
        1,
        999,
        undefined,
        undefined,
        undefined,
        filterStatus
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

  // Fetch notes when filter changes
  useEffect(() => {
    setNotes([]);
    fetchNotes();
  }, [filterStatus]);

  const handleResolveNote = async (noteId: string) => {
    try {
      const response = await NotesApi.resolveNote(noteId);
      if (response.success) {
        // If viewing all notes, update the status locally
        // If viewing only active notes, remove from list
        // Always update the note's status in the list
        setNotes(notes.map(note =>
          note.id === noteId ? { ...note, isActive: false } : note
        ));
      } else {
        setError(response.error || 'Failed to resolve note');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="notes-history-container">
        <div className="notes-history-header">
          <h2>Notes History</h2>
          <div className="notes-filter">
            <button
              className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Notes
            </button>
            <button
              className={`filter-button ${filterStatus === 'active' ? 'active' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              Active Only
            </button>
            <button
              className={`filter-button ${filterStatus === 'resolved' ? 'active' : ''}`}
              onClick={() => setFilterStatus('resolved')}
            >
              Resolved Only
            </button>
          </div>
        </div>
        
        {loading && notes.length === 0 ? (
          <div className="notes-loading">Loading notes...</div>
        ) : error ? (
          <div className="notes-error">{error}</div>
        ) : notes.length === 0 ? (
          <div className="notes-empty">
            <p>No notes found</p>
          </div>
        ) : (
          <>
            <div className="notes-list">
              {notes.map(note => (
                <NoteItem 
                  key={note.id} 
                  note={note} 
                  onResolve={handleResolveNote} 
                />
              ))}
            </div>
            
          </>
        )}
      </div>
    </Layout>
  );
};

export default NotesHistory;
