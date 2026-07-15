import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react'
import { env } from '@/config/env'

export default function ContactPage() {
  return (
    <div>
      <section className="bg-navy-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/70 max-w-2xl">Get in touch with the Agrimarine team.</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-navy-900">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-aqua-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-900">Address</p>
                    <p className="text-sm text-gray-600">48 Gelcon Avenue, Greendale, Harare, Zimbabwe</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-aqua-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-900">Phone</p>
                    <a href={`tel:${env.whatsappNumber}`} className="text-sm text-aqua-600 hover:text-aqua-500 block">+263 778 840 934</a>
                    <a href="tel:+263779812900" className="text-sm text-aqua-600 hover:text-aqua-500 block">+263 779 812 900</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-900">WhatsApp</p>
                    <a href={`https://wa.me/${env.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-500">
                      Message us on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-navy-900 mb-4">Alternatively</h3>
              <p className="text-sm text-gray-600 mb-4">
                Use our online forms to submit requests directly:
              </p>
              <div className="space-y-2">
                <a href="/sell-fish" className="block px-4 py-2 bg-aqua-500 text-white text-sm rounded-lg text-center hover:bg-aqua-400 transition-colors">Sell Your Fish</a>
                <a href="/request-quote" className="block px-4 py-2 border border-aqua-500 text-aqua-600 text-sm rounded-lg text-center hover:bg-aqua-50 transition-colors">Request a Quote</a>
                <a href="/book-training" className="block px-4 py-2 border border-aqua-500 text-aqua-600 text-sm rounded-lg text-center hover:bg-aqua-50 transition-colors">Book Training</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
