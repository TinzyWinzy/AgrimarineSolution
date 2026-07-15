import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TextArea } from '@/components/ui/TextArea'
import { useToastStore } from '@/components/ui/Toast'
import { CheckCircle, Plus, Trash2 } from 'lucide-react'

const ease = [0.21, 0.47, 0.32, 0.98] as const

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
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-navy-900">Order Enquiry Received</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">We will confirm stock availability and provide a quote.</p>
          <a href="/" className="inline-block text-sm text-aqua-600 hover:text-aqua-500 font-medium">Return home</a>
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      <section className="relative bg-navy-900 overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <motion.div
          className="absolute bottom-10 right-10 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.05), transparent 70%)' }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Order Supplies</h1>
            <p className="text-white/60 text-sm">Browse products and submit an enquiry. Prices shown are indicative.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="h-80 bg-cover bg-center" style={{ backgroundImage: "url('/images/packages.jpg')" }} />
            <div className="p-4 bg-white/80 backdrop-blur-sm">
              <p className="text-sm text-gray-500">Quality fingerlings, feeds, and aquaculture supplies delivered to your farm.</p>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease }}
          >
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
                    <button type="button" onClick={() => removeItem(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-aqua-600 hover:text-aqua-500 transition-colors">
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
          </motion.form>
        </div>
      </section>
    </div>
  )
}
