import { useState, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Camera, X, MapPin, ChevronLeft, ChevronRight, WifiOff, RefreshCw, Loader2 } from 'lucide-react'
import { fishSubmissionSchema, type FishSubmissionFormData } from '@/schemas/fishSubmission'
import { useAppStore } from '@/stores/appStore'
import { compressImage, validateImage, generateSafeFileName } from '@/lib/imageCompressor'
import { generateLocalId, generateIdempotencyKey } from '@/lib/idGenerator'
import { savePendingSubmission, saveImageBlob, getPendingCount } from '@/offline/db'
import { getActivePricingRule, calculateEstimatedValue, createPricingSnapshot, isMinimumSizeMet } from '@/services/pricingService'
import { createRecord, uploadFile } from '@/services/firebaseService'
import { syncNow, updatePendingCount } from '@/services/syncService'
import { useToastStore } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TextArea } from '@/components/ui/TextArea'
import type { FishImage, PricingRule } from '@/types'

const STEPS = ['Farmer Info', 'Location', 'Fish Details', 'Images', 'Collection', 'Review']

const provinces = ['Harare', 'Mashonaland East', 'Mashonaland West', 'Mashonaland Central', 'Manicaland', 'Masvingo', 'Midlands', 'Matabeleland North', 'Matabeleland South']
const districts = ['Marondera', 'Murehwa', 'Goromonzi', 'Bindura', 'Chitungwiza', 'Norton', 'Chegutu', 'Mutare', 'Masvingo', 'Chinhoyi', 'Shamva', 'Harare']

