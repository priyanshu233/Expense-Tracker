import { useMemo } from 'react'
import { useExpenseContext } from '../context/ExpenseContext.jsx'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import '../styles/Chart.css'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

const Chart = () => {
  const { transactions, getCategoryById } = useExpenseContext()

  // Prepare chart data
  const chartData = useMemo(() => {
    // Only include expenses in chart
    const expenses = transactions.filter(t => t.type === 'expense')
    
    if (expenses.length === 0) {
      return null
    }
    
    // Group expenses by category
    const categoryTotals = expenses.reduce((acc, transaction) => {
      const { category, amount } = transaction
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += amount
      return acc
    }, {})
    
    // Extract sorted categories
    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)  // Top 5 categories
    
    // Default colors
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
    ]
    
    // Prepare for chart.js
    const labels = sortedCategories.map(([catId]) => getCategoryById(catId).name)
    const data = sortedCategories.map(([_, amount]) => amount)
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    }
  }, [transactions, getCategoryById])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: $${value.toFixed(2)} (${percentage}%)`
          }
        }
      }
    }
  }

  return (
    <div className="chart-container">
      <h2 className="chart-title">Expense Breakdown</h2>
      <div className="chart-content">
        {chartData ? (
          <div className="chart-wrapper">
            <Doughnut data={chartData} options={options} />
          </div>
        ) : (
          <div className="no-data">
            <p>Add expenses to see spending breakdown</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chart