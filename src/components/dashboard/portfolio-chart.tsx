'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Mock data - replace with real data from your store/API
const mockChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  datasets: [
    {
      label: 'Portfolio Value',
      data: [100000, 105000, 103000, 108000, 112000, 115000, 118000, 125000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: function(value: any) {
          return '$' + value.toLocaleString()
        },
      },
    },
  },
}

export function PortfolioChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={mockChartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  )
}
