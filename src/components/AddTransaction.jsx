import { useState, useEffect } from 'react'
import { useExpenseContext } from '../context/ExpenseContext.jsx'
import { FiX } from 'react-icons/fi'
import '../styles/AddTransaction.css'

const AddTransaction = ({ onClose, editTransaction }) => {
  const { dispatch, categories } = useExpenseContext()
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  })
  const [error, setError] = useState('')
  const isEditing = !!editTransaction

  // If editing, populate form with transaction data
  useEffect(() => {
    if (editTransaction) {
      setFormData({
        description: editTransaction.description,
        amount: editTransaction.amount.toString(),
        type: editTransaction.type,
        category: editTransaction.category,
        date: new Date(editTransaction.date).toISOString().split('T')[0]
      })
    }
  }, [editTransaction])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validate form
    if (!formData.description.trim()) {
      setError('Please enter a description')
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    const transactionData = {
      id: isEditing ? editTransaction.id : Date.now().toString(),
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: new Date(formData.date).toISOString()
    }

    if (isEditing) {
      dispatch({
        type: 'EDIT_TRANSACTION',
        payload: transactionData
      })
    } else {
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: transactionData
      })
    }

    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>
        
        <form className="transaction-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="type">Transaction Type</label>
            <div className="type-selector">
              <label className={`type-option ${formData.type === 'expense' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                />
                <span>Expense</span>
              </label>
              <label className={`type-option ${formData.type === 'income' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                />
                <span>Income</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What was this for?"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories
                .filter(cat => formData.type === 'income' ? cat.id === 'income' : cat.id !== 'income')
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))
              }
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          
          <button type="submit" className="submit-button">
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddTransaction