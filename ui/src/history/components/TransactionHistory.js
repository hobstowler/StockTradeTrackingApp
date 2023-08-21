import {useEffect, useState} from "react";
import TransactionSummary from "./TransactionSummary";
import TransactionCard from "./TransactionCard";

export default function TransactionHistory({symbol, activeAccount}) {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getTransactions()
  }, [symbol])

  const getTransactions = () => {
    fetch(`/account/${activeAccount.accountId || ""}/transactions`)
  }

  const summarizeTransactions = () => {

  }

  return (
    <div>
      <TransactionSummary transactions={transactions} />
      {transactions.map((transaction, i) => <TransactionCard transaction={transaction} key={i} />)}
    </div>
  )
}