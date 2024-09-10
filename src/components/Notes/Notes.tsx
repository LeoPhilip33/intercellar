import styles from "../../styles/Notes.module.scss";
import { useState } from "react";
import { useNotes } from "../../context/NotesContext";

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
    <div className={styles.notesContainer}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Enter your note"
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      <div className={styles.userNotesParentContainer}>
        {notes.length === 0 && <p>No notes yet</p>}
        {notes.map((note) => (
          <div
            className={`${styles.userNotesContainer} ${note.isFavorite ? styles.favorite : styles.notFavorite}`}
            key={note.id}
          >
            <p>{note.content}</p>

            <div>
              <button onClick={() => toggleFavorite(note.id)}>
                {note.isFavorite ? "Unfavorite" : "Favorite"}
              </button>
              <button
                className={styles.delete}
                onClick={() => removeNote(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
