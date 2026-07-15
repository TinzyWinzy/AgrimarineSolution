import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Droplets, Shield, Fish, Truck, BookOpen, Building2, Pill, ArrowRight } from 'lucide-react'

const ease = [0.21, 0.47, 0.32, 0.98] as const

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

const servicesList = [
  { icon: Droplets, title: 'Pond Design & Construction', desc: 'Professional pond design and construction for commercial and smallholder operations.', img: '/images/pool1.jpg' },
  { icon: Shield, title: 'Dam Liners', desc: 'High-quality HDPE dam liners for water conservation and fish farming.', img: '/images/damliners.jpg' },
  { icon: Fish, title: 'Nile Tilapia Fingerlings', desc: 'Quality fingerlings from carefully managed breeding stock.', img: '/images/fish1.jpg' },
  { icon: Truck, title: 'Fish Feed', desc: 'Nutritionally balanced feed for optimal growth.', img: '/images/packages.jpg' },
  { icon: Pill, title: 'Fish Medication', desc: 'Treatments and health products for common aquaculture conditions.', img: '/images/planktonbooster.jpg' },
  { icon: Droplets, title: 'Water Reservoirs', desc: 'Water storage solutions for farming operations.', img: '/images/pool2.jpg' },
  { icon: Building2, title: 'Cage Farming', desc: 'Cage culture systems for dams and larger water bodies.', img: '/images/overviewhero.jpg' },
  { icon: BookOpen, title: 'Practical Training', desc: 'Hands-on training from pond preparation to harvest planning.', img: '/images/hero1.jpg' },
  { icon: Truck, title: 'Fish Buy-Back', desc: 'Guaranteed market for your harvest with refrigerated collection.', img: '/images/fishhand.jpg' },
  { icon: Truck, title: 'Refrigerated Collection', desc: 'Temperature-controlled transport to maintain fish quality.', img: '/images/hero2.jpg' },
]

export default function ServicesPage() {
  return (
    <div>
      <section className="relative bg-navy-900 overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06), transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-white/60 max-w-2xl text-lg">
              Complete aquaculture services for Zimbabwean fish farmers — from pond to plate.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {servicesList.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-gray-100 hover:border-aqua-200/50 hover:shadow-xl transition-all overflow-hidden bg-white"
              >
                <div className="h-40 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${s.img})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
        </div>
      </section>

      <section className="py-16 bg-surface text-center relative overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.04), transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Need Something Specific?</h2>
            <p className="text-gray-500 mb-6">Contact us for a custom quote or consultation.</p>
            <Link to="/request-quote" className="inline-flex items-center gap-2 px-6 py-3 bg-aqua-500 text-white rounded-xl font-medium hover:bg-aqua-400 transition-all hover:shadow-lg hover:shadow-aqua-500/25 active:scale-95">
              Request a Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
