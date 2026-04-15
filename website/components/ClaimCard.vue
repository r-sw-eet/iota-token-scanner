<script setup lang="ts">
defineProps<{
  title: string
  claimed: string
  reality: string
  ratio?: string
  verdict?: string
}>()
</script>

<template>
  <div class="bg-scanner-card border border-scanner-border rounded p-5">
    <h3 class="text-sm font-semibold text-[#a1a1aa] mb-3">{{ title }}</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-xs text-claimed mb-1">Claimed</p>
        <p class="text-lg font-bold text-claimed font-mono">{{ claimed }}</p>
      </div>
      <div>
        <p class="text-xs text-reality mb-1">On-Chain Reality</p>
        <p class="text-lg font-bold text-reality font-mono">{{ reality }}</p>
      </div>
    </div>
    <div v-if="ratio || verdict" class="mt-3 pt-3 border-t border-scanner-border-subtle">
      <p v-if="ratio" class="text-xs text-status-muted">Overstatement: <span class="text-claimed font-mono">{{ ratio }}</span></p>
      <p v-if="verdict" class="text-xs text-[#a1a1aa] mt-1">{{ verdict }}</p>
    </div>
  </div>
</template>
