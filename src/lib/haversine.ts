const EARTH_RADIUS_KM = 6371

export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

export interface RouteGroup {
  name: string
  farmers: { id: string; name: string; lat: number; lng: number; district: string }[]
  totalKg: number
  date: string
  reason: string
  avgDistanceKm: number
}

export function recommendRouteGroups(
  collections: {
    id: string
    farmerName: string
    farmerId: string
    district: string
    latitude?: number
    longitude?: number
    estimatedKg: number
    scheduledDate: string
  }[]
): RouteGroup[] {
  const withCoords = collections.filter(c => c.latitude !== undefined && c.longitude !== undefined) as (typeof collections[0] & { latitude: number; longitude: number })[]
  const groups: RouteGroup[] = []
  const assigned = new Set<string>()

  for (const c of withCoords) {
    if (assigned.has(c.id)) continue
    const group = {
      name: `${c.district} Route`,
      farmers: [{
        id: c.farmerId,
        name: c.farmerName,
        lat: c.latitude,
        lng: c.longitude,
        district: c.district,
      }],
      totalKg: c.estimatedKg,
      date: c.scheduledDate,
      reason: '',
      avgDistanceKm: 0,
    }
    assigned.add(c.id)

    for (const other of withCoords) {
      if (assigned.has(other.id)) continue
      const dist = haversineDistance(c.latitude, c.longitude, other.latitude, other.longitude)
      if (dist < 50 && other.scheduledDate === c.scheduledDate) {
        group.farmers.push({
          id: other.farmerId,
          name: other.farmerName,
          lat: other.latitude,
          lng: other.longitude,
          district: other.district,
        })
        group.totalKg += other.estimatedKg
        assigned.add(other.id)
      }
    }

    if (group.farmers.length > 1) {
      group.reason = 'Within 50 km radius'
      const totalDist = group.farmers.slice(1).reduce((sum, f) =>
        sum + haversineDistance(group.farmers[0]!.lat, group.farmers[0]!.lng, f.lat, f.lng), 0)
      group.avgDistanceKm = Math.round(totalDist / (group.farmers.length - 1))
    } else {
      group.reason = 'Standalone collection'
    }

    groups.push(group)
  }

  return groups
}
