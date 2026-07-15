import { motion } from 'framer-motion'
import { Phone, MessageCircle, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { env } from '@/config/env'

const ease = [0.21, 0.47, 0.32, 0.98] as const

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const contacts = [
  {
    icon: MapPin,
    label: 'Address',
    value: '48 Gelcon Avenue, Greendale, Harare, Zimbabwe',
    color: 'text-aqua-500',
    bg: 'bg-aqua-50',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+263 778 840 934 / +263 779 812 900',
    color: 'text-aqua-500',
    bg: 'bg-aqua-50',
    href: `tel:${env.whatsappNumber}`,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Message us on WhatsApp',
    color: 'text-green-500',
    bg: 'bg-green-50',
    href: `https://wa.me/${env.whatsappNumber.replace(/[^0-9]/g, '')}`,
    external: true,
  },
]

export default function ContactPage() {
  return (
    <div>
      <section className="relative bg-navy-900 overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.06), transparent 70%)' }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-white/60 max-w-2xl text-lg">Get in touch with the Agrimarine team. We are here to help.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              className="space-y-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <motion.div variants={fadeUp}>
                <span className="inline-block px-3 py-1 bg-aqua-50 text-aqua-600 text-xs font-medium rounded-full mb-4">Get in Touch</span>
                <h2 className="text-2xl font-bold text-navy-900">We'd Love to Hear from You</h2>
              </motion.div>
              <div className="space-y-4">
                {contacts.map((c) => (
                  <motion.div key={c.label} variants={fadeUp}>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.external ? '_blank' : undefined}
                        rel={c.external ? 'noopener noreferrer' : undefined}
                        className="flex items-start gap-3 p-4 bg-surface/80 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-aqua-200/50 hover:shadow-sm transition-all group"
                      >
                        <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center shrink-0`}>
                          <c.icon className={`h-5 w-5 ${c.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-navy-900 text-sm">{c.label}</p>
                          <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{c.value}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 p-4 bg-surface/80 backdrop-blur-sm rounded-2xl border border-gray-100">
                        <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center shrink-0`}>
                          <c.icon className={`h-5 w-5 ${c.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-navy-900 text-sm">{c.label}</p>
                          <p className="text-sm text-gray-500">{c.value}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="h-80 bg-cover bg-center" style={{ backgroundImage: "url('/images/1.jpg')" }} />
            </motion.div>
          </div>

          <motion.div
            className="grid sm:grid-cols-3 gap-4 mt-12"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div variants={fadeUp}>
              <Link to="/sell-fish" className="flex items-center justify-center gap-2 px-4 py-3 bg-aqua-500 text-white text-sm rounded-xl hover:bg-aqua-400 transition-all hover:shadow-lg hover:shadow-aqua-500/25 active:scale-95">
                Sell Your Fish <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link to="/request-quote" className="flex items-center justify-center gap-2 px-4 py-3 border border-aqua-200 text-aqua-600 text-sm rounded-xl hover:bg-aqua-50 transition-all active:scale-95">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link to="/book-training" className="flex items-center justify-center gap-2 px-4 py-3 border border-aqua-200 text-aqua-600 text-sm rounded-xl hover:bg-aqua-50 transition-all active:scale-95">
                Book Training <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
