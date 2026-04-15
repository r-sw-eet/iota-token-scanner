<script setup lang="ts">
import { Line } from 'vue-chartjs'

const { $api } = useApi()
const { formatCompact } = useIota()

const epochs = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    epochs.value = await $api('/snapshots/epochs')
  } catch {
    // not ready yet (backfill in progress)
  } finally {
    loading.value = false
  }
})

const storageFundChartData = computed(() => {
  if (!epochs.value.length) return null
  const filtered = epochs.value.filter((e: any) => e.storageFundTotal > 0)
  return {
    labels: filtered.map((e: any) => `E${e.epoch}`),
    datasets: [{
      label: 'Storage Fund (IOTA)',
      data: filtered.map((e: any) => e.storageFundTotal),
      borderColor: '#14b8a6',
      backgroundColor: '#14b8a620',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHitRadius: 8,
    }],
  }
})

const gasBurnChartData = computed(() => {
  if (!epochs.value.length) return null
  const filtered = epochs.value.filter((e: any) => e.epochGasBurned > 0)
  return {
    labels: filtered.map((e: any) => `E${e.epoch}`),
    datasets: [{
      label: 'Gas Burned (IOTA/epoch)',
      data: filtered.map((e: any) => e.epochGasBurned),
      borderColor: '#22c55e',
      backgroundColor: '#22c55e20',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHitRadius: 8,
    }],
  }
})

const txChartData = computed(() => {
  if (!epochs.value.length) return null
  const filtered = epochs.value.filter((e: any) => e.epochTransactions > 0)
  return {
    labels: filtered.map((e: any) => `E${e.epoch}`),
    datasets: [{
      label: 'Transactions / epoch',
      data: filtered.map((e: any) => e.epochTransactions),
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f620',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHitRadius: 8,
    }],
  }
})

const cumulativeGasChartData = computed(() => {
  if (!epochs.value.length) return null
  const filtered = epochs.value.filter((e: any) => e.epochGasBurned > 0)
  let cumulative = 0
  const data = filtered.map((e: any) => {
    cumulative += e.epochGasBurned
    return cumulative
  })
  return {
    labels: filtered.map((e: any) => `E${e.epoch}`),
    datasets: [{
      label: 'Cumulative Gas Burned (IOTA)',
      data,
      borderColor: '#ef4444',
      backgroundColor: '#ef444420',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHitRadius: 8,
    }],
  }
})

function makeOptions(yLabel: string, yCallback?: (v: any) => string) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#52525b', maxTicksLimit: 12, font: { size: 10 } }, grid: { display: false } },
      y: {
        title: { display: true, text: yLabel, color: '#71717a', font: { size: 11 } },
        ticks: { color: '#71717a', callback: yCallback || ((v: any) => formatCompact(Number(v))) },
        grid: { color: '#2a2a3015' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${formatCompact(ctx.raw)}` } },
    },
  }
}
</script>

<template>
  <div>
    <div v-if="loading" class="text-[#52525b] text-sm mb-4">Loading epoch history (backfill may be in progress)...</div>

    <div v-else-if="epochs.length > 10" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-scanner-card border border-scanner-border rounded p-5">
        <h3 class="text-sm font-semibold text-[#a1a1aa] mb-1">Storage Fund Growth</h3>
        <p class="text-xs text-[#52525b] mb-3">Cumulative IOTA locked in storage deposits (refundable)</p>
        <div class="h-56">
          <Line v-if="storageFundChartData" :data="storageFundChartData" :options="makeOptions('IOTA')" />
        </div>
      </div>

      <div class="bg-scanner-card border border-scanner-border rounded p-5">
        <h3 class="text-sm font-semibold text-[#a1a1aa] mb-1">Gas Burned per Epoch</h3>
        <p class="text-xs text-[#52525b] mb-3">IOTA permanently removed via gas fees each epoch (~24h)</p>
        <div class="h-56">
          <Line v-if="gasBurnChartData" :data="gasBurnChartData" :options="makeOptions('IOTA / epoch')" />
        </div>
      </div>

      <div class="bg-scanner-card border border-scanner-border rounded p-5">
        <h3 class="text-sm font-semibold text-[#a1a1aa] mb-1">Transactions per Epoch</h3>
        <p class="text-xs text-[#52525b] mb-3">Network usage over time</p>
        <div class="h-56">
          <Line v-if="txChartData" :data="txChartData" :options="makeOptions('Transactions')" />
        </div>
      </div>

      <div class="bg-scanner-card border border-scanner-border rounded p-5">
        <h3 class="text-sm font-semibold text-[#a1a1aa] mb-1">Cumulative Gas Burned</h3>
        <p class="text-xs text-[#52525b] mb-3">Total IOTA permanently destroyed since launch</p>
        <div class="h-56">
          <Line v-if="cumulativeGasChartData" :data="cumulativeGasChartData" :options="makeOptions('IOTA (cumulative)')" />
        </div>
      </div>
    </div>

    <p v-else class="text-[#52525b] text-sm">Epoch history not yet available. Backfill is running in the background — check back in a few minutes.</p>
  </div>
</template>
