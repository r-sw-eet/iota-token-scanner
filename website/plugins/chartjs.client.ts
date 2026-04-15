import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  ArcElement,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js'

export default defineNuxtPlugin(() => {
  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    ArcElement,
    LineElement,
    PointElement,
    Filler,
  )
})
