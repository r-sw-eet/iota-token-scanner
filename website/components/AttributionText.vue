<script setup lang="ts">
const props = defineProps<{ text: string }>()

const { explorerObject, explorerTx } = useIota()

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'code'; value: string }
  | { kind: 'addr'; value: string; inCode: boolean }
  | { kind: 'tx'; value: string; inCode: boolean }

// IOTA mainnet address = `0x` + 64 lowercase hex (covers packages, deployers,
// object IDs; system packages `0x0…02`/`0x0…03` are zero-padded to 64 too).
// IOTA tx digest = 43–44 base58 chars (no 0/O/I/l).
const TOKEN_RE = /(0x[0-9a-f]{64})|(\b[1-9A-HJ-NP-Za-km-z]{43,44}\b)/g

function splitAddresses(s: string, inCode: boolean): Token[] {
  const out: Token[] = []
  let last = 0
  for (const m of s.matchAll(TOKEN_RE)) {
    if (m.index! > last) out.push({ kind: inCode ? 'code' : 'text', value: s.slice(last, m.index) })
    if (m[1]) out.push({ kind: 'addr', value: m[0], inCode })
    else out.push({ kind: 'tx', value: m[0], inCode })
    last = m.index! + m[0].length
  }
  if (last < s.length) out.push({ kind: inCode ? 'code' : 'text', value: s.slice(last) })
  return out
}

const tokens = computed<Token[]>(() => {
  const result: Token[] = []
  // Split on backtick code spans first, then linkify addresses inside each segment.
  const parts = props.text.split(/(`[^`\n]+`)/g)
  for (const part of parts) {
    if (!part) continue
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      result.push(...splitAddresses(part.slice(1, -1), true))
    } else {
      result.push(...splitAddresses(part, false))
    }
  }
  return result
})
</script>

<template>
  <p class="text-sm text-[#a1a1aa] whitespace-pre-wrap leading-relaxed break-words">
    <template v-for="(t, i) in tokens" :key="i">
      <a
        v-if="t.kind === 'addr' || t.kind === 'tx'"
        :href="t.kind === 'tx' ? explorerTx(t.value) : explorerObject(t.value)"
        target="_blank"
        rel="noopener"
        :class="[
          'font-mono text-scanner-accent hover:underline break-all',
          t.inCode ? 'bg-scanner-elevated px-1 rounded-xs' : '',
        ]"
        :title="`Open ${t.value} in IOTA Explorer`"
      >{{ t.value }}</a>
      <code
        v-else-if="t.kind === 'code'"
        class="font-mono text-[#d4d4d8] bg-scanner-elevated px-1 rounded-xs"
      >{{ t.value }}</code>
      <template v-else>{{ t.value }}</template>
    </template>
  </p>
</template>
