import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-bg-secondary/95 backdrop-blur-lg border-b border-border-color sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-accent-primary">
            <i className="fas fa-crosshairs text-3xl animate-pulse-slow"></i>
            <span>CS2 Marketplace</span>
          </Link>
          
          <ul className={`hidden md:flex items-center gap-8 ${isMenuOpen ? 'flex' : ''}`}>
            <li>
              <Link 
                to="/" 
                className={`transition-colors ${isActive('/') ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-text-secondary hover:text-accent-primary'}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                className={`transition-colors ${isActive('/products') ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-text-secondary hover:text-accent-primary'}`}
              >
                Browse
              </Link>
            </li>
            <li>
              <Link 
                to="/account" 
                className={`transition-colors ${isActive('/account') ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-text-secondary hover:text-accent-primary'}`}
              >
                Account
              </Link>
            </li>
            <li>
              <Link to="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                <i className="fas fa-shopping-cart"></i> Cart 
                <span className="ml-2 bg-accent-primary text-bg-primary px-2 py-0.5 rounded-full text-sm">
                  {cartCount}
                </span>
              </Link>
            </li>
          </ul>

          <button 
            className="md:hidden flex flex-col gap-1.5 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-accent-primary transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-accent-primary transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-accent-primary transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/" className="text-text-secondary hover:text-accent-primary">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-text-secondary hover:text-accent-primary">Browse</Link>
              </li>
              <li>
                <Link to="/account" className="text-text-secondary hover:text-accent-primary">Account</Link>
              </li>
              <li>
                <Link to="#" className="text-text-secondary hover:text-accent-primary">
                  <i className="fas fa-shopping-cart"></i> Cart ({cartCount})
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

