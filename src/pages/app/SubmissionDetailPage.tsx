import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, MessageCircle, CheckCircle, XCircle, Calendar, Truck, DollarSign, Scale, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { getRecord, updateRecord } from '@/services/firebaseService'
import { useToastStore } from '@/components/ui/Toast'
import type { SubmissionStatus } from '@/types'

const statusFlow: SubmissionStatus[] = [
  'New', 'Under review', 'Approved', 'Collection scheduled', 'Team assigned',
  'In transit', 'Arrived', 'Weight verified', 'Collected', 'Payment pending', 'Paid',
]

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToastStore()
  const [sub, setSub] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionModal, setActionModal] = useState<{ action: string; status: SubmissionStatus } | null>(null)
  const [verifiedWeight, setVerifiedWeight] = useState('')
  const [finalPrice, setFinalPrice] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [teamMember, setTeamMember] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const idVal = id as string
    if (!idVal) return
    async function load() {
      try {
        const record = await getRecord('fishSubmissions', idVal)
        setSub(record)
      } catch {
        addToast('error', 'Failed to load submission')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, addToast])

  const handleAction = async () => {
    if (!id || !actionModal) return
    setUpdating(true)
    try {
      const updates: Record<string, unknown> = {
        status: actionModal.status,
        statusHistory: [
          ...((sub?.statusHistory as Record<string, unknown>[]) || []),
          { status: actionModal.status, timestamp: Date.now(), comment: actionModal.action },
        ],
      }

      if (actionModal.status === 'Collection scheduled') {
        updates.scheduledDate = scheduledDate
        updates.scheduledTime = scheduledTime
      }
      if (actionModal.status === 'Team assigned') {
        updates.assignedTeam = [teamMember]
      }
      if (actionModal.status === 'Weight verified' && verifiedWeight) {
        updates.verifiedWeightKg = Number(verifiedWeight)
        const pricingSnap = sub?.pricingRuleSnapshot as Record<string, unknown> | undefined
        const pricePerKg = Number(pricingSnap?.pricePerKg || 3.50)
        const finalVal = Number(verifiedWeight) * pricePerKg
        updates.finalValue = Math.round(finalVal * 100) / 100
        updates.finalPricePerKg = pricePerKg
      }

      await updateRecord('fishSubmissions', id, updates)
      const updated = await getRecord('fishSubmissions', id)
      setSub(updated)
      addToast('success', `Status updated to "${actionModal.status}"`)
      setActionModal(null)
    } catch {
      addToast('error', 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const getNextActions = () => {
    const currentStatus = sub?.status as SubmissionStatus
    const idx = statusFlow.indexOf(currentStatus)
    if (idx < 0) return []

    const actions: { label: string; status: SubmissionStatus; icon: React.ReactNode }[] = []

    if (currentStatus === 'New' || currentStatus === 'Under review') {
      if (currentStatus === 'New') {
        actions.push({ label: 'Mark Under Review', status: 'Under review', icon: <User className="h-4 w-4" /> })
      }
      actions.push({ label: 'Approve', status: 'Approved', icon: <CheckCircle className="h-4 w-4" /> })
      actions.push({ label: 'Decline', status: 'Declined', icon: <XCircle className="h-4 w-4" /> })
      if (currentStatus === 'Under review') {
        actions.push({ label: 'Request Info', status: 'More information required', icon: <User className="h-4 w-4" /> })
      }
    } else if (currentStatus === 'Approved') {
      actions.push({ label: 'Schedule Collection', status: 'Collection scheduled', icon: <Calendar className="h-4 w-4" /> })
    } else if (currentStatus === 'Collection scheduled') {
      actions.push({ label: 'Assign Team', status: 'Team assigned', icon: <Truck className="h-4 w-4" /> })
    } else if (currentStatus === 'Team assigned') {
      actions.push({ label: 'Mark In Transit', status: 'In transit', icon: <Truck className="h-4 w-4" /> })
    } else if (currentStatus === 'In transit') {
      actions.push({ label: 'Mark Arrived', status: 'Arrived', icon: <Truck className="h-4 w-4" /> })
    } else if (currentStatus === 'Arrived') {
      actions.push({ label: 'Record Verified Weight', status: 'Weight verified', icon: <Scale className="h-4 w-4" /> })
    } else if (currentStatus === 'Weight verified') {
      actions.push({ label: 'Mark Collected', status: 'Collected', icon: <CheckCircle className="h-4 w-4" /> })
    } else if (currentStatus === 'Collected') {
      actions.push({ label: 'Mark Payment Pending', status: 'Payment pending', icon: <DollarSign className="h-4 w-4" /> })
    } else if (currentStatus === 'Payment pending') {
      actions.push({ label: 'Mark Paid', status: 'Paid', icon: <DollarSign className="h-4 w-4" /> })
    }

    if (currentStatus !== 'Cancelled' && currentStatus !== 'Declined' && currentStatus !== 'Paid') {
      actions.push({ label: 'Cancel', status: 'Cancelled', icon: <XCircle className="h-4 w-4" /> })
    }

    return actions
  }

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}</div>
  }

  if (!sub) {
    return <div className="text-center py-12"><p className="text-gray-500">Submission not found</p></div>
  }

  const farmerName = String(sub.farmerName ?? '')
  const reference = String(sub.referenceNumber ?? 'No reference')
  const species = String(sub.species ?? '')
  const status = String(sub.status ?? 'New')
  const farmerPhone = String(sub.farmerPhone ?? '')
  const farmerEmail = sub.farmerEmail != null ? String(sub.farmerEmail) : null
  const farmName = sub.farmName != null ? String(sub.farmName) : null
  const farmVillage = String(sub.farmVillage ?? '')
  const town = String(sub.town ?? '')
  const district = String(sub.district ?? '')
  const province = String(sub.province ?? '')
  const estimatedKg = String(sub.estimatedKg ?? '')
  const avgGrams = String(sub.averageFishGrams ?? '')
  const farmingMethod = String(sub.farmingMethod ?? '')
  const harvestDate = String(sub.harvestDate ?? '')
  const estimatedValue = Number(sub.estimatedValue ?? 0).toLocaleString()
  const verifiedWeightKg = sub.verifiedWeightKg != null ? Number(sub.verifiedWeightKg) : null
  const finalValue = sub.finalValue != null ? Number(sub.finalValue) : null
  const images = (sub.images as Record<string, unknown>[]) || []
  const pricingSnap = sub.pricingRuleSnapshot as Record<string, unknown> | undefined

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => navigate('/app/submissions')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to submissions
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{farmerName}</h1>
          <p className="text-sm text-gray-500">{reference} &middot; {species}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Contact</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Phone: {farmerPhone}</p>
            {farmerEmail && <p>Email: {farmerEmail}</p>}
            {farmName && <p>Farm: {farmName}</p>}
          </div>
          <div className="flex gap-2 mt-3">
            <a href={`tel:${farmerPhone}`} className="flex items-center gap-1 text-xs text-aqua-600"><Phone className="h-3 w-3" /> Call</a>
            <a href={`https://wa.me/${farmerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600"><MessageCircle className="h-3 w-3" /> WhatsApp</a>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Location</h3>
          <p className="text-sm text-gray-600">{farmVillage}, {town}</p>
          <p className="text-sm text-gray-600">{district}, {province}</p>
        </Card>
        <Card>
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Fish Details</h3>
          <table className="text-sm text-gray-600 w-full">
            <tbody>
              <tr><td className="py-1 text-gray-500">Species</td><td>{species}</td></tr>
              <tr><td className="py-1 text-gray-500">Est. weight</td><td>{estimatedKg} kg</td></tr>
              <tr><td className="py-1 text-gray-500">Avg fish</td><td>{avgGrams} g</td></tr>
              <tr><td className="py-1 text-gray-500">Farming</td><td>{farmingMethod}</td></tr>
              <tr><td className="py-1 text-gray-500">Harvest</td><td>{harvestDate}</td></tr>
            </tbody>
          </table>
        </Card>
        <Card>
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Value</h3>
          <p className="text-2xl font-bold text-navy-900">USD {estimatedValue}</p>
          {pricingSnap && (
            <p className="text-xs text-gray-500 mt-1">
              USD {String(pricingSnap.pricePerKg ?? '')}/kg
            </p>
          )}
          {verifiedWeightKg != null && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">Verified: {verifiedWeightKg} kg</p>
              <p className="text-sm font-semibold text-green-700">Final: USD {(finalValue ?? 0).toLocaleString()}</p>
            </div>
          )}
        </Card>
      </div>

      {images.length > 0 && (
        <Card>
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Images</h3>
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img: Record<string, unknown>, i: number) => (
              img.storageUrl ? <img key={i} src={String(img.storageUrl)} alt="" className="h-20 w-20 object-cover rounded-lg" /> : null
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {getNextActions().map((action) => (
          <Button key={action.status} size="sm" variant={action.status === 'Declined' || action.status === 'Cancelled' ? 'danger' : 'primary'} onClick={() => {
            if (action.status === 'Declined' || action.status === 'Cancelled') {
              if (window.confirm(`Are you sure you want to ${action.status.toLowerCase()} this submission?`)) {
                setActionModal({ action: action.label, status: action.status })
              }
            } else {
              setActionModal({ action: action.label, status: action.status })
            }
          }}>
            {action.icon} {action.label}
          </Button>
        ))}
      </div>

      <Modal open={!!actionModal} onClose={() => setActionModal(null)} title={actionModal?.action || ''}>
        <div className="space-y-4">
          {actionModal?.status === 'Collection scheduled' && (
            <>
              <Input label="Scheduled date" id="schedDate" type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
              <Input label="Time" id="schedTime" type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
            </>
          )}
          {actionModal?.status === 'Team assigned' && (
            <Input label="Team member name" id="team" value={teamMember} onChange={e => setTeamMember(e.target.value)} />
          )}
          {actionModal?.status === 'Weight verified' && (
            <Input label="Verified weight (kg)" id="weight" type="number" value={verifiedWeight} onChange={e => setVerifiedWeight(e.target.value)} />
          )}
          {actionModal?.status === 'Paid' && (
            <Input label="Final price per kg (USD)" id="price" type="number" step="0.01" value={finalPrice} onChange={e => setFinalPrice(e.target.value)} />
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button onClick={handleAction} loading={updating}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
