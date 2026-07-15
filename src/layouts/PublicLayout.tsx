import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Phone, MessageCircle, Droplets } from 'lucide-react'
import { env } from '@/config/env'
import { motion, AnimatePresence } from 'framer-motion'

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/sell-fish', label: 'Sell Fish' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="sticky top-0 z-30">
        <div className="glass-dark border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2 text-navy-900">
                <Droplets className="h-7 w-7 text-aqua-500" />
                <span className="font-bold text-lg">Agrimarine</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'text-aqua-600'
                        : 'text-navy-700/70 hover:text-aqua-500'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  className="px-4 py-2 bg-navy-900 text-white text-sm rounded-xl hover:bg-navy-800 transition-all hover:shadow-lg"
                >
                  Staff Login
                </Link>
              </nav>

              <button
                className="md:hidden p-2 text-navy-700"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden glass-strong border-b border-white/20 shadow-lg"
            >
              <nav className="px-4 py-3 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                      location.pathname === link.to
                        ? 'bg-navy-900 text-white'
                        : 'text-navy-700/80 hover:bg-white/20'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 bg-navy-900 text-white text-sm rounded-xl text-center mt-2"
                >
                  Staff Login
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="h-6 w-6 text-aqua-400" />
                <span className="font-bold text-lg">Agrimarine Solutions</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Professional aquaculture services in Zimbabwe. Pond design, dam liners, fingerlings, feed, and fish buy-back.
              </p>

            </div>
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <div className="space-y-2 text-sm text-white/60">
                <Link to="/services" className="block hover:text-aqua-400 transition-colors">Services</Link>
                <Link to="/sell-fish" className="block hover:text-aqua-400 transition-colors">Sell Your Fish</Link>
                <Link to="/request-quote" className="block hover:text-aqua-400 transition-colors">Request a Quote</Link>
                <Link to="/contact" className="block hover:text-aqua-400 transition-colors">Contact Us</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <div className="space-y-2 text-sm text-white/60">
                <Link to="/book-training" className="block hover:text-aqua-400 transition-colors">Book Training</Link>
                <Link to="/order-supplies" className="block hover:text-aqua-400 transition-colors">Order Supplies</Link>
                <Link to="/track" className="block hover:text-aqua-400 transition-colors">Track Order</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <div className="space-y-2 text-sm text-white/60">
                <p>48 Gelcon Avenue, Greendale, Harare</p>
                <a href={`tel:${env.whatsappNumber}`} className="flex items-center gap-2 hover:text-aqua-400 transition-colors">
                  <Phone className="h-4 w-4" /> {env.whatsappNumber}
                </a>
                <a
                  href={`https://wa.me/${env.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-green-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-navy-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} Agrimarine Solutions. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-aqua-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-aqua-400 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
