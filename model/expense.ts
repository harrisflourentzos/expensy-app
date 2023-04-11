export interface IExpenseItem extends IExpense {
  id: string;
}

export interface IExpense {
  description: string;
  amount: number;
  date: Date;
}
