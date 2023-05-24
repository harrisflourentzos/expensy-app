import { useContext, useEffect, useState } from "react";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchAllExpenses } from "../util/http";
import { IExpenseItem } from "../model/expense";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenses() {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const expensesCtx = useContext(ExpensesContext);

  async function getAllExpenses() {
    setIsFetching(true);
    try {
      const expenses = await fetchAllExpenses();
      expensesCtx.setExpenses(expenses);
    } catch (e: any) {
      setError(
        "Could not fetch recent expenses from database!" + "\n" + e.message
      );
    }
    setIsFetching(false);
  }

  useEffect(() => {
    getAllExpenses();
  }, []);

  function acknowledgeError() {
    setError("");
    getAllExpenses();
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return expense.date >= date7DaysAgo && expense.date <= today;
  });

  if (error && !isFetching)
    return <ErrorOverlay message={error} onConfirm={acknowledgeError} />;

  if (isFetching) return <LoadingOverlay />;

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 Days"
      fallbackText="No expenses registered for the last 7 days."
    />
  );
}

export default RecentExpenses;
