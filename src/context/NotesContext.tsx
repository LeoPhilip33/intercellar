import React, { createContext, useContext, useState } from "react";

type Note = {
  id: number;
  content: string;
  isFavorite: boolean;
};

type NotesContextType = {
  notes: Note[];
  addNote: (content: string) => void;
  toggleFavorite: (id: number) => void;
  removeNote: (id: number) => void;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (content: string) => {
    const newNote = { id: Date.now(), content, isFavorite: false };
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const toggleFavorite = (id: number) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );
  };

  const removeNote = (id: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <NotesContext.Provider
      value={{ notes, addNote, toggleFavorite, removeNote }}
    >
      {children}
    </NotesContext.Provider>
  );
};
