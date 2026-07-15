import { describe, it, expect } from 'vitest'
import { haversineDistance, formatDistance, recommendRouteGroups } from '@/lib/haversine'

describe('haversineDistance', () => {
  it('returns 0 for same point', () => {
    expect(haversineDistance(-17.8, 31.0, -17.8, 31.0)).toBe(0)
  })

  it('calculates Harare to Marondera distance', () => {
    const dist = haversineDistance(-17.8252, 31.0335, -18.1890, 31.5500)
    expect(dist).toBeGreaterThan(60)
    expect(dist).toBeLessThan(80)
  })

  it('is symmetric', () => {
    const d1 = haversineDistance(-20, 30, -18, 32)
    const d2 = haversineDistance(-18, 32, -20, 30)
    expect(d1).toBeCloseTo(d2, 5)
  })
})

describe('formatDistance', () => {
  it('formats km', () => {
    expect(formatDistance(75.3)).toBe('75 km')
  })

  it('formats small distances in meters', () => {
    expect(formatDistance(0.5)).toBe('500 m')
  })

  it('formats tiny distances', () => {
    expect(formatDistance(0.05)).toBe('50 m')
  })
})

describe('recommendRouteGroups', () => {
  it('groups nearby collections', () => {
    const groups = recommendRouteGroups([
      { id: '1', farmerName: 'A', farmerId: 'f1', district: 'Marondera', latitude: -18.19, longitude: 31.55, estimatedKg: 420, scheduledDate: '2026-07-20' },
      { id: '2', farmerName: 'B', farmerId: 'f2', district: 'Marondera', latitude: -18.20, longitude: 31.56, estimatedKg: 300, scheduledDate: '2026-07-20' },
    ])
    expect(groups.length).toBe(1)
    expect(groups[0].farmers.length).toBe(2)
    expect(groups[0].totalKg).toBe(720)
  })

  it('separates distant collections', () => {
    const groups = recommendRouteGroups([
      { id: '1', farmerName: 'A', farmerId: 'f1', district: 'Harare', latitude: -17.83, longitude: 31.03, estimatedKg: 200, scheduledDate: '2026-07-20' },
      { id: '2', farmerName: 'B', farmerId: 'f2', district: 'Mutare', latitude: -18.97, longitude: 32.67, estimatedKg: 150, scheduledDate: '2026-07-20' },
    ])
    expect(groups.length).toBe(2)
  })
})
