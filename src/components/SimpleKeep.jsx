import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Edit } from 'lucide-react';

const SimpleKeep = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [newNote, setNewNote] = useState({ title: '', content: '', isExpanded: false });
  const [editingId, setEditingId] = useState(null);
  const [editedNote, setEditedNote] = useState({ title: '', content: '' }); // Temporary state for editing

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleNewNoteChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };

  const addNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      setNotes(prev => [
        { id: Date.now(), title: newNote.title, content: newNote.content },
        ...prev
      ]);
      setNewNote({ title: '', content: '', isExpanded: false });
    }
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditedNote({ title: note.title, content: note.content }); // Initialize editedNote with the current note data
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedNote(prev => ({ ...prev, [name]: value })); // Update editedNote on input change
  };

  const saveEditedNote = (id) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, title: editedNote.title, content: editedNote.content } : note
    ));
    setEditingId(null); // Exit edit mode
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Add Note Section */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400 hover:shadow-lg transition-shadow">
          {newNote.isExpanded && (
            <input
              type="text"
              name="title"
              value={newNote.title}
              onChange={handleNewNoteChange}
              placeholder="Title"
              className="w-full mb-2 p-2 text-lg font-medium outline-none focus:bg-yellow-50 rounded"
            />
          )}
          <div className="flex items-start">
            <textarea
              name="content"
              value={newNote.content}
              onChange={handleNewNoteChange}
              onFocus={() => setNewNote(prev => ({ ...prev, isExpanded: true }))}
              placeholder="Take a note..."
              className="flex-grow p-2 outline-none resize-none focus:bg-yellow-50 rounded"
              rows={newNote.isExpanded ? 3 : 1}
            />
            {newNote.isExpanded && (
              <button
                onClick={addNote}
                className="ml-2 p-2 text-yellow-600 hover:bg-yellow-100 rounded-full transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400 hover:shadow-lg transition-shadow">
              {editingId === note.id ? (
                // Editing Mode
                <div>
                  <input
                    type="text"
                    name="title"
                    value={editedNote.title}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-2 text-lg font-medium outline-none focus:bg-yellow-50 rounded"
                    placeholder="Title"
                  />
                  <textarea
                    name="content"
                    value={editedNote.content}
                    onChange={handleEditChange}
                    className="w-full p-2 outline-none resize-none focus:bg-yellow-50 rounded"
                    rows={3}
                    placeholder="Note content"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => saveEditedNote(note.id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div>
                  {note.title && (
                    <h3 className="text-lg font-medium mb-2 text-yellow-900">{note.title}</h3>
                  )}
                  <p className="text-yellow-800 whitespace-pre-wrap">{note.content}</p>
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      onClick={() => startEditing(note)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleKeep;