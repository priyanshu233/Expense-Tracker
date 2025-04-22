import { createContext, useContext, useReducer, useEffect, useState } from 'react'

// Initial state
const initialState = {
  transactions: [],
  categories: [
    { id: 'food', name: 'Food & Dining', icon: '🍔' },
    { id: 'transportation', name: 'Transportation', icon: '🚗' },
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'utilities', name: 'Utilities', icon: '💡' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'personal', name: 'Personal', icon: '👤' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'income', name: 'Income', icon: '💰' },
    { id: 'other', name: 'Other', icon: '📦' }
  ]
}

// Create context
const ExpenseContext = createContext()

// Reducer
const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transaction.id !== action.payload
        )
      }
    case 'EDIT_TRANSACTION': 
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id ? action.payload : transaction
        )
      }
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload
      }
    default:
      return state
  }
}

// Provider component
export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState)
  const [darkMode, setDarkMode] = useState(false)
  
  // Load transactions from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    const savedDarkMode = localStorage.getItem('darkMode')
    
    if (savedTransactions) {
      dispatch({ 
        type: 'SET_TRANSACTIONS', 
        payload: JSON.parse(savedTransactions) 
      })
    }
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions))
  }, [state.transactions])
  
  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Get category by ID
  const getCategoryById = (categoryId) => {
    return state.categories.find(category => category.id === categoryId) || 
      state.categories.find(category => category.id === 'other')
  }

  return (
    <ExpenseContext.Provider value={{
      transactions: state.transactions,
      categories: state.categories,
      darkMode,
      dispatch,
      toggleDarkMode,
      getCategoryById
    }}>
      {children}
    </ExpenseContext.Provider>
  )
}

// Custom hook to use the expense context
export const useExpenseContext = () => {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider')
  }
  return context
}