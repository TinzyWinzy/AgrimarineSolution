import { Link } from 'react-router-dom'
import { ArrowRight, Shield, DollarSign, Truck, Users, CheckCircle, Droplets, Fish, Phone, MessageCircle } from 'lucide-react'
import { env } from '@/config/env'

const services = [
  { icon: Droplets, title: 'Pond Design & Construction', desc: 'Professional pond construction for commercial and smallholder farms.', img: '/images/pool1.jpg' },
  { icon: Shield, title: 'Dam Liners', desc: 'High-quality HDPE dam liners for water conservation.', img: '/images/damliners.jpg' },
  { icon: Fish, title: 'Nile Tilapia Fingerlings', desc: 'Quality fingerlings from reputable breeding stock.', img: '/images/fish1.jpg' },
  { icon: Truck, title: 'Fish Buy-Back', desc: 'Guaranteed market for your harvest at competitive prices.', img: '/images/fishhand.jpg' },
]

const process = [
  { icon: Users, title: '1. Submit Your Harvest', desc: 'Tell us about your fish through our simple form.' },
  { icon: CheckCircle, title: '2. We Review', desc: 'Our team reviews your submission within 24 hours.' },
  { icon: Truck, title: '3. We Collect', desc: 'Scheduled collection at your farm with refrigerated transport.' },
  { icon: DollarSign, title: '4. You Get Paid', desc: 'Verified weight, fair price, prompt payment.' },
]

const faqs = [
  { q: 'How do I sell my fish to Agrimarine?', a: 'Use our Sell Your Fish form to submit details. We will review and schedule collection from your farm.' },
  { q: 'What species do you buy?', a: 'Currently Nile tilapia and catfish. Minimum average weight of 300 grams.' },
  { q: 'How is the price determined?', a: 'Prices are set per kilogram based on species and market rates. Final value is determined after verified weighing at collection.' },
  { q: 'Do you provide training?', a: 'Yes, we offer practical aquaculture training from pond preparation to harvest planning.' },
]

export default function HomePage() {
  return (
    <div>
      <section className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/95 to-navy-900/80" />
        <div className="absolute inset-0 bg-[url('/images/overviewhero.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Your Trusted Partner in<br />
              <span className="text-aqua-400">Aquaculture</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Agrimarine Solutions provides complete aquaculture services in Zimbabwe — from pond design and fingerlings to fish buy-back and refrigerated collection.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/sell-fish" className="inline-flex items-center gap-2 px-6 py-3 bg-aqua-500 text-white rounded-lg font-medium hover:bg-aqua-400 transition-colors">
                Sell Your Fish <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20">
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Farmers Served', value: '500+' },
              { label: 'Fish Collected', value: '50T+' },
              { label: 'Years Experience', value: '10+' },
              { label: 'Service Areas', value: '12+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-navy-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="rounded-xl border border-gray-200 hover:border-aqua-200 hover:shadow-md transition-all overflow-hidden bg-white">
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${s.img})` }} />
                <div className="p-6">
                  <s.icon className="h-8 w-8 text-aqua-500 mb-3" />
                  <h3 className="font-semibold text-navy-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="inline-flex items-center gap-2 text-aqua-600 hover:text-aqua-500 font-medium">
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-12">How Fish Buy-Back Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {process.map((step) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-aqua-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-aqua-600" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-surface rounded-xl border border-gray-200 open:border-aqua-200">
                <summary className="px-6 py-4 font-medium text-navy-900 cursor-pointer">{faq.q}</summary>
                <div className="px-6 pb-4 text-sm text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            Contact us today to discuss your aquaculture needs. We are here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`tel:${env.whatsappNumber}`} className="inline-flex items-center gap-2 px-6 py-3 bg-aqua-500 rounded-lg font-medium hover:bg-aqua-400 transition-colors">
              <Phone className="h-4 w-4" /> Call Us
            </a>
            <a href={`https://wa.me/${env.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 rounded-lg font-medium hover:bg-green-500 transition-colors">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
