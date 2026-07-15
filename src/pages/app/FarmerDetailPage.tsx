import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, MessageCircle, MapPin, Fish, DollarSign } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { getRecord, getRecords } from '@/services/firebaseService'
import { where, orderBy } from 'firebase/firestore'

export default function FarmerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [farmer, setFarmer] = useState<Record<string, unknown> | null>(null)
  const [submissions, setSubmissions] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const record = await getRecord('farmers', id!)
        setFarmer(record)
        if (record && typeof record.phone === 'string') {
          const subs = await getRecords('fishSubmissions', [
            where('farmerPhone', '==', record.phone),
            orderBy('createdAt', 'desc'),
          ])
          setSubmissions(subs)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}</div>
  if (!farmer) return <div className="text-center py-12"><p className="text-gray-500">Farmer not found</p></div>

  const totalKg = submissions.reduce((s: number, sub) => s + (Number(sub.verifiedWeightKg) || Number(sub.estimatedKg) || 0), 0)
  const totalPayments = submissions.reduce((s: number, sub) => s + (Number(sub.finalValue) || 0), 0)

  const farmerName = String(farmer.fullName ?? '')
  const farmNameVal = farmer.farmName != null ? String(farmer.farmName) : null
  const farmerStatus = String(farmer.status ?? 'active')
  const farmerPhone = String(farmer.phone ?? '')
  const farmerEmail = farmer.email != null ? String(farmer.email) : null
  const farmerVillage = farmer.farmVillage != null ? String(farmer.farmVillage) : ''
  const farmerAddress = farmer.address != null ? String(farmer.address) : ''
  const farmerTown = String(farmer.town ?? '')
  const farmerDistrict = String(farmer.district ?? '')

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => navigate('/app/farmers')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to farmers
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{farmerName}</h1>
          {farmNameVal && <p className="text-sm text-gray-500">{farmNameVal}</p>}
        </div>
        <StatusBadge status={farmerStatus} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Contact</h3>
          <p className="text-sm text-gray-600">Phone: {farmerPhone}</p>
          {farmerEmail && <p className="text-sm text-gray-600">Email: {farmerEmail}</p>}
          <div className="flex gap-2 mt-3">
            <a href={`tel:${farmerPhone}`} className="flex items-center gap-1 text-xs text-aqua-600"><Phone className="h-3 w-3" /> Call</a>
            <a href={`https://wa.me/${farmerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600"><MessageCircle className="h-3 w-3" /> WhatsApp</a>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Location</h3>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <span>{farmerVillage || farmerAddress}, {farmerTown}, {farmerDistrict}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <Fish className="h-5 w-5 text-aqua-500 mb-2" />
          <p className="text-2xl font-bold text-navy-900">{totalKg} kg</p>
          <p className="text-xs text-gray-500">Total verified</p>
        </Card>
        <Card>
          <DollarSign className="h-5 w-5 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-navy-900">USD {totalPayments.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total payments</p>
        </Card>
      </div>

      {submissions.length > 0 && (
        <div>
          <h3 className="font-semibold text-navy-900 mb-3">Submission History</h3>
          <div className="space-y-2">
            {submissions.map((s) => {
              const sId = String(s.id ?? '')
              const sRef = String(s.referenceNumber ?? '—')
              const sSpecies = String(s.species ?? '')
              const sWeight = String(s.verifiedWeightKg ?? s.estimatedKg ?? '')
              const sStatus = String(s.status ?? '')
              return (
                <div key={sId} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/app/submissions/${sId}`)}>
                  <div>
                    <p className="text-sm font-medium text-navy-900">{sRef}</p>
                    <p className="text-xs text-gray-500">{sSpecies} &middot; {sWeight} kg</p>
                  </div>
                  <StatusBadge status={sStatus} size="sm" />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
