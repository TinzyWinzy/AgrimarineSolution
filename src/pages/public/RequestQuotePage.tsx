import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TextArea } from '@/components/ui/TextArea'
import { useToastStore } from '@/components/ui/Toast'
import { CheckCircle } from 'lucide-react'

const ease = [0.21, 0.47, 0.32, 0.98] as const

const services = ['Pond design', 'Pond construction', 'Dam liners', 'Fingerlings', 'Fish feed', 'Medication', 'Water reservoirs', 'Cage farming', 'Farm assessment', 'Technical consultation', 'Practical training', 'Complete setup', 'Other']

export default function RequestQuotePage() {
  const [submitted, setSubmitted] = useState(false)
  const { addToast } = useToastStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addToast('success', 'Quote request submitted! We will contact you soon.')
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
          <h2 className="text-xl font-bold text-navy-900">Quote Request Received</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">We will review your request and respond within 24 hours.</p>
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
          className="absolute top-10 left-10 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06), transparent 70%)' }}
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Request a Quote</h1>
            <p className="text-white/60 text-sm">Tell us what you need and we will provide a competitive quote.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 max-w-lg mx-auto px-4">
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          <Input label="Full name *" id="name" required />
          <Input label="Phone *" id="phone" required />
          <Input label="Email" id="email" type="email" />
          <Input label="Location" id="location" />
          <Select label="Service *" id="service" options={services.map(s => ({ value: s, label: s }))} placeholder="Select service" required />
          <TextArea label="Description *" id="description" required />
          <Select label="Budget range" id="budget" options={[
            { value: 'Under USD 500', label: 'Under USD 500' },
            { value: 'USD 500 - 2,000', label: 'USD 500 - 2,000' },
            { value: 'USD 2,000 - 10,000', label: 'USD 2,000 - 10,000' },
            { value: 'Over USD 10,000', label: 'Over USD 10,000' },
            { value: 'Not sure', label: 'Not sure' },
          ]} placeholder="Select range" />
          <Button type="submit" className="w-full">Submit Quote Request</Button>
        </motion.form>
      </section>
    </div>
  )
}
