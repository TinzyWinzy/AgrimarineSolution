import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TextArea } from '@/components/ui/TextArea'
import { useToastStore } from '@/components/ui/Toast'
import { CheckCircle } from 'lucide-react'

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
        <div className="text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
          <h2 className="text-xl font-bold text-navy-900">Quote Request Received</h2>
          <p className="text-gray-600 text-sm">We will review and respond within 24 hours.</p>
          <a href="/" className="text-aqua-600 text-sm">Return home</a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-navy-900 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Request a Quote</h1>
          <p className="text-white/70 text-sm">Tell us what you need and we will provide a competitive quote.</p>
        </div>
      </section>
      <section className="py-8 max-w-lg mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
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
        </form>
      </section>
    </div>
  )
}
