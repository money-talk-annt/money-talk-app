import { GetTransaction } from "../../database/repository/transaction";

export type FilterType = "all" | "income" | "expense";

export interface TransactionGroup {
  title: string;
  dateKey: string;
  data: GetTransaction[];
  dayIncome: number;
  dayExpense: number;
}

export interface HistorySummary {
  totalIncome: number;
  totalExpense: number;
  net: number;
}
