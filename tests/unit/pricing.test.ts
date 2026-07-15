import { describe, it, expect } from 'vitest'
import { calculateEstimatedValue, isMinimumSizeMet, createPricingSnapshot } from '@/services/pricingService'
import type { PricingRule } from '@/types'

const mockRule: PricingRule = {
  id: 'rule-1',
  species: 'Nile tilapia',
  pricePerKg: 3.5,
  minAverageFishGrams: 300,
  effectiveDate: Date.now(),
  status: 'active',
  version: 1,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

describe('calculateEstimatedValue', () => {
  it('calculates value correctly', () => {
    expect(calculateEstimatedValue(420, 3.5)).toBe(1470)
  })

  it('handles zero kg', () => {
    expect(calculateEstimatedValue(0, 3.5)).toBe(0)
  })

  it('rounds to 2 decimal places', () => {
    expect(calculateEstimatedValue(100, 3.333)).toBe(333.3)
  })
})

describe('isMinimumSizeMet', () => {
  it('returns true when above minimum', () => {
    expect(isMinimumSizeMet(mockRule, 450)).toBe(true)
  })

  it('returns true when exactly at minimum', () => {
    expect(isMinimumSizeMet(mockRule, 300)).toBe(true)
  })

  it('returns false when below minimum', () => {
    expect(isMinimumSizeMet(mockRule, 250)).toBe(false)
  })
})

describe('createPricingSnapshot', () => {
  it('creates snapshot with correct values', () => {
    const snap = createPricingSnapshot(mockRule, 420)
    expect(snap.ruleId).toBe('rule-1')
    expect(snap.pricePerKg).toBe(3.5)
    expect(snap.estimatedValue).toBe(1470)
    expect(snap.version).toBe(1)
  })
})
