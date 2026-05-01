import { create } from "zustand";
import type { ReceiptData } from "../Props/types";
import { createJSONStorage, persist } from "zustand/middleware";

interface FormStateProp {
  Form: ReceiptData;
  setData: (data: Partial<ReceiptData>) => void;

  resetData: () => void;
}

const defaultData: ReceiptData = {
  id: 0,
  name: "",
  address: "",
  tel: "",
  dateRealFormat: "",
  date: "",
  room: "",
  month: "",
  waterMeterCurr: "0",
  waterMeterPrev: "0",
  waterMeterUsed: "20",
  electricMeterCurr: "0",
  electricMeterPrev: "0",
  electricMeterUsed: "8",
  rentChecked: true,
  rentAmount: "5000",
  waterChecked: false,
  waterAmount: "",
  electricChecked: false,
  electricAmount: "",
  internetChecked: false,
  internetAmount: "",
  feeChecked: false,
  feeAmount: "",
  otherChecked: false,
  otherAmount: "",
  receiver: "",
  bankName: "",
  accountName: "",
  accountNumber: "",
};

export const useFormStore = create<FormStateProp>()(
  persist(
    (set) => ({
      Form: defaultData,
      setData: (data) => set((state) => ({ Form: { ...state.Form, ...data } })),

      resetData: () => set({ Form: defaultData }),
    }),
    {
      name: "Form",
      storage: createJSONStorage(() => sessionStorage), // key ใน localStorage
    },
  ),
);
