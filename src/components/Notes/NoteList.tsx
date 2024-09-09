import React from "react";
import { useNotes } from "../../context/NotesContext";
import NoteItem from "./NoteItem";

const NoteList: React.FC = () => {
  const { notes } = useNotes();

  return (
    <ul>
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </ul>
  );
};

export default NoteList;
