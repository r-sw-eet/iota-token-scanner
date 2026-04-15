<script setup lang="ts">
import { Line, Doughnut, Bar } from 'vue-chartjs'

const props = defineProps<{ project: any }>()

// Generate realistic-looking mock data
function mockDays(n: number): string[] {
  const days: string[] = []
  const now = Date.now()
  for (let i = n - 1; i >= 0; i--) {
    days.push(new Date(now - i * 86_400_000).toISOString().slice(5, 10))
  }
  return days
}

function mockCurve(n: number, base: number, noise: number, trend: number): number[] {
  const data: number[] = []
  let val = base
  for (let i = 0; i < n; i++) {
    val += trend + (Math.random() - 0.4) * noise
    data.push(Math.max(0, Math.round(val)))
  }
  return data
}

function mockGrowth(values: number[]): number[] {
  let cum = 0
  return values.map(v => { cum += v; return cum })
}

const days = mockDays(60)

const eventsPerDayData = computed(() => ({
  labels: days,
  datasets: [{
    label: 'Events / day',
    data: mockCurve(60, 40, 30, 0.5),
    borderColor: '#14b8a6',
    backgroundColor: '#14b8a620',
    fill: true,
    tension: 0.3,
    pointRadius: 0,
  }],
}))

const sendersPerDayData = computed(() => ({
  labels: days,
  datasets: [{
    label: 'Unique senders / day',
    data: mockCurve(60, 8, 6, 0.1),
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f620',
    fill: true,
    tension: 0.3,
    pointRadius: 0,
  }],
}))

const cumulativeData = computed(() => {
  const raw = mockCurve(60, 40, 30, 0.5)
  return {
    labels: days,
    datasets: [{
      label: 'Cumulative events',
      data: mockGrowth(raw),
      borderColor: '#22c55e',
      backgroundColor: '#22c55e20',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
    }],
  }
})

const eventTypesData = computed(() => ({
  labels: ['Swap', 'Deposit', 'Withdraw', 'Liquidation', 'Claim'],
  datasets: [{
    data: [420, 280, 190, 65, 45],
    backgroundColor: ['#14b8a6', '#3b82f6', '#22c55e', '#ef4444', '#eab308'],
    borderColor: '#16161a',
    borderWidth: 2,
  }],
}))

const tvlHistoryData = computed(() => ({
  labels: mockDays(90),
  datasets: [{
    label: 'TVL (USD)',
    data: mockCurve(90, 2_000_000, 200_000, 15_000),
    borderColor: '#eab308',
    backgroundColor: '#eab30820',
    fill: true,
    tension: 0.3,
    pointRadius: 0,
  }],
}))

const lineOptions = (yLabel: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    x: { ticks: { color: '#52525b', maxTicksLimit: 8, font: { size: 10 } }, grid: { display: false } },
    y: {
      title: { display: true, text: yLabel, color: '#71717a', font: { size: 11 } },
      ticks: { color: '#71717a' },
      grid: { color: '#2a2a3015' },
    },
  },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    x: { ticks: { color: '#52525b', maxTicksLimit: 8, font: { size: 10 } }, grid: { display: false } },
    y: {
      title: { display: true, text: 'Unique senders', color: '#71717a', font: { size: 11 } },
      ticks: { color: '#71717a' },
      grid: { color: '#2a2a3015' },
    },
  },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: { position: 'right' as const, labels: { color: '#a1a1aa', font: { size: 11 }, padding: 12 } },
    tooltip: { enabled: false },
  },
}

const isL1 = computed(() => props.project?.layer === 'L1')
const hasTvl = computed(() => !!props.project?.tvl)
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-bold text-[#f4f4f5] mb-4">Activity Charts</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Events per day -->
      <div v-if="isL1" class="bg-scanner-card border border-scanner-border rounded p-5">
        <h3 class="text-sm font-semibold text-[#a1a1aa] mb-1">Events per Day</h3>
        <p class="text-xs text-[#52525b] mb-3">Daily on-chain events emitted by this project</p>
        <div class="h-56 relative overflow-hidden">
          <Line :data="eventsPerDayData" :options="lineOptions('Events')" />
          <div class="absolute inset-0 backdrop-blur-[6px] bg-scanner-card/40 flex items-center justify-center">
            <span class="text-lg font-bold text-[#a1a1aa]/80 tracking-wider">Coming Soon</span>
          </div>
        </div>
      </div>

      <!-- Unique senders per day -->
      <div v-if="isL1" class="bg-scanner-card border border-scanner-border rounded p-5">
        <h3 class="text-sm font-semibold text-[#a1a1aa] mb-1">Unique Senders per Day</h3>
        <p class="text-xs text-[#52525b] mb-3">Unique addresses interacting with this project daily</p>
        <div class="h-56 relative overflow-hidden">
          <Bar :data="sendersPerDayData" :options="barOptions" />
          <div class="absolute inset-0 backdrop-blur-[6px] bg-scanner-card/40 flex items-center justify-center">
            <span class="text-lg font-bold text-[#a1a1aa]/80 tracking-wider">Coming Soon</span>
          </div>
        </div>
      </div>

      <!-- Cumulative events -->
      <div v-if="isL1" class="bg-scanner-card border border-scanner-border rounded p-5">
        <h3 class="text-sm font-semibold text-[#a1a1aa] mb-1">Cumulative Events</h3>
        <p class="text-xs text-[#52525b] mb-3">Total on-chain events over time</p>
        <div class="h-56 relative overflow-hidden">
          <Line :data="cumulativeData" :options="lineOptions('Total events')" />
          <div class="absolute inset-0 backdrop-blur-[6px] bg-scanner-card/40 flex items-center justify-center">
            <span class="text-lg font-bold text-[#a1a1aa]/80 tracking-wider">Coming Soon</span>
          </div>
        </div>
      </div>

      <!-- Event type distribution -->
      <div v-if="isL1" class="bg-scanner-card border border-scanner-border rounded p-5">
        <h3 class="text-sm font-semibold text-[#a1a1aa] mb-1">Event Type Distribution</h3>
        <p class="text-xs text-[#52525b] mb-3">Breakdown of on-chain event types</p>
        <div class="h-56 relative overflow-hidden">
          <Doughnut :data="eventTypesData" :options="doughnutOptions" />
          <div class="absolute inset-0 backdrop-blur-[6px] bg-scanner-card/40 flex items-center justify-center">
            <span class="text-lg font-bold text-[#a1a1aa]/80 tracking-wider">Coming Soon</span>
          </div>
        </div>
      </div>

      <!-- TVL history -->
      <div v-if="hasTvl" class="bg-scanner-card border border-scanner-border rounded p-5" :class="{ 'md:col-span-2': !isL1 }">
        <h3 class="text-sm font-semibold text-[#a1a1aa] mb-1">TVL Over Time</h3>
        <p class="text-xs text-[#52525b] mb-3">Total Value Locked (USD) from DefiLlama</p>
        <div class="h-56 relative overflow-hidden">
          <Line :data="tvlHistoryData" :options="lineOptions('USD')" />
          <div class="absolute inset-0 backdrop-blur-[6px] bg-scanner-card/40 flex items-center justify-center">
            <span class="text-lg font-bold text-[#a1a1aa]/80 tracking-wider">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
