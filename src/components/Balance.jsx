import { useMemo } from 'react'
import { useExpenseContext } from '../context/ExpenseContext.jsx'
import { formatCurrency } from '../utils/formatters.jsx'
import '../styles/Balance.css'

const Balance = () => {
  const { transactions } = useExpenseContext()

  const balance = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      return transaction.type === 'income' 
        ? acc + transaction.amount 
        : acc - transaction.amount
    }, 0)
  }, [transactions])

  return (
    <div className={`balance-container ${balance < 0 ? 'negative' : 'positive'}`}>
      <h2 className="balance-title">Current Balance</h2>
      <div className="balance-amount">{formatCurrency(balance)}</div>
    </div>
  )
}

export default Balance