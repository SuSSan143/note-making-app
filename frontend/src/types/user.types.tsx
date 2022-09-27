import { Dispatch, ReactNode } from "react";

export type UserDetailsType = {
  username: string;
  notesId: string;
};

export type UserContextType = {
  userDetails: UserDetailsType;
  setUserDetails: Dispatch<React.SetStateAction<UserDetailsType>>;
};

export type UserContextProviderProps = {
  children: ReactNode;
};
