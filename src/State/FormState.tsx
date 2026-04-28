import { create } from "zustand";
import type { ItemEntry, ItemKey, ReceiptData } from "../Props/Data";
import { createJSONStorage, persist } from "zustand/middleware";

interface FormStateProp {
  Form: ReceiptData;
  setData: (data: Partial<ReceiptData>) => void;
  setItems: (data: Partial<Record<ItemKey, ItemEntry>>) => void;
  resetData:()=>void;
}

const defaultData:ReceiptData =   {
        name: "",
        address: "",
        tel: "",
        date: "",
        room: "",
        month: "",
        waterMeterCurr: "0",
        waterMeterPrev: "0",
        waterMeterUsed: "0",
        electricMeterCurr: "0",
        electricMeterPrev: "0",
        electricMeterUsed: "0",
        items: {
          rent: { checked: true, amount: "5000" },
          water: { checked: false, amount: "0" },
          electric: { checked: false, amount: "0" },
          internet: { checked: false, amount: "0" },
          fee: { checked: false, amount: "0" },
          other: { checked: false, amount: "0" },
        },
        Receiver: "",
        bankName: "",
        accountName: "",
        accountNumber: "",
      }

export const useFormStore = create<FormStateProp>()(
  persist(
    (set) => ({
      Form: defaultData,
      setData: (data) => set((state) => ({ Form: { ...state.Form, ...data } })),
      setItems: (data) =>
        set((state) => ({
          Form: { ...state.Form, items: { ...state.Form.items, ...data } },
        })),resetData:()=>set({Form:defaultData})
    }),
    {
      name: "endgame",
      storage: createJSONStorage(() => sessionStorage), // key ใน localStorage
    },
  ),
);
