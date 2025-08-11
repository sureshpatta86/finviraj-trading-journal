import * as React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie'
  data: any
  options?: any
  className?: string
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ type, data, options = {}, className, ...props }, ref) => {
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
      },
      scales: type === 'doughnut' || type === 'pie' ? undefined : {
        y: {
          beginAtZero: true,
        },
      },
      ...options,
    }

    const renderChart = () => {
      switch (type) {
        case 'line':
          return <Line data={data} options={defaultOptions} />
        case 'bar':
          return <Bar data={data} options={defaultOptions} />
        case 'doughnut':
          return <Doughnut data={data} options={defaultOptions} />
        case 'pie':
          return <Pie data={data} options={defaultOptions} />
        default:
          return <Line data={data} options={defaultOptions} />
      }
    }

    return (
      <div ref={ref} className={className} {...props}>
        {renderChart()}
      </div>
    )
  }
)

Chart.displayName = 'Chart'

export { Chart }
