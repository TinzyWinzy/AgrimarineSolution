import { describe, it, expect } from 'vitest'
import { generateLocalId, normalizePhone, formatReference } from '@/lib/idGenerator'

describe('generateLocalId', () => {
  it('generates local ID with correct prefix', () => {
    const id = generateLocalId('LOCAL-FISH')
    expect(id).toMatch(/^LOCAL-FISH-2026-[A-Z0-9]{6}$/)
  })

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateLocalId('TEST')))
    expect(ids.size).toBe(100)
  })
})

describe('normalizePhone', () => {
  it('converts 0 prefix to +263', () => {
    expect(normalizePhone('0778123456')).toBe('+263778123456')
  })

  it('handles +263 prefix', () => {
    expect(normalizePhone('+263778123456')).toBe('+263778123456')
  })

  it('strips spaces and dashes', () => {
    expect(normalizePhone('0778 123 456')).toBe('+263778123456')
  })
})

describe('formatReference', () => {
  it('formats fish submission reference', () => {
    expect(formatReference('fishSubmission', 2026, 1)).toBe('AGR-FISH-2026-0001')
  })

  it('formats quote reference', () => {
    expect(formatReference('quote', 2026, 42)).toBe('AGR-QUOTE-2026-0042')
  })

  it('formats order reference', () => {
    expect(formatReference('order', 2026, 100)).toBe('AGR-ORDER-2026-0100')
  })

  it('formats training reference', () => {
    expect(formatReference('training', 2026, 9999)).toBe('AGR-TRAIN-2026-9999')
  })
})
