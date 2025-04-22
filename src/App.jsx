import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Balance from './components/Balance.jsx'
import Summary from './components/Summary.jsx'
import TransactionList from './components/TransactionList.jsx'
import AddTransaction from './components/AddTransaction.jsx'
import Chart from './components/Chart.jsx'
import { useExpenseContext } from './context/ExpenseContext.jsx'
import './styles/App.css'

function App() {
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [editTransaction, setEditTransaction] = useState(null)
  const { darkMode } = useExpenseContext()

  const toggleAddTransaction = () => {
    setShowAddTransaction(!showAddTransaction)
    setEditTransaction(null)
  }

  const handleEditTransaction = (transaction) => {
    setEditTransaction(transaction)
    setShowAddTransaction(true)
  }

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="content-wrapper">
        <Header toggleAddTransaction={toggleAddTransaction} />
        
        <main className="main-content">
          <div className="top-section">
            <Balance />
            <Summary />
          </div>
          
          <div className="middle-section">
            <Chart />
          </div>
          
          <div className="bottom-section">
            <TransactionList onEditTransaction={handleEditTransaction} />
          </div>
        </main>
        
        {showAddTransaction && (
          <AddTransaction 
            onClose={toggleAddTransaction} 
            editTransaction={editTransaction}
          />
        )}
      </div>
    </div>
  )
}

export default App