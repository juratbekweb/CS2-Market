import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-accent-primary/15 bg-bg-primary/85">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgb(var(--color-accent-primary)/0.14),transparent_35%),linear-gradient(180deg,rgb(var(--color-accent-tertiary)/0.06),transparent_45%)]"></div>
      <div className="container mx-auto px-4 py-12">
        <div className="relative z-10 grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
          <div className="theme-soft-panel rounded-3xl p-6">
            <h3 className="theme-heading-gradient mb-4 text-xl font-bold">CS2 Marketplace</h3>
            <p className="mb-4 text-text-secondary">
              The premier destination for Counter-Strike 2 skin trading and collecting.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-secondary transition-all hover:border-accent-primary hover:bg-accent-primary hover:text-bg-primary">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-secondary transition-all hover:border-accent-primary hover:bg-accent-primary hover:text-bg-primary">
                <i className="fab fa-discord"></i>
              </a>
              <a href="https://steamcommunity.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-secondary transition-all hover:border-accent-primary hover:bg-accent-primary hover:text-bg-primary">
                <i className="fab fa-steam"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-secondary transition-all hover:border-accent-primary hover:bg-accent-primary hover:text-bg-primary">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div className="theme-soft-panel rounded-3xl p-6">
            <h4 className="mb-4 text-accent-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-text-secondary transition-colors hover:text-accent-primary">Browse Items</Link></li>
              <li><Link to="/account" className="text-text-secondary transition-colors hover:text-accent-primary">My Account</Link></li>
              <li><Link to="/cart" className="text-text-secondary transition-colors hover:text-accent-primary">Shopping Cart</Link></li>
              <li><span className="text-text-secondary cursor-not-allowed">How to Trade (Coming Soon)</span></li>
            </ul>
          </div>
          
          <div className="theme-soft-panel rounded-3xl p-6">
            <h4 className="mb-4 text-accent-primary">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary transition-colors hover:text-accent-primary">Terms of Service</a></li>
              <li><a href="#" className="text-text-secondary transition-colors hover:text-accent-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-text-secondary transition-colors hover:text-accent-primary">Refund Policy</a></li>
              <li><a href="#" className="text-text-secondary transition-colors hover:text-accent-primary">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div className="theme-soft-panel rounded-3xl p-6">
            <h4 className="mb-4 text-accent-primary">Contact</h4>
            <ul className="space-y-2">
              <li><a href="mailto:support@cs2marketplace.com" className="text-text-secondary transition-colors hover:text-accent-primary">support@cs2marketplace.com</a></li>
              <li><a href="#" className="text-text-secondary transition-colors hover:text-accent-primary">Live Chat</a></li>
              <li><a href="#" className="text-text-secondary transition-colors hover:text-accent-primary">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="relative z-10 border-t border-white/10 pt-8 text-center text-text-secondary">
          <p>&copy; 2026 CS2 Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

