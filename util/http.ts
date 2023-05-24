import axios from "axios";
import { IExpense, IExpenseItem } from "../model/expense";

const FIREBASE_URL = "https://learningreact-4a2be-default-rtdb.firebaseio.com/";

export async function storeExpense(expenseData: IExpense) {
  const url = FIREBASE_URL + "expenses.json";
  const response = await axios.post(url, expenseData);
  return response.data.name;
}

export async function fetchAllExpenses() {
  const url = FIREBASE_URL + "expenses.json";
  const response = await axios.get(url);

  const expenses: IExpenseItem[] = [];

  for (const key in response.data) {
    const expenseData = response.data[key];

    const expense: IExpenseItem = {
      id: key,
      amount: parseInt(expenseData.amount),
      description: expenseData.description,
      date: new Date(expenseData.date),
    };

    expenses.push(expense);
  }

  return expenses;
}

export function updateExpense(id: string, expenseData: IExpense) {
  const url = FIREBASE_URL + `expenses/${id}.json`;
  return axios.put(url, expenseData);
}

export function deleteExpense(id: string) {
  const url = FIREBASE_URL + `expenses/${id}.json`;
  return axios.delete(url);
}
