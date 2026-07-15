import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, DollarSign, Truck, Users, CheckCircle, Droplets, Fish, Phone, MessageCircle } from 'lucide-react'
import { env } from '@/config/env'

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const ease = [0.21, 0.47, 0.32, 0.98] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

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
      {/* === HERO === */}
      <section className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-navy-900/85 to-navy-900/95" />
          <div className="absolute inset-0 bg-[url('/images/overviewhero.jpg')] bg-cover bg-center opacity-30" />
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)' }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.06), transparent 70%)' }}
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm text-aqua-300 text-xs font-medium rounded-full mb-4">
              Trusted by farmers across Zimbabwe
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Your Trusted Partner in<br />
              <span className="bg-gradient-to-r from-aqua-400 to-teal-400 bg-clip-text text-transparent">
                Aquaculture
              </span>
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-xl">
              Agrimarine Solutions provides complete aquaculture services in Zimbabwe — from pond design and fingerlings to fish buy-back and refrigerated collection.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/sell-fish" className="inline-flex items-center gap-2 px-6 py-3 bg-aqua-500 text-white rounded-xl font-medium hover:bg-aqua-400 transition-all hover:shadow-lg hover:shadow-aqua-500/25 active:scale-95">
                Sell Your Fish <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/20 active:scale-95">
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === STATS === */}
      <section className="py-16 bg-surface relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { label: 'Farmers Served', value: '500+' },
              { label: 'Fish Collected', value: '50T+' },
              { label: 'Years Experience', value: '10+' },
              { label: 'Service Areas', value: '12+' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-2xl md:text-3xl font-bold text-navy-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === SERVICES === */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-4">Our Services</h2>
            <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">End-to-end aquaculture solutions designed for Zimbabwean farmers.</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {services.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-gray-100 hover:border-aqua-200/50 hover:shadow-xl transition-all overflow-hidden bg-white"
              >
                <div className="h-40 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${s.img})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 bg-aqua-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-aqua-100 transition-colors">
                    <s.icon className="h-5 w-5 text-aqua-600" />
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/services" className="inline-flex items-center gap-2 text-aqua-600 hover:text-aqua-500 font-medium transition-colors">
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* === PROCESS === */}
      <section className="py-16 bg-surface relative overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.04), transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-4">How Fish Buy-Back Works</h2>
            <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">From your pond to payment — a seamless process designed for farmers.</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {process.map((step) => (
              <motion.div key={step.title} variants={fadeUp} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-aqua-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-aqua-200/30 transition-all">
                  <step.icon className="h-8 w-8 text-aqua-600" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">Everything you need to know about working with Agrimarine.</p>
          </motion.div>
          <motion.div
            className="max-w-2xl mx-auto space-y-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {faqs.map((faq) => (
              <motion.details
                key={faq.q}
                variants={fadeUp}
                className="group bg-white rounded-2xl border border-gray-100 open:border-aqua-200/50 open:shadow-sm transition-all overflow-hidden"
              >
                <summary className="px-6 py-4 font-medium text-navy-900 cursor-pointer flex items-center justify-between">
                  <span>{faq.q}</span>
                  <ChevronIcon />
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-16 bg-navy-900 text-white relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06), transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Contact us today to discuss your aquaculture needs. We are here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={`tel:${env.whatsappNumber}`} className="inline-flex items-center gap-2 px-6 py-3 bg-aqua-500 rounded-xl font-medium hover:bg-aqua-400 transition-all hover:shadow-lg hover:shadow-aqua-500/25 active:scale-95">
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <a href={`https://wa.me/${env.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 rounded-xl font-medium hover:bg-green-500 transition-all active:scale-95">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
