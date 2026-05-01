

export interface ReceiptData {
  id?: number;
  name?: string;
  address?: string;
  tel?: string;
  dateRealFormat?: string;
  date?: string;
  room?: string;
  month?: string;
  waterMeterCurr?: string;
  waterMeterPrev?: string;
  waterMeterUsed?: string;
  electricMeterCurr?: string;
  electricMeterPrev?: string;
  electricMeterUsed?: string;
  rentChecked?: boolean;     rentAmount?: string;
  waterChecked?: boolean;    waterAmount?: string;
  electricChecked?: boolean; electricAmount?: string;
  internetChecked?: boolean; internetAmount?: string;
  feeChecked?: boolean;      feeAmount?: string;
  otherChecked?: boolean;    otherAmount?: string;
  receiver?: string;
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

export interface User {
  id: string;
  username: string;
}
