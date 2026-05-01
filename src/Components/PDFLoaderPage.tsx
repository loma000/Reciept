// npm install @react-pdf/renderer xlsx
// npm install -D @types/react

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";

type Style = ReturnType<typeof StyleSheet.create>[string];

import NotoSansRegular from "../assets/fonts/NotoSansThai-Regular.ttf";
import NotoSansBold from "../assets/fonts/NotoSansThai-Bold.ttf";
import type { ReceiptData } from "../Props/types";

// ---- Types ----
 

interface ItemDef {
  key: "rent" | "water" | "electric" | "internet" | "fee" | "other";
  th: string;
  en: string;
}

// ---- Font ----
Font.register({
  family: "Sarabun",
  fonts: [
    { src: NotoSansRegular as string, fontWeight: 400 },
    { src: NotoSansBold as string, fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

// ---- Styles ----
const s = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    fontSize: 10,
    padding: "28pt 32pt 36pt",
    backgroundColor: "#faf8f3",
    color: "#111",
  },
  title: { fontSize: 14, fontWeight: 700, textAlign: "center", marginBottom: 2 },
  subtitle: { fontSize: 10, textAlign: "center", color: "#555", marginBottom: 14 },
  headerGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  fieldRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 5 },
  fieldLabel: { fontSize: 10, fontWeight: 700, marginRight: 4 },
  fieldLabelSub: { fontSize: 8, color: "#666" },
  fieldLine: {
    flex: 1,
    borderBottom: "1pt solid #555",
    fontSize: 10,
    paddingBottom: 1,
    paddingLeft: 3,
    paddingRight: 6,
    minWidth: 60,
  },
  halfLeft: { width: "55%", paddingRight: 8 },
  halfRight: { width: "45%" },
  fullWidth: { width: "100%" },
  roomRow: { flexDirection: "row", marginBottom: 12, gap: 24 },
  roomLabel: { fontSize: 12, fontWeight: 700, marginRight: 5 },
  table: { marginBottom: 8 },
  tableRow: { flexDirection: "row" },
  cell: {
    border: "0.5pt solid #888",
    padding: "3pt 5pt",
    fontSize: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf8f3",
  },
  headerCell: {
    border: "0.5pt solid #888",
    padding: "3pt 4pt",
    fontSize: 8.5,
    fontWeight: 700,
    backgroundColor: "#d6d6d6",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  totalCell: {
    border: "0.5pt solid #888",
    padding: "4pt 5pt",
    fontSize: 9,
    fontWeight: 700,
    backgroundColor: "#eae7dc",
    justifyContent: "center",
    alignItems: "center",
  },
  colMeter: { width: "13%" },
  colItem: { width: "47%", alignItems: "flex-start" },
  colAmount: { width: "14%", alignItems: "flex-end" },
  checkRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 9, height: 9,
    border: "0.7pt solid #444",
    marginRight: 4,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  noteRow: {
    fontSize: 9, color: "#444",
    borderTop: "0.5pt dashed #aaa",
    paddingTop: 5, marginBottom: 6,
  },
  sigLine: { borderBottom: "0.5pt solid #555", width: "100%", marginBottom: 4, height: 4 },
  sigLabel: { fontSize: 10, fontWeight: 700 },
});

// ---- Constants ----
const ITEMS: ItemDef[] = [
  { key: "rent",     th: "ค่าเช่า",       en: "Rent" },
  { key: "water",    th: "ค่าน้ำประปา",   en: "Water" },
  { key: "electric", th: "ค่าไฟฟ้า",      en: "Electrical" },
  { key: "internet", th: "อินเตอร์เน็ต", en: "Internet" },
  { key: "fee",      th: "ค่าปรับ",        en: "Fee" },
  { key: "other",    th: "อื่นๆ",          en: "Other" },
];

// ---- Thai text helper ----
const t = (str: string) => str + "\u00A0";

// ---- FieldRow ----
interface FieldRowProps {
  label: string;
  sub?: string;
  value?: string;
  style?: Style;
}

const FieldRow: React.FC<FieldRowProps> = ({ label, sub, value = "", style }) => (
  <View style={style ? [s.fieldRow, style] : s.fieldRow}>
    <Text style={s.fieldLabel}>
      {label}
      {sub ? <Text style={s.fieldLabelSub}>{"\n" + sub}</Text> : null}
    </Text>
    <Text style={s.fieldLine}>{value}</Text>
  </View>
);

// ---- Helper: build itemMap from flat fields ----
function buildItemMap(data: ReceiptData) {
  return {
    rent:     { checked: !!data.rentChecked,     amount: data.rentAmount     ?? "" },
    water:    { checked: !!data.waterChecked,    amount: data.waterAmount    ?? "" },
    electric: { checked: !!data.electricChecked, amount: data.electricAmount ?? "" },
    internet: { checked: !!data.internetChecked, amount: data.internetAmount ?? "" },
    fee:      { checked: !!data.feeChecked,      amount: data.feeAmount      ?? "" },
    other:    { checked: !!data.otherChecked,    amount: data.otherAmount    ?? "" },
  };
}

// ---- Document ----
export const RentReceiptDoc: React.FC<{ data?: ReceiptData }> = ({ data = {} }) => {
  const {
    name = "", address = "", tel = "", date = "",
    room = "", month = "",
    waterMeterCurr = "", waterMeterPrev = "", waterMeterUsed = "",
    electricMeterCurr = "", electricMeterPrev = "", electricMeterUsed = "",
    receiver = "", bankName = "", accountName = "", accountNumber = "",
  } = data;

  const itemMap = buildItemMap(data);

  const meterCurr = ["", waterMeterCurr, electricMeterCurr];
  const meterPrev = ["", waterMeterPrev, electricMeterPrev];
  const meterUsed = ["", waterMeterUsed, electricMeterUsed];

  const total = ITEMS.reduce((sum, item) => {
    const entry = itemMap[item.key];
    return sum + (entry.checked ? parseFloat(entry.amount || "0") : 0);
  }, 0);

  const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 2 });

  return (
    <Document>
      <Page size="A5" style={s.page}>
        {/* Title */}
        <Text style={s.title}>{t("ใบเสร็จรับเงินค่าเช่า")}</Text>
        <Text style={s.subtitle}>{t("(RECEIPT)")}</Text>

        {/* Header */}
        <View style={s.headerGrid}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <FieldRow label={t("นาม")}    sub={t("NAME")}    value={t(name)}    style={s.halfLeft} />
            <FieldRow label={t("วันที่")} sub={t("DATE")}    value={t(date)}    style={s.halfRight} />
          </View>
          <FieldRow label={t("ที่อยู่")}  sub={t("ADDRESS")} value={t(address)} style={s.fullWidth} />
          <FieldRow label={t("เบอร์โทร")} sub={t("TEL")}     value={t(tel)}     style={{ width: "50%" }} />
        </View>

        {/* Room / Month */}
        <View style={s.roomRow}>
          <View style={[s.fieldRow, { flex: 1 }]}>
            <Text style={s.roomLabel}>{t("ห้องเช่าเลขที่")}</Text>
            <Text style={s.fieldLine}>{t(room)}</Text>
          </View>
          <View style={[s.fieldRow, { flex: 1 }]}>
            <Text style={s.roomLabel}>{t("ประจำเดือน")}</Text>
            <Text style={s.fieldLine}>{t(month)}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={s.table}>
          {/* Header row */}
          <View style={s.tableRow}>
            <Text style={[s.headerCell, s.colMeter]}>{t("จดครั้งหลัง")}</Text>
            <Text style={[s.headerCell, s.colMeter]}>{t("จดครั้งก่อน")}</Text>
            <Text style={[s.headerCell, s.colMeter]}>{t("หน่วยที่ใช้")}</Text>
            <Text style={[s.headerCell, s.colItem]}>{t("รายการ")}</Text>
            <Text style={[s.headerCell, s.colAmount]}>{t("จำนวนเงิน") + "\n" + t("(บาท)")}</Text>
          </View>

          {/* Item rows */}
          {ITEMS.map((item, idx) => {
            const entry = itemMap[item.key];
            return (
              <View style={s.tableRow} key={item.key}>
                <Text style={[s.cell, s.colMeter]}>{t(idx <= 2 ? (meterCurr[idx] ?? "") : "")}</Text>
                <Text style={[s.cell, s.colMeter]}>{t(idx <= 2 ? (meterPrev[idx] ?? "") : "")}</Text>
                <Text style={[s.cell, s.colMeter]}>{t(idx <= 2 ? (meterUsed[idx] ?? "") : "")}</Text>
                <View style={[s.cell, s.colItem]}>
                  <View style={s.checkRow}>
                    <View style={s.checkbox}>
                      {entry.checked && (
                        <View style={{
                          width: 5, height: 3,
                          borderBottom: "1.5pt solid #2d6a4f",
                          borderLeft: "1.5pt solid #2d6a4f",
                          transform: "rotate(-45deg)",
                          marginTop: -1,
                        }} />
                      )}
                    </View>
                    <Text style={{ fontSize: 9 }}>{t(item.th) + "/" + t(item.en)}</Text>
                  </View>
                </View>
                <Text style={[s.cell, s.colAmount]}>
                  {entry.checked && entry.amount ? t(fmt(parseFloat(entry.amount))) : ""}
                </Text>
              </View>
            );
          })}

          {/* Total row */}
          <View style={s.tableRow}>
            <Text style={[s.totalCell, { width: "39%", textAlign: "right" }]}>{t("รวมเป็นเงิน (บาท)")}</Text>
            <Text style={[s.totalCell, { width: "47%" }]}>{t(" ")}</Text>
            <Text style={[s.totalCell, s.colAmount]}>{total > 0 ? t(fmt(total)) : ""}</Text>
          </View>
        </View>

        {/* Note */}
        <Text style={s.noteRow}>{t("ผู้เช่าจะต้องชำระเงินไม่เกินวันที่ 1-5 ของทุกเดือน")}</Text>

        {/* Bottom: Payment + Signature */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 }}>
          {/* ช่องทางการชำระเงิน */}
          <View style={{ width: "50%" }}>
            <Text style={{ fontSize: 10, fontWeight: 700, marginBottom: 5 }}>{t("ช่องทางการชำระเงิน")}</Text>
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 5 }}>
              <Text style={{ fontSize: 9, fontWeight: 700, width: 52 }}>{t("ธนาคาร :")}</Text>
              <Text style={s.fieldLine}>{t(bankName)}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 5 }}>
              <Text style={{ fontSize: 9, fontWeight: 700, width: 52 }}>{t("ชื่อบัญชี :")}</Text>
              <Text style={s.fieldLine}>{t(accountName)}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 5 }}>
              <Text style={{ fontSize: 9, fontWeight: 700, width: 52 }}>{t("เลขบัญชี :")}</Text>
              <Text style={s.fieldLine}>{t(accountNumber)}</Text>
            </View>
          </View>

          {/* Signature */}
          <View style={{ width: "35%", alignItems: "center" }}>
            <Text style={{ fontSize: 10 }}>{t(receiver)}</Text>
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>{t("ผู้รับเงิน Receiver")}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// ---- Excel export ----
function exportToExcel(data: ReceiptData) {
  const {
    name = "", address = "", tel = "", date = "",
    room = "", month = "",
    waterMeterCurr = "", waterMeterPrev = "", waterMeterUsed = "",
    electricMeterCurr = "", electricMeterPrev = "", electricMeterUsed = "",
    receiver = "", bankName = "", accountName = "", accountNumber = "",
  } = data;

  const itemMap = buildItemMap(data);

  const meterCurr = ["", waterMeterCurr, electricMeterCurr];
  const meterPrev = ["", waterMeterPrev, electricMeterPrev];
  const meterUsed = ["", waterMeterUsed, electricMeterUsed];

  const ITEMS_DEF: { key: keyof typeof itemMap; th: string }[] = [
    { key: "rent",     th: "ค่าเช่า / Rent" },
    { key: "water",    th: "ค่าน้ำประปา / Water" },
    { key: "electric", th: "ค่าไฟฟ้า / Electrical" },
    { key: "internet", th: "อินเตอร์เน็ต / Internet" },
    { key: "fee",      th: "ค่าปรับ / Fee" },
    { key: "other",    th: "อื่นๆ / Other" },
  ];

  const total = ITEMS_DEF.reduce((sum, item) => {
    const entry = itemMap[item.key];
    return sum + (entry.checked ? parseFloat(entry.amount || "0") : 0);
  }, 0);

  const rows: (string | number)[][] = [
    ["ใบเสร็จรับเงินค่าเช่า (RECEIPT)"],
    [],
    ["ชื่อ", name],
    ["ที่อยู่", address],
    ["เบอร์โทร", tel],
    ["วันที่", date],
    ["ห้องเช่าเลขที่", room],
    ["ประจำเดือน", month],
    [],
    ["รายการ", "จดครั้งหลัง", "จดครั้งก่อน", "หน่วยที่ใช้", "จำนวนเงิน (บาท)"],
  ];

  ITEMS_DEF.forEach((item, idx) => {
    const entry = itemMap[item.key];
    rows.push([
      entry.checked ? "✓ " + item.th : item.th,
      idx <= 2 ? (meterCurr[idx] ?? "") : "",
      idx <= 2 ? (meterPrev[idx] ?? "") : "",
      idx <= 2 ? (meterUsed[idx] ?? "") : "",
      entry.checked && entry.amount ? parseFloat(entry.amount) : "",
    ]);
  });

  rows.push([]);
  rows.push(["รวมเป็นเงิน (บาท)", "", "", "", total]);
  rows.push([]);
  rows.push(["ผู้เช่าจะต้องชำระเงินไม่เกินวันที่ 1-5 ของทุกเดือน"]);
  rows.push([]);
  rows.push(["ช่องทางการชำระเงิน"]);
  rows.push(["ธนาคาร", bankName]);
  rows.push(["ชื่อบัญชี", accountName]);
  rows.push(["เลขบัญชี", accountNumber]);
  rows.push([]);
  rows.push(["ผู้รับเงิน (Receiver)", receiver]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 18 }];
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: rows.length - 6, c: 0 }, e: { r: rows.length - 6, c: 4 } },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ใบเสร็จ");
  XLSX.writeFile(wb, `rent-receipt-${room}-${month}.xlsx`);
}

