export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border-color mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-accent-primary text-xl font-bold mb-4">CS2 Marketplace</h3>
            <p className="text-text-secondary mb-4">
              The premier destination for Counter-Strike 2 skin trading and collecting.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-bg-tertiary border border-border-color rounded-full text-text-secondary hover:bg-accent-primary hover:text-bg-primary hover:border-accent-primary transition-all">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-bg-tertiary border border-border-color rounded-full text-text-secondary hover:bg-accent-primary hover:text-bg-primary hover:border-accent-primary transition-all">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-bg-tertiary border border-border-color rounded-full text-text-secondary hover:bg-accent-primary hover:text-bg-primary hover:border-accent-primary transition-all">
                <i className="fab fa-steam"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-bg-tertiary border border-border-color rounded-full text-text-secondary hover:bg-accent-primary hover:text-bg-primary hover:border-accent-primary transition-all">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-accent-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/products" className="text-text-secondary hover:text-accent-primary transition-colors">Browse Items</a></li>
              <li><a href="/account" className="text-text-secondary hover:text-accent-primary transition-colors">My Account</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">How to Trade</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-accent-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Refund Policy</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-accent-primary mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><a href="mailto:support@cs2marketplace.com" className="text-text-secondary hover:text-accent-primary transition-colors">support@cs2marketplace.com</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Live Chat</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border-color pt-8 text-center text-text-secondary">
          <p>&copy; 2024 CS2 Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

