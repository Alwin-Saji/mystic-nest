import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotesPanel({ isOpen, onClose }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("focus-notes");
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      // Convert date strings back to Date objects
      const notesWithDates = parsedNotes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
      }));
      setNotes(notesWithDates);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("focus-notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        createdAt: new Date(),
      };
      setNotes([note, ...notes]); // Add new note at the beginning
      setNewNote("");
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNote();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full max-w-md bg-card border-r border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Quick Notes</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Add Note Form */}
            <div className="p-6 border-b border-border">
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a quick note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-focus-primary resize-none"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-focus-primary text-white rounded-md hover:bg-focus-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Note</span>
                </button>
              </form>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-6">
              {notes.length === 0 ? (
                <p className="text-muted-foreground text-center mt-8">
                  No notes yet. Add one above!
                </p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-md bg-accent/30 border border-border relative group"
                    >
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all duration-200"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <p className="text-sm text-foreground mb-2 pr-8 whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
