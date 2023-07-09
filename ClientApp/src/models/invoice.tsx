import User from "./user";

interface Invoice {
  id: string;
  userId?: string;
  user?: User;
  date: string;
  status: number | string;
  item: string;
  amount: number;
}

export default Invoice;