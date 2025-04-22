import { useMemo } from 'react'
import { useExpenseContext } from '../context/ExpenseContext.jsx'
import { formatCurrency } from '../utils/formatters.jsx'
import '../styles/Summary.css'

const Summary = () => {
  const { transactions } = useExpenseContext()

  const summary = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount
      } else {
        acc.expense += transaction.amount
      }
      return acc
    }, { income: 0, expense: 0 })
  }, [transactions])

  return (
    <div className="summary-container">
      <div className="summary-item income">
        <h3 className="summary-title">Income</h3>
        <p className="summary-amount">{formatCurrency(summary.income)}</p>
      </div>
      
      <div className="summary-divider"></div>
      
      <div className="summary-item expense">
        <h3 className="summary-title">Expenses</h3>
        <p className="summary-amount">{formatCurrency(summary.expense)}</p>
      </div>
    </div>
  )
}

export default Summary