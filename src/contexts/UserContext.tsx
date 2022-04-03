import { CollectedItem, Item, User } from "@prisma/client";
import { createContext, ReactNode, useContext } from "react";
import useSWR from "swr";

type PopulatedCollectedItem = CollectedItem & {
  originalItem: Item;
};

type PopulatedUser = User & {
  collectedItems: PopulatedCollectedItem[];
};

type UserContextType = {
  user?: PopulatedUser;
  error: any;
  refreshUser: () => void;
};
export const UserContext = createContext({} as UserContextType);

UserContext.displayName = "UserContext";

export const useUser = () => useContext(UserContext);

type UserProviderProps = {
  children: ReactNode;
};
export const UserProvider = ({ children }: UserProviderProps) => {
  const {
    data: user,
    error,
    mutate: refreshUser,
  } = useSWR<PopulatedUser>("/api/auth/me");

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
