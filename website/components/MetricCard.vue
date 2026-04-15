<script setup lang="ts">
defineProps<{
  label: string
  value: string
  subtitle?: string
}>()
</script>

<template>
  <div class="bg-scanner-card border border-scanner-border rounded p-5 overflow-hidden">
    <p class="text-sm text-[#71717a] mb-1">{{ label }}</p>
    <p class="text-2xl font-bold text-[#f4f4f5] break-words" :class="value.length <= 10 ? 'font-mono' : ''">{{ value }}</p>
    <p v-if="subtitle" class="text-xs text-[#52525b] mt-1">{{ subtitle }}</p>
  </div>
</template>
