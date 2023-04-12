import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Input from "./Input";
import { IExpense, IExpenseItem } from "../../model/expense";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";

type Props = {
  isEditing: boolean;
  editingExpense?: IExpenseItem;
  onConfirm: (expense: IExpense) => void;
  onCancel: () => void;
};

enum ExpenseUpdateType {
  amount = "amount",
  date = "date",
  description = "description",
}

interface IExpenseUpdate {
  [ExpenseUpdateType.amount]: string;
  [ExpenseUpdateType.date]: string;
  [ExpenseUpdateType.description]: string;
}

const ExpenseForm = ({
  isEditing,
  editingExpense,
  onCancel,
  onConfirm,
}: Props) => {
  const Initial_State = {
    amount: editingExpense ? editingExpense?.amount.toString() : "",
    date: editingExpense ? getFormattedDate(editingExpense?.date) : "",
    description: editingExpense ? editingExpense?.description : "",
  } as IExpenseUpdate;

  const [expenseUpdate, setExpenseUpdate] =
    useState<IExpenseUpdate>(Initial_State);

  function updateExpense(updateId: string, update: string) {
    setExpenseUpdate((e) => {
      return { ...e, [updateId]: update };
    });
  }

  function confirmHandler() {
    const amount = parseInt(expenseUpdate.amount);
    const date = new Date(expenseUpdate.date);
    const description = expenseUpdate.description;

    // Todo: VALIDATION

    const expense = {
      amount: amount,
      date: date,
      description: description,
    } as IExpense;

    onConfirm(expense);
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.rowInputs}>
        <Input
          style={styles.rowInput}
          label="Amount"
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: updateExpense.bind(this, ExpenseUpdateType.amount),
            value: expenseUpdate.amount,
          }}
        />
        <Input
          style={styles.rowInput}
          label="Date"
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: updateExpense.bind(this, ExpenseUpdateType.date),
            value: expenseUpdate.date,
          }}
        />
      </View>
      <Input
        label="Description"
        textInputConfig={{
          multiline: true,
          autoCorrect: false,
          onChangeText: updateExpense.bind(this, ExpenseUpdateType.description),
          value: expenseUpdate.description,
        }}
      />
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={confirmHandler}>
          {isEditing ? "Update" : "Add"}
        </Button>
      </View>
    </View>
  );
};

export default ExpenseForm;

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 100,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
