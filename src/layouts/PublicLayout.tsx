import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Phone, MessageCircle, Droplets } from 'lucide-react'
import { env } from '@/config/env'

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
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy-900 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Droplets className="h-7 w-7 text-aqua-400" />
              <span className="font-bold text-lg">Agrimarine</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-aqua-400 ${
                    location.pathname === link.to ? 'text-aqua-400' : 'text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="px-4 py-2 bg-aqua-500 text-white text-sm rounded-lg hover:bg-aqua-400 transition-colors"
              >
                Staff Login
              </Link>
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-navy-700 animate-fade-in">
            <nav className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm ${
                    location.pathname === link.to
                      ? 'bg-navy-700 text-aqua-400'
                      : 'text-white/80 hover:bg-navy-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 bg-aqua-500 text-white text-sm rounded-lg text-center mt-2"
              >
                Staff Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="h-6 w-6 text-aqua-400" />
                <span className="font-bold text-lg">Agrimarine Solutions</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Professional aquaculture services in Zimbabwe. Pond design, dam liners, fingerlings, feed, and fish buy-back.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <div className="space-y-2 text-sm text-white/70">
                <Link to="/services" className="block hover:text-aqua-400">Services</Link>
                <Link to="/sell-fish" className="block hover:text-aqua-400">Sell Your Fish</Link>
                <Link to="/request-quote" className="block hover:text-aqua-400">Request a Quote</Link>
                <Link to="/contact" className="block hover:text-aqua-400">Contact Us</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <div className="space-y-2 text-sm text-white/70">
                <p>48 Gelcon Avenue, Greendale, Harare</p>
                <a href={`tel:${env.whatsappNumber}`} className="flex items-center gap-2 hover:text-aqua-400">
                  <Phone className="h-4 w-4" /> {env.whatsappNumber}
                </a>
                <a
                  href={`https://wa.me/${env.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-green-400"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-navy-700 mt-8 pt-8 text-center text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} Agrimarine Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
