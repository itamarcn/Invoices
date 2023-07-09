import Invoice from "../models/invoice";

const API_BASE_URL = "https://localhost:7113";

export const getInvoices = async (): Promise<Invoice[]> => {
  const response = await fetch(`${API_BASE_URL}/invoices`);
  if (response.status === 204) {
    console.log("no data");
    return [];
  } else {
    const data = await response.json();
    return data;
  }
};

export const createInvoice = async (
  invoice: Partial<Invoice>
): Promise<void> => {
  delete invoice.user;
  await fetch(`${API_BASE_URL}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoice),
  });
};

export const updateInvoice = async (
  invoice: Partial<Invoice>
): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}/invoices/${invoice.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoice),
  });
  const data = await response.json();
  return data;
};

export const deleteInvoice = async (invoiceId: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
    method: "DELETE",
  });
};