export default function SellFishPage() {
  const [step, setStep] = useState(0)
  const [images, setImages] = useState<FishImage[]>([])
  const [imageFiles, setImageFiles] = useState<Map<string, File>>(new Map())
  const [compressing, setCompressing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [localRef, setLocalRef] = useState('')
  const [officialRef, setOfficialRef] = useState('')
  const [isOfflineSubmission, setIsOfflineSubmission] = useState(false)
  const [pricingRule, setPricingRule] = useState<PricingRule | null>(null)
  const [estValue, setEstValue] = useState<number | null>(null)
  const [sizeMet, setSizeMet] = useState(true)

  const isOnline = useAppStore((s) => s.isOnline)
  const { addToast } = useToastStore()

  const methods = useForm<FishSubmissionFormData>({
    resolver: zodResolver(fishSubmissionSchema),
    defaultValues: {
      farmerName: '',
      farmerPhone: '',
      farmerAltPhone: '',
      farmerEmail: '',
      farmName: '',
      preferredContact: 'Phone call',
      isExistingFarmer: false,
      province: '',
      district: '',
      town: '',
      farmVillage: '',
      physicalAddress: '',
      accessNotes: '',
      species: 'Nile tilapia',
      estimatedKg: 0,
      averageFishGrams: 0,
      estimatedCount: undefined,
      harvestDate: '',
      fishCondition: 'Live',
      farmingMethod: 'Pond',
      feedUsed: '',
      notes: '',
      images: [],
      preferredDate: '',
      alternativeDate: '',
      preferredTime: 'Flexible',
      canDeliver: false,
      requiresRefrigeration: false,
      urgency: 'Normal',
      collectionInstructions: '',
      consentAccurate: false as unknown as true,
      consentVerified: false as unknown as true,
      consentEstimate: false as unknown as true,
      consentReview: false as unknown as true,
    },
    mode: 'onChange',
  })

  const watchSpecies = methods.watch('species')
  const watchEstimatedKg = methods.watch('estimatedKg')
  const watchAvgGrams = methods.watch('averageFishGrams')

  const updateEstimate = useCallback(async (species: string, kg: number, grams: number) => {
    if (kg > 0 && species) {
      const rule = await getActivePricingRule(species as FishSubmissionFormData['species'])
      if (rule) {
        setPricingRule(rule)
        const meetsSize = isMinimumSizeMet(rule, grams)
        setSizeMet(meetsSize)
        if (meetsSize) {
          setEstValue(calculateEstimatedValue(kg, rule.pricePerKg))
        } else {
          setEstValue(null)
        }
      } else {
        setPricingRule(null)
        setEstValue(null)
      }
    } else {
      setEstValue(null)
    }
  }, [])

  const handleSpeciesChange = (species: string) => {
    const kg = methods.getValues('estimatedKg') || 0
    const grams = methods.getValues('averageFishGrams') || 0
    updateEstimate(species, kg, grams)
  }

  const handleKgChange = (kg: number) => {
    const species = methods.getValues('species')
    const grams = methods.getValues('averageFishGrams') || 0
    updateEstimate(species, kg, grams)
  }

  const handleGramsChange = (grams: number) => {
    const species = methods.getValues('species')
    const kg = methods.getValues('estimatedKg') || 0
    updateEstimate(species, kg, grams)
  }

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setCompressing(true)
    for (const file of Array.from(files)) {
      const err = validateImage(file)
      if (err) { addToast('error', err); continue }
      try {
        const compressedBlob = await compressImage(file)
        const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
        const fileName = generateSafeFileName(file.name)
        const compressedFile = new File([compressedBlob], fileName, { type: 'image/jpeg' })
        setImageFiles(prev => new Map(prev).set(id, compressedFile))
        setImages(prev => [...prev, { id, category: 'Fish sample', fileName, storageUrl: '', localBlobId: id }])
      } catch {
        addToast('error', 'Failed to process image')
      }
    }
    setCompressing(false)
    e.target.value = ''
  }

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(i => i.id !== id))
    setImageFiles(prev => { const m = new Map(prev); m.delete(id); return m })
  }

  const createImagePreview = (id: string): string => {
    const file = imageFiles.get(id)
    return file ? URL.createObjectURL(file) : ''
  }

  const nextStep = async () => {
    let fields: (keyof FishSubmissionFormData)[] = []
    switch (step) {
      case 0: fields = ['farmerName', 'farmerPhone', 'preferredContact']; break
      case 1: fields = ['province', 'district', 'town', 'farmVillage']; break
      case 2: fields = ['species', 'estimatedKg', 'averageFishGrams', 'harvestDate', 'fishCondition', 'farmingMethod']; break
      case 3: break
      case 4: fields = ['preferredDate', 'preferredTime', 'canDeliver', 'requiresRefrigeration', 'urgency']; break
    }
    const valid = await methods.trigger(fields as never[])
    if (valid) setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 0))

  const onSubmit = async (data: FishSubmissionFormData) => {
    setSubmitting(true)
    try {
      const localId = generateLocalId('LOCAL-FISH')
      setLocalRef(localId)

      const pricingSnapshot = pricingRule ? createPricingSnapshot(pricingRule, data.estimatedKg) : undefined

      const payload = {
        ...data,
        localId,
        idempotencyKey: generateIdempotencyKey(),
        images: images.map(i => ({ id: i.id, category: i.category, fileName: i.fileName })),
        pricingRuleSnapshot: pricingSnapshot,
        estimatedValue: estValue || 0,
        syncStatus: 'pending',
        retryCount: 0,
        createdAt: Date.now(),
      }

      if (isOnline) {
        try {
          const imageUrls: string[] = []
          for (const img of images) {
            const file = imageFiles.get(img.id)
            if (file) {
              const url = await uploadFile(`submissions/${localId}/${img.fileName}`, file)
              imageUrls.push(url)
            }
          }

          await createRecord('fishSubmissions', {
            ...data,
            referenceNumber: '',
            imageUrls,
            images: images.map((img, i) => ({ ...img, storageUrl: imageUrls[i] || '' })),
            pricingRuleSnapshot: pricingSnapshot,
            estimatedValue: estValue || 0,
            status: 'New',
            statusHistory: [{ status: 'New', timestamp: Date.now(), comment: 'Submission received' }],
            localId,
            idempotencyKey: payload.idempotencyKey,
            isDemo: import.meta.env.VITE_DEMO_MODE === 'true',
          } as unknown as Record<string, unknown>)

          setOfficialRef(`AGR-FISH-${new Date().getFullYear()}-${localId.slice(-4)}`)
          setSubmitted(true)
          addToast('success', 'Your submission has been received!')
          return
        } catch {
          setIsOfflineSubmission(true)
        }
      } else {
        setIsOfflineSubmission(true)
      }

      for (const img of images) {
        const file = imageFiles.get(img.id)
        if (file) {
          await saveImageBlob(img.id, localId, file, img.fileName, img.category)
        }
      }

      await savePendingSubmission(payload as unknown as Record<string, unknown>)
      await updatePendingCount()
      setSubmitted(true)
      if (isOfflineSubmission) {
        addToast('info', 'Saved offline. Will sync when connected.')
      }
    } catch (err) {
      addToast('error', 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-navy-900">
            {isOfflineSubmission ? 'Saved on Your Device' : 'Submission Received!'}
          </h2>
          {isOfflineSubmission ? (
            <>
              <p className="text-gray-600 text-sm">
                Temporary reference: <strong className="font-mono">{localRef}</strong>
              </p>
              <p className="text-gray-500 text-sm">
                Your request is saved on this device. It will be sent automatically when internet is available.
                Do not clear your browser data for this site before synchronization completes.
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-600 text-sm">
                <WifiOff className="h-4 w-4" />
                <span>Waiting for internet connection</span>
              </div>
              <Button onClick={async () => { await syncNow(); window.location.reload() }}>
                <RefreshCw className="h-4 w-4" /> Retry Sync
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-sm">
                Reference: <strong className="font-mono">{officialRef}</strong>
              </p>
              <p className="text-gray-500 text-sm">
                We will review your submission and contact you within 24 hours.
              </p>
              <div className="flex gap-3 justify-center">
                <a href="/track" className="text-aqua-600 hover:text-aqua-500 text-sm font-medium">Track Request</a>
                <a href="/sell-fish" className="text-aqua-600 hover:text-aqua-500 text-sm font-medium">Submit Another</a>
              </div>
            </>
          )}
          <div className="flex gap-3 justify-center pt-4">
            <a href={`tel:${import.meta.env.VITE_WHATSAPP_NUMBER}`} className="text-sm text-gray-600 hover:text-gray-800">Call Agrimarine</a>
            <a href={`https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-500">WhatsApp</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-navy-900 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Sell Your Fish</h1>
          <p className="text-white/70 text-sm">Complete the form below and Agrimarine will review your submission.</p>
        </div>
      </section>
      <section className="py-8 max-w-3xl mx-auto px-4">
        {!isOnline && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-sm text-yellow-800">
            <WifiOff className="h-4 w-4" />
            You are offline. Your submission will be saved locally and sent when connected.
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= step ? 'bg-aqua-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-16 hidden sm:block ${i < step ? 'bg-aqua-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">{STEPS[step]}</p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit as never)}>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              {step === 0 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-semibold text-navy-900">Farmer Information</h2>
                  <Input {...methods.register('farmerName')} label="Full name *" error={methods.formState.errors.farmerName?.message} id="farmerName" />
                  <Input {...methods.register('farmerPhone')} label="Primary mobile *" placeholder="e.g. 0778 123 456" error={methods.formState.errors.farmerPhone?.message} id="farmerPhone" />
                  <Input {...methods.register('farmerAltPhone')} label="Alternative number" id="farmerAltPhone" />
                  <Input {...methods.register('farmerEmail')} label="Email" type="email" id="farmerEmail" />
                  <Input {...methods.register('farmName')} label="Farm or business name" id="farmName" />
                  <Select label="Preferred contact *" id="preferredContact" error={methods.formState.errors.preferredContact?.message} options={[
                    { value: 'Phone call', label: 'Phone call' },
                    { value: 'SMS', label: 'SMS' },
                    { value: 'WhatsApp', label: 'WhatsApp' },
                    { value: 'Email', label: 'Email' },
                  ]} {...methods.register('preferredContact')} />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...methods.register('isExistingFarmer')} className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600">I am an existing Agrimarine farmer</span>
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-semibold text-navy-900">Farm Location</h2>
                  <Select label="Province *" id="province" error={methods.formState.errors.province?.message} options={provinces.map(p => ({ value: p, label: p }))} placeholder="Select province" {...methods.register('province')} />
                  <Select label="District *" id="district" error={methods.formState.errors.district?.message} options={districts.map(d => ({ value: d, label: d }))} placeholder="Select district" {...methods.register('district')} />
                  <Input {...methods.register('town')} label="Town or nearest centre *" error={methods.formState.errors.town?.message} id="town" />
                  <Input {...methods.register('farmVillage')} label="Farm or village name *" error={methods.formState.errors.farmVillage?.message} id="farmVillage" />
                  <TextArea {...methods.register('physicalAddress')} label="Physical address" id="physicalAddress" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input {...methods.register('latitude', { valueAsNumber: true })} label="Latitude" type="number" step="any" id="latitude" />
                    <Input {...methods.register('longitude', { valueAsNumber: true })} label="Longitude" type="number" step="any" id="longitude" />
                  </div>
                  <button type="button" className="flex items-center gap-2 text-sm text-aqua-600 hover:text-aqua-500" onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        methods.setValue('latitude', pos.coords.latitude)
                        methods.setValue('longitude', pos.coords.longitude)
                      }, () => addToast('info', 'Location permission denied. You can enter coordinates manually.'))
                    }
                  }}>
                    <MapPin className="h-4 w-4" /> Use current location
                  </button>
                  <TextArea {...methods.register('accessNotes')} label="Access and road notes" id="accessNotes" />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-semibold text-navy-900">Fish Details</h2>
                  <Select label="Species *" id="species" error={methods.formState.errors.species?.message} options={[
                    { value: 'Nile tilapia', label: 'Nile tilapia' },
                    { value: 'Catfish', label: 'Catfish' },
                    { value: 'Other', label: 'Other' },
                  ]} {...methods.register('species', { onChange: (e) => handleSpeciesChange(e.target.value) })} />
                  <Input {...methods.register('estimatedKg', { valueAsNumber: true })} label="Estimated total weight (kg) *" type="number" id="estimatedKg" onChange={(e) => handleKgChange(Number(e.target.value))} error={methods.formState.errors.estimatedKg?.message} />
                  <Input {...methods.register('averageFishGrams', { valueAsNumber: true })} label="Average fish weight (grams) *" type="number" id="averageFishGrams" onChange={(e) => handleGramsChange(Number(e.target.value))} error={methods.formState.errors.averageFishGrams?.message} />
                  <Input {...methods.register('estimatedCount', { valueAsNumber: true })} label="Estimated number of fish" type="number" id="estimatedCount" />
                  <Input {...methods.register('harvestDate')} label="Harvest date *" type="date" id="harvestDate" error={methods.formState.errors.harvestDate?.message} />
                  <Select label="Fish condition *" id="fishCondition" options={[
                    { value: 'Live', label: 'Live' },
                    { value: 'Fresh', label: 'Fresh' },
                    { value: 'Frozen', label: 'Frozen' },
                  ]} {...methods.register('fishCondition')} />
                  <Select label="Farming method *" id="farmingMethod" options={[
                    { value: 'Pond', label: 'Pond' },
                    { value: 'Dam', label: 'Dam' },
                    { value: 'Tank', label: 'Tank' },
                    { value: 'Cage', label: 'Cage' },
                    { value: 'Other', label: 'Other' },
                  ]} {...methods.register('farmingMethod')} />
                  <Input {...methods.register('feedUsed')} label="Feed used" id="feedUsed" />
                  <TextArea {...methods.register('notes')} label="Additional notes" id="notes" />

                  {estValue !== null && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        Estimated value: <strong>USD {estValue.toLocaleString()}</strong>
                      </p>
                      {pricingRule && <p className="text-xs text-green-600 mt-1">USD {pricingRule.pricePerKg}/kg for {watchSpecies}</p>}
                    </div>
                  )}
                  {!sizeMet && watchAvgGrams > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">Average fish weight below minimum. Manual review required.</p>
                    </div>
                  )}
                  {estValue === null && watchEstimatedKg > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">Enter average fish weight to see estimated value.</p>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-semibold text-navy-900">Images</h2>
                  <p className="text-sm text-gray-500">Add photos of your fish, pond, or scales reading.</p>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm">Add images</span>
                      <input type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={handleAddImage} />
                    </label>
                    {compressing && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {images.map((img) => (
                        <div key={img.id} className="relative group">
                          <img src={createImagePreview(img.id)} alt="" className="w-full h-24 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-semibold text-navy-900">Collection Preferences</h2>
                  <Input {...methods.register('preferredDate')} label="Preferred collection date *" type="date" id="preferredDate" error={methods.formState.errors.preferredDate?.message} />
                  <Input {...methods.register('alternativeDate')} label="Alternative date" type="date" id="alternativeDate" />
                  <Select label="Preferred time *" id="preferredTime" options={[
                    { value: 'Morning', label: 'Morning' },
                    { value: 'Afternoon', label: 'Afternoon' },
                    { value: 'Flexible', label: 'Flexible' },
                  ]} {...methods.register('preferredTime')} />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...methods.register('canDeliver')} className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600">I can deliver to Agrimarine</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...methods.register('requiresRefrigeration')} className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600">Refrigerated collection required</span>
                  </label>
                  <Select label="Urgency *" id="urgency" options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Urgent', label: 'Urgent' },
                  ]} {...methods.register('urgency')} />
                  <TextArea {...methods.register('collectionInstructions')} label="Additional collection instructions" id="collectionInstructions" />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-semibold text-navy-900">Review and Consent</h2>
                  <div className="bg-surface rounded-lg p-4 text-sm space-y-2">
                    <p><strong>Farmer:</strong> {methods.watch('farmerName')} ({methods.watch('farmerPhone')})</p>
                    <p><strong>Location:</strong> {methods.watch('farmVillage')}, {methods.watch('town')}, {methods.watch('district')}</p>
                    <p><strong>Fish:</strong> {methods.watch('estimatedKg')} kg {methods.watch('species')}, avg {methods.watch('averageFishGrams')}g</p>
                    {estValue !== null && <p><strong>Estimated value:</strong> USD {estValue.toLocaleString()}</p>}
                    <p><strong>Harvest:</strong> {methods.watch('harvestDate')}</p>
                    <p><strong>Collection:</strong> {methods.watch('preferredDate')} ({methods.watch('preferredTime')})</p>
                    <p><strong>Images:</strong> {images.length} {images.length === 1 ? 'image' : 'images'}</p>
                  </div>

                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    {[
                      { field: 'consentAccurate', label: 'I confirm the information above is accurate' },
                      { field: 'consentVerified', label: 'I understand final weight will be verified at collection' },
                      { field: 'consentEstimate', label: 'I understand the displayed value is only an estimate' },
                      { field: 'consentReview', label: 'I understand Agrimarine must review and approve the request' },
                    ].map(({ field, label }) => (
                      <label key={field} className="flex items-start gap-2">
                        <input type="checkbox" {...methods.register(field as keyof FishSubmissionFormData, { required: true })} className="mt-0.5 rounded border-gray-300" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div>
                {step > 0 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                )}
              </div>
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" loading={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </section>
    </div>
  )
}