// ---- PDFLoader ----
interface PDFLoaderProps {
  Data: ReceiptData;
}

export default function PDFLoader({ Data }: PDFLoaderProps) {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>ใบเสร็จรับเงินค่าเช่า — Preview</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <PDFDownloadLink
          document={<RentReceiptDoc data={Data} />}
          fileName="rent-receipt.pdf"
          style={{
            background: "#2d6a4f", color: "white",
            padding: "8px 20px", borderRadius: 6,
            textDecoration: "none", fontWeight: 600, display: "inline-block",
          }}
        >
          {({ loading }: { loading: boolean }) =>
            loading ? "กำลังสร้าง..." : "⬇️ ดาวน์โหลด PDF"
          }
        </PDFDownloadLink>

        <button
          onClick={() => exportToExcel(Data)}
          style={{
            background: "#217346", color: "white",
            padding: "8px 20px", borderRadius: 6,
            border: "none", fontWeight: 600, cursor: "pointer", fontSize: 14,
          }}
        >
          📊 ดาวน์โหลด Excel
        </button>
      </div>

      <PDFViewer style={{ width: "100%", height: "85vh", marginTop: 12, border: "1px solid #ccc" }}>
        <RentReceiptDoc data={Data} />
      </PDFViewer>
    </div>
  );
}