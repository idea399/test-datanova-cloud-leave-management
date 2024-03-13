import { createContext } from "react";

import { IUser } from "../types/leave";

export const AppContext = createContext<{
  users: IUser[];
  getUserById: (id: string) => IUser | undefined;
  showNotification: (message: string) => void;
}>({
  users: [],
  getUserById: () => undefined,
  showNotification: () => undefined,
});
