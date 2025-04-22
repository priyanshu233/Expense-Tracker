import { format } from 'date-fns'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return format(date, 'MMM d, yyyy')
}