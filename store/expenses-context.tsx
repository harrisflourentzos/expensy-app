import { createContext, useReducer } from "react";
import { IExpense, IExpenseItem } from "../model/expense";

enum ActionType {
  SET = "SET",
  ADD = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

type Action =
  | { type: ActionType.SET; data: { expenses: IExpenseItem[] } }
  | {
      type: ActionType.ADD;
      data: { expense: IExpenseItem };
    }
  | { type: ActionType.DELETE; data: { id: string } }
  | {
      type: ActionType.UPDATE;
      data: { id: string; updateExpense: IExpense };
    };

function expensesReducer(state: IExpenseItem[], action: Action) {
  const { type, data } = action;

  switch (type) {
    case ActionType.SET:
      return [...data.expenses];
    case ActionType.ADD:
      return [data.expense, ...state];
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

type ExpensesContextType = {
  expenses: IExpenseItem[];
  setExpenses: (expenses: IExpenseItem[]) => void;
  addExpense: (expense: IExpenseItem) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, updateExpense: IExpense) => void;
};

const INITIAL_STATE: ExpensesContextType = {
  expenses: [] as IExpenseItem[],
  setExpenses: (expenses) => {},
  addExpense: (expense) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, updateExpense) => {},
};

export const ExpensesContext =
  createContext<ExpensesContextType>(INITIAL_STATE);

function ExpensesContextProvider({ children }: { children: JSX.Element }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  function setExpenses(expenses: IExpenseItem[]) {
    dispatch({ type: ActionType.SET, data: { expenses: expenses } });
  }

  function addExpense(expenseData: IExpenseItem) {
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
    setExpenses: setExpenses,
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
