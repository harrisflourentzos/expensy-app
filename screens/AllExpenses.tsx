import { useContext, useEffect, useState } from "react";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-context";
import { fetchAllExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function AllExpenses() {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const expensesCtx = useContext(ExpensesContext);

  async function getAllExpenses() {
    setIsFetching(true);
    try {
      const expenses = await fetchAllExpenses();
      expensesCtx.setExpenses(expenses);
    } catch (e: any) {
      setError("Could not fetch expenses from database!" + "\n" + e.message);
    }
    setIsFetching(false);
  }

  function acknowledgeError() {
    setError("");
    getAllExpenses();
  }

  useEffect(() => {
    getAllExpenses();
  }, []);

  if (error && !isFetching)
    return <ErrorOverlay message={error} onConfirm={acknowledgeError} />;

  if (isFetching) return <LoadingOverlay />;

  return (
    <ExpensesOutput
      expenses={expensesCtx.expenses}
      expensesPeriod="Total"
      fallbackText="No registered expenses found!"
    />
  );
}

export default AllExpenses;
