import { useExpenseContext } from '../context/ExpenseContext.jsx'
import { FiPlus, FiMoon, FiSun } from 'react-icons/fi'
import '../styles/Header.css'

const Header = ({ toggleAddTransaction }) => {
  const { darkMode, toggleDarkMode } = useExpenseContext()

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">Expense Tracker</h1>
        
        <div className="header-actions">
          <button 
            className="icon-button theme-toggle" 
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          
          <button 
            className="add-button"
            onClick={toggleAddTransaction}
            aria-label="Add new transaction"
          >
            <FiPlus />
            <span>Add New</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header