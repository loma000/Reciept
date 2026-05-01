import { create } from "zustand";
import type { User } from "../Props/types";
import { createJSONStorage, persist } from "zustand/middleware";

interface userStoreProp {
  user: User;
  setUser: (u: Partial<User>) => void;
  clearUser: ()=>void;
}

export const userStore = create<userStoreProp>()(
  persist(
    (set) => ({
      user: { username: "", id: "" },
      setUser: (u) => set((state) => ({ user: { ...state.user, ...u } })),
    clearUser:()=>(set(()=>({user:{ username: "", id: ""}})))}),
    { name: "user", storage: createJSONStorage(() => sessionStorage) },
  ),
);
