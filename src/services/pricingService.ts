import { db } from '@/config/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getAllCachedRecords, cacheRecord } from '@/offline/db'
import type { PricingRule, PricingRuleSnapshot, FishSpecies } from '@/types'

export async function getActivePricingRule(species: FishSpecies): Promise<PricingRule | null> {
  try {
    const q = query(
      collection(db, 'pricingRules'),
      where('species', '==', species),
      where('status', '==', 'active')
    )
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0]!
      const rule = { id: docSnap.id, ...docSnap.data() } as PricingRule
      await cacheRecord('cachedPricingRules', rule as unknown as Record<string, unknown>)
      return rule
    }
  } catch {
    // offline, use cached
  }
  const cached = await getAllCachedRecords('cachedPricingRules') as PricingRule[]
  return cached.find(r => r.species === species && r.status === 'active') || null
}

export function calculateEstimatedValue(estimatedKg: number, pricePerKg: number): number {
  return Math.round(estimatedKg * pricePerKg * 100) / 100
}

export function createPricingSnapshot(rule: PricingRule, estimatedKg: number): PricingRuleSnapshot {
  return {
    ruleId: rule.id,
    species: rule.species,
    pricePerKg: rule.pricePerKg,
    minAverageFishGrams: rule.minAverageFishGrams,
    version: rule.version,
    estimatedValue: calculateEstimatedValue(estimatedKg, rule.pricePerKg),
  }
}

export function isMinimumSizeMet(rule: PricingRule, averageFishGrams: number): boolean {
  return averageFishGrams >= rule.minAverageFishGrams
}
