export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date | string;
}

export interface WeekData {
  weekNumber: number;
  weekLabel: string;
  total: number;
  topCategory: string;
  expenses: Expense[];
}