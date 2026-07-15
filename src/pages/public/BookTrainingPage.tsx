import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TextArea } from '@/components/ui/TextArea'
import { useToastStore } from '@/components/ui/Toast'
import { CheckCircle } from 'lucide-react'

const ease = [0.21, 0.47, 0.32, 0.98] as const

const topics = ['Introduction to fish farming', 'Pond preparation', 'Stocking', 'Feeding and nutrition', 'Water quality management', 'Fish health', 'Harvest planning', 'Aquaculture business management', 'Farm-based practical training']

export default function BookTrainingPage() {
  const [submitted, setSubmitted] = useState(false)
  const { addToast } = useToastStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addToast('success', 'Training booking submitted! We will contact you.')
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
          <h2 className="text-xl font-bold text-navy-900">Training Booking Received</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">We will confirm the details and propose dates.</p>
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
          className="absolute top-10 right-20 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06), transparent 70%)' }}
          animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Book Training</h1>
            <p className="text-white/60 text-sm">Practical aquaculture training delivered by experienced professionals.</p>
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
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-600">I am booking for an organisation</span>
          </label>
          <Input label="Participant count" id="count" type="number" min={1} />
          <Select label="Training topic *" id="topic" options={topics.map(t => ({ value: t, label: t }))} placeholder="Select topic" required />
          <Input label="Preferred date" id="date" type="date" />
          <Select label="Venue preference" id="venue" options={[
            { value: 'On-site', label: 'On-site at my farm' },
            { value: 'Agrimarine venue', label: 'At Agrimarine venue' },
          ]} />
          <Select label="Experience level" id="level" options={[
            { value: 'Beginner', label: 'Beginner' },
            { value: 'Intermediate', label: 'Intermediate' },
            { value: 'Advanced', label: 'Advanced' },
          ]} />
          <TextArea label="Notes" id="notes" />
          <Button type="submit" className="w-full">Submit Booking</Button>
        </motion.form>
      </section>
    </div>
  )
}
