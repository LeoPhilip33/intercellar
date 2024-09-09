import React from "react";
import { useNotes } from "../../context/NotesContext";

interface NoteItemProps {
  note: {
    id: number;
    content: string;
    isFavorite: boolean;
  };
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const { toggleFavorite, removeNote } = useNotes();

  return (
    <li>
      <p>{note.content}</p>
      <button onClick={() => toggleFavorite(note.id)}>
        {note.isFavorite ? "Unfavorite" : "Favorite"}
      </button>
      <button onClick={() => removeNote(note.id)}>Delete</button>
    </li>
  );
};

export default NoteItem;
