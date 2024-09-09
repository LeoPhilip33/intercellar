import { useState } from "react";
import { useNotes } from "./NotesContext";

const Notes = () => {
  const { notes, addNote, toggleFavorite, removeNote } = useNotes();
  const [noteContent, setNoteContent] = useState("");

  const handleAddNote = () => {
    if (noteContent.trim()) {
      addNote(noteContent);
      setNoteContent("");
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Enter your note"
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      <div>
        <h2>Your Notes</h2>
        {notes.length === 0 && <p>No notes yet</p>}
        <ul>
          {notes.map((note) => (
            <li key={note.id} style={{ marginBottom: "1em" }}>
              <p>{note.content}</p>
              <button onClick={() => toggleFavorite(note.id)}>
                {note.isFavorite ? "Unfavorite" : "Favorite"}
              </button>
              <button onClick={() => removeNote(note.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notes;
