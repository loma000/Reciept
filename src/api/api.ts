import type { ReceiptData } from "../Props/types";

export const API_BASE = import.meta.env.VITE_API_URL;

export const api = {
  signUp: async (username: string, password: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });
    if (res.ok) {
      const data = await res.json();
      return String(data.id);
    }
    throw new Error("sign in fails");
  },

  login: async (username: string, password: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.id;
    }
    throw new Error("log in fails");
  },

  fetchReceipt: async (id: number): Promise<ReceiptData[]> => {
    const res = await fetch(`${API_BASE}/receipt/fetch/${id}`);
    if (res.ok) {
      const data = await res.json();
      console.log(data);

      return data;
    }
    throw new Error("error fetch data");
  },
  addReceipt: async (id: number, receipt: ReceiptData): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/receipt/add/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(receipt),
    });
    console.log(receipt);

    return res.ok;
  },
  deleteReceipt: async (
    userId: number,
    receiptId: number,
  ): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/receipt/delete/${userId}/${receiptId}`, {
      method: "DELETE",
    });
    return res.ok;
  },
  editReceipt: async (
    id: number,
    newReceipt: ReceiptData,
  ): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/receipt/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReceipt),
    });
    console.log(newReceipt);
    
    return res.ok;
  },
};
