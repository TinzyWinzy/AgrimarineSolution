import { motion } from 'framer-motion'
import { Shield, Users, Trophy, Heart, MapPin } from 'lucide-react'

const ease = [0.21, 0.47, 0.32, 0.98] as const

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const values = [
  { icon: Shield, title: 'Quality', desc: 'We maintain high standards in all our products and services.' },
  { icon: Users, title: 'Community', desc: 'Supporting Zimbabwean farmers with fair partnerships.' },
  { icon: Trophy, title: 'Excellence', desc: 'Professional aquaculture services you can rely on.' },
  { icon: Heart, title: 'Sustainability', desc: 'Promoting sustainable fish farming practices.' },
]

export default function AboutPage() {
  return (
    <div>
      <section className="relative bg-navy-900 overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)' }}
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About Agrimarine Solutions</h1>
            <p className="text-white/60 max-w-2xl text-lg">
              Professional aquaculture services based in Harare, Zimbabwe, serving farmers across the country.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="h-80 bg-cover bg-center" style={{ backgroundImage: "url('/images/1.jpg')" }} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease }}
            >
              <span className="inline-block px-3 py-1 bg-aqua-50 text-aqua-600 text-xs font-medium rounded-full mb-4">Our Story</span>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Bridging Farmers & Markets</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Agrimarine Solutions was founded to bridge the gap between Zimbabwean fish farmers and reliable markets.
                We provide end-to-end aquaculture support from pond design and fingerlings to fish buy-back and refrigerated collection.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Located at 48 Gelcon Avenue, Greendale, Harare, we serve farmers in Harare, Marondera, Murehwa, Goromonzi,
                Bindura, and beyond. Our team brings years of practical aquaculture experience to every partnership.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface relative overflow-hidden">
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.04), transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <span className="inline-block px-3 py-1 bg-aqua-50 text-aqua-600 text-xs font-medium rounded-full mb-4">Our Values</span>
            <h2 className="text-2xl font-bold text-navy-900 mb-8">What Drives Us</h2>
          </motion.div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-aqua-50 rounded-xl flex items-center justify-center mb-3">
                  <v.icon className="h-5 w-5 text-aqua-600" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease }}
            >
              <span className="inline-block px-3 py-1 bg-aqua-50 text-aqua-600 text-xs font-medium rounded-full mb-4">Location</span>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Visit Us</h2>
              <div className="bg-surface/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-aqua-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-navy-900">48 Gelcon Avenue</p>
                    <p className="text-gray-500 text-sm">Greendale, Harare, Zimbabwe</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm pt-2 border-t border-gray-100">+263 778 840 934 / +263 779 812 900</p>
              </div>
            </motion.div>
            <motion.div
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="h-80 bg-cover bg-center" style={{ backgroundImage: "url('/images/phmeter.jpg')" }} />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
