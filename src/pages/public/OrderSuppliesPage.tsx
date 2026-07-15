import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TextArea } from '@/components/ui/TextArea'
import { useToastStore } from '@/components/ui/Toast'
import { CheckCircle, Plus, Trash2 } from 'lucide-react'

const products = [
  { name: 'Nile tilapia fingerlings', unit: 'per 100' },
  { name: 'Fish feed - starter', unit: 'kg' },
  { name: 'Fish feed - grower', unit: 'kg' },
  { name: 'Fish feed - finisher', unit: 'kg' },
  { name: 'Oxytetracycline', unit: 'bottle' },
  { name: 'HDPE dam liner', unit: 'sq m' },
  { name: 'Water reservoir', unit: 'unit' },
  { name: 'Cage netting', unit: 'm' },
]

interface LineItem {
  product: string
  quantity: number
}

export default function OrderSuppliesPage() {
  const [submitted, setSubmitted] = useState(false)
  const [items, setItems] = useState<LineItem[]>([{ product: '', quantity: 0 }])
  const { addToast } = useToastStore()

  const addItem = () => setItems([...items, { product: '', quantity: 0 }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof LineItem, value: string) => {
    const updated = [...items]
    const item = { ...updated[i] }
    ;(item as Record<string, string | number>)[field] = field === 'quantity' ? Number(value) : value
    updated[i] = item as LineItem
    setItems(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addToast('success', 'Supply request submitted!')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
          <h2 className="text-xl font-bold text-navy-900">Order Enquiry Received</h2>
          <p className="text-gray-600 text-sm">We will confirm stock availability and provide a quote.</p>
          <a href="/" className="text-aqua-600 text-sm">Return home</a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-navy-900 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Order Supplies</h1>
          <p className="text-white/70 text-sm">Browse products and submit an enquiry. Prices shown are indicative.</p>
        </div>
      </section>
      <section className="py-8 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <div className="h-80 bg-cover bg-center" style={{ backgroundImage: "url('/images/packages.jpg')" }} />
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-600">Quality fingerlings, feeds, and aquaculture supplies delivered to your farm.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <Input label="Full name *" id="name" required />
            <Input label="Phone *" id="phone" required />
            <Input label="Email" id="email" type="email" />
            <Input label="Location" id="location" />

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-800">Items</label>
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Select id={`product-${i}`} options={products.map(p => ({ value: p.name, label: `${p.name} (${p.unit})` }))} placeholder="Select product" value={item.product} onChange={e => updateItem(i, 'product', e.target.value)} className="flex-1" />
                  <Input type="number" placeholder="Qty" value={item.quantity || ''} onChange={e => updateItem(i, 'quantity', e.target.value)} className="w-20" />
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-aqua-600 hover:text-aqua-500">
                <Plus className="h-4 w-4" /> Add item
              </button>
            </div>

            <Select label="Collection or delivery" id="method" options={[
              { value: 'Collection', label: 'I will collect' },
              { value: 'Delivery enquiry', label: 'I need delivery' },
            ]} />
            <TextArea label="Notes" id="notes" />
            <p className="text-xs text-gray-400">Prices shown are demonstration data for evaluation purposes.</p>
            <Button type="submit" className="w-full">Submit Enquiry</Button>
          </form>
        </div>
      </section>
    </div>
  )
}
