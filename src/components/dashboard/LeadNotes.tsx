import React, { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';

const initialNotes = [
  {
    id: '1',
    content: 'Client interested in luxury safari package for 10 people',
    author: 'John Doe',
    date: '2024-03-18 2:30 PM',
  },
  {
    id: '2',
    content: 'Follow-up call scheduled for next week',
    author: 'Jane Smith',
    date: '2024-03-17 11:15 AM',
  },
];

export default function LeadNotes() {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Current User',
      date: new Date().toLocaleString(),
    };

    setNotes([note, ...notes]);
    setNewNote('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 drag-handle cursor-move">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Lead Notes
        </h2>
      </div>

      <form onSubmit={handleAddNote} className="flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="p-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <p className="text-sm text-gray-900 dark:text-white mb-2">
              {note.content}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{note.author}</span>
              <span>{note.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}