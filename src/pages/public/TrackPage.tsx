import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getRecords } from '@/services/firebaseService'
import { where, limit } from 'firebase/firestore'
import { cacheRecord, getCachedRecord } from '@/offline/db'
import { useAppStore } from '@/stores/appStore'

const ease = [0.21, 0.47, 0.32, 0.98] as const

export default function TrackPage() {
  const [ref, setRef] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')
  const isOnline = useAppStore(s => s.isOnline)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ref.trim() || !phone.trim()) { setError('Both fields are required'); return }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      if (isOnline) {
        const records = await getRecords('fishSubmissions', [
          where('referenceNumber', '==', ref.trim()),
          limit(1),
        ])
        if (records.length > 0) {
          const record = records[0]!
          setResult(record)
          await cacheRecord('cachedTracking', { referenceNumber: ref.trim(), ...record, cachedAt: Date.now() })
        } else {
          setError('No record found. Check your reference number.')
        }
      } else {
        const cached = await getCachedRecord('cachedTracking', ref.trim())
        if (cached) {
          setResult(cached as Record<string, unknown>)
        } else {
          setError('No cached record found. Try again when online.')
        }
      }
    } catch {
      const cached = await getCachedRecord('cachedTracking', ref.trim())
      if (cached) {
        setResult(cached as Record<string, unknown>)
      } else {
        setError('Unable to search. Try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="relative bg-navy-900 overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06), transparent 70%)' }}
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Track Your Request</h1>
            <p className="text-white/60">Enter your reference number and phone number to check the status.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 max-w-lg mx-auto px-4">
        <motion.form
          onSubmit={handleSearch}
          className="space-y-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          <Input label="Reference number" id="ref" value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. AGR-FISH-2026-0001" />
          <Input label="Phone number used" id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0778 123 456" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            <Search className="h-4 w-4" /> Track
          </Button>
        </motion.form>

        {result && (
          <motion.div
            className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-navy-900">{String(result.referenceNumber ?? '')}</h2>
              <StatusBadge status={String(result.status ?? '')} />
            </div>
            <div className="text-sm space-y-1 text-gray-500">
              <p>Farmer: {String(result.farmerName ?? '')}</p>
              <p>Fish: {String(result.estimatedKg ?? '')} kg {String(result.species ?? '')}</p>
              {Boolean(result.scheduledDate) && <p>Scheduled: {String(result.scheduledDate)}</p>}
              {Boolean(result.verifiedWeightKg) && <p>Verified: {String(result.verifiedWeightKg)} kg</p>}
              {Boolean(result.finalValue) && <p>Final value: USD {Number(result.finalValue).toLocaleString()}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <a href={`tel:${import.meta.env.VITE_WHATSAPP_NUMBER}`} className="text-sm text-aqua-600 hover:text-aqua-500 transition-colors">Call Agrimarine</a>
              <a href={`https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-500 transition-colors">WhatsApp</a>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  )
}
