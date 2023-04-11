import { createContext, useReducer } from "react";
import { IExpense, IExpenseItem } from "../model/expense";

const DUMMY_EXPENSES: IExpenseItem[] = [
  {
    id: "e1",
    description: "A pair of shoes",
    amount: 59.99,
    date: new Date("2021-12-19"),
  },
  {
    id: "e2",
    description: "A pair of trousers",
    amount: 89.29,
    date: new Date("2022-01-05"),
  },
  {
    id: "e3",
    description: "Some bananas",
    amount: 5.99,
    date: new Date("2021-12-01"),
  },
  {
    id: "e4",
    description: "A book",
    amount: 14.99,
    date: new Date("2022-02-19"),
  },
  {
    id: "e5",
    description: "Another book",
    amount: 18.59,
    date: new Date("2022-02-18"),
  },
  {
    id: "e6",
    description: "A pair of trousers",
    amount: 89.29,
    date: new Date("2022-01-05"),
  },
  {
    id: "e7",
    description: "Some bananas",
    amount: 5.99,
    date: new Date("2021-12-01"),
  },
  {
    id: "e8",
    description: "A book",
    amount: 14.99,
    date: new Date("2022-02-19"),
  },
  {
    id: "e9",
    description: "Another book",
    amount: 18.59,
    date: new Date("2022-02-18"),
  },
];

type ExpensesContextType = {
  expenses: IExpenseItem[];
  addExpense: (expense: IExpense) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, updateExpense: IExpense) => void;
};

const INITIAL_STATE: ExpensesContextType = {
  expenses: [] as IExpenseItem[],
  addExpense: (expense) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, updateExpense) => {},
};

export const ExpensesContext =
  createContext<ExpensesContextType>(INITIAL_STATE);

enum ActionType {
  ADD = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

type Action =
  | {
      type: ActionType.ADD;
      data: { expense: IExpense };
    }
  | { type: ActionType.DELETE; data: { id: string } }
  | { type: ActionType.UPDATE; data: { id: string; updateExpense: IExpense } };

function expensesReducer(state: IExpenseItem[], action: Action) {
  const { type, data } = action;

  switch (type) {
    case ActionType.ADD:
      const id = new Date().toString() + Math.random().toString();

      return [{ ...data.expense, id: id }, ...state];
    case ActionType.UPDATE:
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === data.id
      );
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...data.updateExpense };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;

      return updatedExpenses;
    case ActionType.DELETE:
      return state.filter((expense) => expense.id !== data.id);
    default:
      return state;
  }
}

function ExpensesContextProvider({ children }: { children: JSX.Element }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, DUMMY_EXPENSES);

  function addExpense(expenseData: IExpense) {
    dispatch({ type: ActionType.ADD, data: { expense: expenseData } });
  }

  function deleteExpense(id: string) {
    dispatch({ type: ActionType.DELETE, data: { id: id } });
  }

  function updateExpense(id: string, expenseData: IExpense) {
    dispatch({
      type: ActionType.UPDATE,
      data: { id: id, updateExpense: expenseData },
    });
  }

  const value: ExpensesContextType = {
    expenses: expensesState,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
