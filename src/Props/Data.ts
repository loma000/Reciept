



export interface ItemEntry {
  checked: boolean;
  amount: string;
}

 

export type ItemKey = "rent" | "water" | "electric" | "internet" | "fee" | "other";

export interface ItemDef {
  key: ItemKey;
  th: string;
  en: string;
}

export interface ReceiptData {
  id?:number;
  name?: string;
  address?: string;
  tel?: string;
  dateRealFormat?:string;
  date?: string;
  room?: string;
  month?: string;
  waterMeterCurr?: string;
  waterMeterPrev?: string;
  waterMeterUsed?: string;
  electricMeterCurr?: string;
  electricMeterPrev?: string;
  electricMeterUsed?: string;
  items?: Partial<Record<ItemKey, ItemEntry>>;
  Receiver?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
}

export const THAI_MONTHS_FULL = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

