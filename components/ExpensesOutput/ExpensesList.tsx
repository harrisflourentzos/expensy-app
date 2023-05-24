import { FlatList } from "react-native";

import ExpenseItem from "./ExpenseItem";
import { IExpenseItem } from "../../model/expense";

type Props = { expenses: IExpenseItem[] };

function renderExpenseItem(expense: IExpenseItem) {
  return <ExpenseItem {...expense} />;
}

function ExpensesList({ expenses }: Props) {
  return (
    <FlatList
      data={expenses}
      renderItem={({ item }) => renderExpenseItem(item)}
      keyExtractor={(item) => item.id}
    />
  );
}

export default ExpensesList;
