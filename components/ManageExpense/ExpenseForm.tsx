import { Text, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Input from "./Input";
import { IExpense, IExpenseItem } from "../../model/expense";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

type Props = {
  isEditing: boolean;
  editingExpense?: IExpenseItem;
  onConfirm: (expense: IExpense) => void;
  onCancel: () => void;
};

enum InputType {
  amount = "amount",
  date = "date",
  desc = "description",
}

interface IInput {
  [InputType.amount]: { value: string; isValid: boolean };
  [InputType.date]: { value: string; isValid: boolean };
  [InputType.desc]: { value: string; isValid: boolean };
}

const ExpenseForm = ({
  isEditing,
  editingExpense,
  onCancel,
  onConfirm,
}: Props) => {
  const Initial_State = {
    amount: {
      value: editingExpense ? editingExpense?.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: editingExpense ? getFormattedDate(editingExpense?.date) : "",
      isValid: true,
    },
    description: {
      value: editingExpense ? editingExpense?.description : "",
      isValid: true,
    },
  } as IInput;

  const [input, setInput] = useState<IInput>(Initial_State);

  function updateExpenseInput(
    updateId: InputType.amount | InputType.date | InputType.desc,
    update: string
  ) {
    setInput((e) => {
      return { ...e, [updateId]: { value: update, isValid: true } };
    });
  }

  function confirmHandler() {
    const amount = parseInt(input.amount.value);
    const date = new Date(input.date.value);
    const description = input.description.value.trim();

    // check validity
    const amountIsValid = !isNaN(amount) && amount > 0;
    const dateIsValid = date.toString() !== "Invalid Date";
    const descriptionIsValid = description.length > 0;

    // update validity
    setInput((e) => {
      return {
        amount: { value: input.amount.value, isValid: amountIsValid },
        date: { value: input.date.value, isValid: dateIsValid },
        description: {
          value: input.description.value,
          isValid: descriptionIsValid,
        },
      };
    });

    if (!(amountIsValid && dateIsValid && descriptionIsValid)) return;

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
            onChangeText: (text: string) =>
              updateExpenseInput(InputType.amount, text),
            value: input.amount.value,
          }}
          isValid={input.amount.isValid}
        />
        <Input
          style={styles.rowInput}
          label="Date"
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: (text: string) =>
              updateExpenseInput(InputType.date, text),
            value: input.date.value,
          }}
          isValid={input.date.isValid}
        />
      </View>
      <Input
        label="Description"
        textInputConfig={{
          multiline: true,
          autoCorrect: false,
          onChangeText: (text: string) =>
            updateExpenseInput(InputType.desc, text),
          value: input.description.value,
        }}
        isValid={input.description.isValid}
      />
      {!(
        input.amount.isValid &&
        input.date.isValid &&
        input.description.isValid
      ) && (
        <View>
          <Text style={styles.errorText}>Some of your inputs are invalid!</Text>
        </View>
      )}
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
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  errorText: {
    marginTop: 10,
    textAlign: "center",
    color: GlobalStyles.colors.error500,
  },
});
