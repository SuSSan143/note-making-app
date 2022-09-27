import { createContext, useContext, useState } from "react";
import {
  NoteContextProviderProps,
  NoteContextType,
  NoteType,
} from "../types/notes.types";
import { UserContext } from "./UserContext";

export const NoteContext = createContext<NoteContextType | null>(null);

const NoteContextProvider = ({ children }: NoteContextProviderProps) => {
  const userContext = useContext(UserContext);

  const [notes, setNotes] = useState<NoteType[] | null>([
    {
      _id: "",
      title: "",
      description: "",
    },
  ]);
  const value = { notes, setNotes, notesId: userContext?.userDetails.notesId };
  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export default NoteContextProvider;
