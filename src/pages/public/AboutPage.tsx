import { Shield, Users, Trophy, Heart } from 'lucide-react'

const values = [
  { icon: Shield, title: 'Quality', desc: 'We maintain high standards in all our products and services.' },
  { icon: Users, title: 'Community', desc: 'Supporting Zimbabwean farmers with fair partnerships.' },
  { icon: Trophy, title: 'Excellence', desc: 'Professional aquaculture services you can rely on.' },
  { icon: Heart, title: 'Sustainability', desc: 'Promoting sustainable fish farming practices.' },
]

export default function AboutPage() {
  return (
    <div>
      <section className="bg-navy-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About Agrimarine Solutions</h1>
          <p className="text-white/70 max-w-2xl">
            Professional aquaculture services based in Harare, Zimbabwe, serving farmers across the country.
          </p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Agrimarine Solutions was founded to bridge the gap between Zimbabwean fish farmers and reliable markets.
                We provide end-to-end aquaculture support from pond design and fingerlings to fish buy-back and refrigerated collection.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Located at 48 Gelcon Avenue, Greendale, Harare, we serve farmers in Harare, Marondera, Murehwa, Goromonzi,
                Bindura, and beyond. Our team brings years of practical aquaculture experience to every partnership.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="p-4 bg-surface rounded-xl border border-gray-200">
                  <v.icon className="h-8 w-8 text-aqua-500 mb-2" />
                  <h3 className="font-semibold text-navy-900 text-sm">{v.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy-900 text-center mb-8">Our Location</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg mx-auto text-center">
            <p className="font-semibold text-navy-900">48 Gelcon Avenue</p>
            <p className="text-gray-600">Greendale, Harare, Zimbabwe</p>
            <p className="text-gray-600">+263 778 840 934 / +263 779 812 900</p>
          </div>
        </div>
      </section>
    </div>
  )
}
