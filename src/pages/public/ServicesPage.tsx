import { Link } from 'react-router-dom'
import { Droplets, Shield, Fish, Truck, BookOpen, Building2, Pill, ArrowRight } from 'lucide-react'

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
      <section className="bg-navy-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-white/70 max-w-2xl">
            Complete aquaculture services for Zimbabwean fish farmers.
          </p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((s) => (
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
        </div>
      </section>
      <section className="py-16 bg-surface text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Need Something Specific?</h2>
          <p className="text-gray-600 mb-6">Contact us for a custom quote or consultation.</p>
          <Link to="/request-quote" className="inline-flex items-center gap-2 px-6 py-3 bg-aqua-500 text-white rounded-lg font-medium hover:bg-aqua-400 transition-colors">
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
