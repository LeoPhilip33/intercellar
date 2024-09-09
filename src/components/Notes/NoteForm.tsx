import React, { useState } from "react";
import { useNotes } from "../../context/NotesContext";

const NoteForm: React.FC = () => {
  const [noteContent, setNoteContent] = useState("");
  const { addNote } = useNotes();

  const handleAddNote = () => {
    if (noteContent.trim()) {
      addNote(noteContent);
      setNoteContent("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Enter your note"
      />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default NoteForm;
