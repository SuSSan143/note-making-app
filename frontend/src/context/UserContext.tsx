import { createContext, useState } from "react";
import { UserContextProviderProps, UserContextType } from "../types/user.types";

export const UserContext = createContext<UserContextType | null>(null);

const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    notesId: "",
  });  

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
