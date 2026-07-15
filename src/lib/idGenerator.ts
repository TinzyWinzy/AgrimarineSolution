export function generateLocalId(prefix: string): string {
  const year = new Date().getFullYear()
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${prefix}-${year}-${code}`
}

export function generateIdempotencyKey(): string {
  return `${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, '').replace(/^0/, '+263').replace(/^\+?263/, '+263')
}

export function formatReference(type: string, year: number, sequence: number): string {
  const prefixMap: Record<string, string> = {
    fishSubmission: 'AGR-FISH',
    quote: 'AGR-QUOTE',
    order: 'AGR-ORDER',
    training: 'AGR-TRAIN',
  }
  const prefix = prefixMap[type] || 'AGR'
  return `${prefix}-${year}-${String(sequence).padStart(4, '0')}`
}
