import { describe, it, expect } from 'vitest'
import { useIota } from '~/composables/useIota'

describe('useIota', () => {
  const { formatIota, formatCompact, formatPercent } = useIota()

  describe('formatIota', () => {
    it('returns em-dash for null/undefined/NaN', () => {
      expect(formatIota(null)).toBe('—')
      expect(formatIota(undefined)).toBe('—')
      expect(formatIota(NaN)).toBe('—')
    })

    it('formats integers with thousands separators', () => {
      expect(formatIota(1234567)).toBe('1,234,567')
    })

    it('respects the decimals argument', () => {
      expect(formatIota(1234.5678, 2)).toBe('1,234.57')
    })
  })

  describe('formatCompact', () => {
    it('returns em-dash for null/NaN', () => {
      expect(formatCompact(null)).toBe('—')
      expect(formatCompact(NaN)).toBe('—')
    })

    it('uses B suffix at >=1e9', () => {
      expect(formatCompact(1_500_000_000)).toBe('1.50B')
    })

    it('uses M suffix at >=1e6', () => {
      expect(formatCompact(2_500_000)).toBe('2.50M')
    })

    it('uses K suffix at >=1e3', () => {
      expect(formatCompact(1234)).toBe('1.2K')
    })

    it('drops decimals below 1000', () => {
      expect(formatCompact(42.7)).toBe('43')
    })
  })

  describe('formatPercent', () => {
    it('returns em-dash for null/NaN', () => {
      expect(formatPercent(null)).toBe('—')
      expect(formatPercent(NaN)).toBe('—')
    })

    it('formats with 2 decimals by default', () => {
      expect(formatPercent(12.345)).toBe('12.35%')
    })

    it('respects the decimals argument', () => {
      expect(formatPercent(12.345, 0)).toBe('12%')
    })
  })
})
