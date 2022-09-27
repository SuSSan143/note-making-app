import { Dispatch, FormEvent, ReactNode } from "react";

export type UserInput = {
  title: string;
  description: string;
};

export type ModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

export type CardProps = {
  title: string;
  description: string;
  noteId: string;
  inEditMode?: boolean;
  isCardLoading?: boolean
};

export type FormProps = {
  handleSubmit: (e: FormEvent<HTMLDivElement>) => void;
  userInput: UserInput;
  setUserInput: Dispatch<React.SetStateAction<UserInput>>;
  isLoading?: boolean
};

export type NoteType = {
  title: string;
  description: string;
  _id: string;
};

export type NoteContextType = {
  notes: NoteType[] | null;
  setNotes: Dispatch<React.SetStateAction<NoteType[] | null>>;
  notesId: string | undefined;
};

export type NoteContextProviderProps = {
  children: ReactNode;
};
