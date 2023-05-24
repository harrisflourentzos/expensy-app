import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import { ManageExpenseStackScreenProps } from "../navigation/types";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { IExpense, IExpenseItem } from "../model/expense";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageExpense({ route, navigation }: ManageExpenseStackScreenProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const expensesCtx = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;
  const expense = expensesCtx.expenses.find((e) => e.id === editedExpenseId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsFetching(true);
    try {
      await deleteExpense(editedExpenseId);
      expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (e: any) {
      setError(e.any);
      setIsFetching(false);
    }
  }

  async function confirmHandler(expense: IExpense) {
    setIsFetching(true);
    if (isEditing) {
      try {
        await updateExpense(editedExpenseId, expense);
        expensesCtx.updateExpense(editedExpenseId, expense);
        navigation.goBack();
      } catch (e: any) {
        setError("Could not save changes to database!" + "\n" + e?.message);
      }
    } else {
      try {
        const id = await storeExpense(expense);
        expensesCtx.addExpense({ ...expense, id: id } as IExpenseItem);
        navigation.goBack();
      } catch (e: any) {
        setError("Could no save expense to database!" + "\n" + e?.message);
      }
    }
    setIsFetching(false);
  }

  function cancelHandler() {
    navigation.goBack();
  }

  function acknowledgeError() {
    setError("");
    navigation.goBack();
  }

  if (error && !isFetching)
    return <ErrorOverlay message={error} onConfirm={acknowledgeError} />;

  if (isFetching) return <LoadingOverlay />;

  return (
    <View style={styles.container}>
      <ExpenseForm
        isEditing={isEditing}
        editingExpense={expense}
        onConfirm={confirmHandler}
        onCancel={cancelHandler}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
