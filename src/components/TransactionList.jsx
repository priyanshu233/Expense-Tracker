import { useState, useMemo } from 'react'
import { useExpenseContext } from '../context/ExpenseContext.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.jsx'
import { FiEdit2, FiTrash2, FiFilter } from 'react-icons/fi'
import '../styles/TransactionList.css'

const TransactionList = ({ onEditTransaction }) => {
  const { transactions, dispatch, getCategoryById } = useExpenseContext()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesType = filter === 'all' || transaction.type === filter
      const matchesSearch = transaction.description.toLowerCase().includes(search.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [transactions, filter, search])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      })
    }
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="transaction-list-container">
      <div className="transaction-list-header">
        <h2 className="transaction-list-title">Transactions</h2>
        <button 
          className="filter-toggle-button"
          onClick={toggleFilters}
          aria-label="Toggle filters"
        >
          <FiFilter />
          <span>Filter</span>
        </button>
      </div>

      {showFilters && (
        <div className="filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-button ${filter === 'income' ? 'active' : ''}`}
              onClick={() => setFilter('income')}
            >
              Income
            </button>
            <button 
              className={`filter-button ${filter === 'expense' ? 'active' : ''}`}
              onClick={() => setFilter('expense')}
            >
              Expenses
            </button>
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found</p>
        </div>
      ) : (
        <ul className="transaction-list">
          {filteredTransactions.map(transaction => {
            const category = getCategoryById(transaction.category)
            
            return (
              <li 
                key={transaction.id} 
                className={`transaction-item ${transaction.type}`}
              >
                <div className="transaction-icon">
                  {category.icon}
                </div>
                
                <div className="transaction-details">
                  <div className="transaction-top">
                    <h3 className="transaction-description">{transaction.description}</h3>
                    <p className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  
                  <div className="transaction-bottom">
                    <div className="transaction-meta">
                      <span className="transaction-category">{category.name}</span>
                      <span className="transaction-date">{formatDate(transaction.date)}</span>
                    </div>
                    
                    <div className="transaction-actions">
                      <button 
                        className="transaction-action edit"
                        onClick={() => onEditTransaction(transaction)}
                        aria-label="Edit transaction"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="transaction-action delete"
                        onClick={() => handleDelete(transaction.id)}
                        aria-label="Delete transaction"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default TransactionList