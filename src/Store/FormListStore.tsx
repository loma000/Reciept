import { create } from "zustand";
import type { ReceiptData } from "../Props/types";
import { createJSONStorage, persist } from "zustand/middleware";

interface formListStoreProp {
  forms: ReceiptData[];
  setForms: (d: ReceiptData[]) => void;
}

export const useFormListStore = create<formListStoreProp>()(
  persist(
    (set) => ({
      forms: [],
      setForms: (d) => set(() => ({ forms: d })),
    }),
    { name: "Formlist", storage: createJSONStorage(() => sessionStorage) },
  ),
);
