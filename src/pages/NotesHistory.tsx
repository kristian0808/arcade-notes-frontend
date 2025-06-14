// src/pages/NotesHistory.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout/Layout';
import { Note } from '../types/Note';
import { NotesApi } from '../api/notesApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import NoteItem from '../components/Notes/NoteItem'; // Use adapted NoteItem
import { FileText, Filter } from 'lucide-react';

const NotesHistory: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await NotesApi.getNotes(
        1, 200, // Fetch a larger amount for history page
        undefined, undefined, undefined,
        filterStatus // Use the selected filter
      );
      if (response.success && response.data) {
        setNotes(response.data.notes);
      } else {
        setError(response.error || 'Failed to fetch notes history');
        setNotes([]); // Clear notes on error
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setNotes([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]); // Re-fetch when filterStatus changes

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleResolveNote = async (noteId: string) => {
    setResolvingId(noteId);
    setError(null);
    try {
      const response = await NotesApi.resolveNote(noteId);
      if (response.success) {
        // Update local state to reflect the change immediately
         setNotes(prev => prev.map(n => n.id === noteId ? { ...n, isActive: false } : n));
         // If filter is 'active', the resolved note will visually disappear if we refetch or filter locally after update
         if(filterStatus === 'active') {
            // Option 1: Refetch after short delay (simple)
            // setTimeout(fetchNotes, 100);
            // Option 2: Filter locally immediately
             setNotes(prev => prev.filter(n => n.id !== noteId));
         }
      } else {
        setError(response.error || 'Failed to resolve note');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while resolving');
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  // Filter options configuration
  type FilterType = 'all' | 'active' | 'resolved';
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All Notes', value: 'all' },
    { label: 'Active Only', value: 'active' },
    { label: 'Resolved Only', value: 'resolved' },
  ];

  // Render Content Area
   const renderContent = () => {
    if (loading) {
        return <div className="flex justify-center items-center flex-grow pt-10"><LoadingSpinner message="Loading history..." /></div>;
    }
    if (error) {
        return <div className="p-4 flex-grow"><ErrorMessage message={error} onRetry={fetchNotes} /></div>;
    }
    if (notes.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400 flex-grow flex flex-col items-center justify-center">
                <FileText size={48} className="mb-4 text-gray-300 dark:text-gray-600"/>
                <p>No notes found matching the filter.</p>
            </div>
        );
    }
    return (
         <div className="space-y-3 md:space-y-4 overflow-y-auto flex-grow p-1 pr-2"> {/* Add padding for scrollbar */}
            {notes.map(note => (
                <NoteItem
                    key={note.id}
                    note={note}
                    onResolve={handleResolveNote}
                    isResolving={resolvingId === note.id}
                />
            ))}
        </div>
    );
   };


  return (
    <Layout>
      {/* Use bg-white, rounded, shadow for the main content container */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-0">Notes History</h2>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter notes">
             <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 mr-2"><Filter size={14}/> Filter:</span>
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-3 py-1 text-xs md:text-sm rounded-md border transition-colors duration-150 ${
                  filterStatus === filter.value
                    ? 'bg-indigo-600 text-white border-indigo-600 font-medium' // Active filter style
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500' // Inactive filter style
                }`}
                aria-pressed={filterStatus === filter.value}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area (List or Messages) */}
        {renderContent()}

      </div>
    </Layout>
  );
};

export default NotesHistory;