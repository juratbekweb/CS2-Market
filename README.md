# CS2 Marketplace - React + TailwindCSS

A modern, professional React application for a Counter-Strike 2 (CS2) skin marketplace built with React, Vite, and TailwindCSS.

## 🚀 Features

- **React Router** for navigation
- **TailwindCSS** for styling with dark esports theme
- **Context API** for state management (cart & wishlist)
- **Local Storage** for data persistence
- **Responsive Design** for all devices
- **Interactive UI** with hover effects and animations
- **Product Filtering** by weapon type, rarity, condition, and price range
- **Advanced Sorting** by price and name
- **User Account Dashboard** with inventory, wishlist, purchases, sales, and trades
- **Shopping Cart** with persistent storage
- **Product Detail Pages** with image galleries and statistics
- **Real CS2 Skin Images** from Steam Community
- **Comprehensive Product Database** with 34+ items including knives, gloves, and weapons

## 📦 Installation

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd server && npm install
   cd ..
   ```

3. **Run the backend API server:**
   ```bash
   npm run server
   ```

4. **Run the frontend dev server (in a separate terminal):**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   The frontend will automatically open at `http://localhost:3000` and API requests will proxy to `http://localhost:5000`.

## 🛠️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar with cart/wishlist counters
│   ├── Footer.jsx      # Footer with social links
│   └── ItemCard.jsx    # Product card with add to cart/wishlist
├── context/            # React Context for state management
│   ├── CartContext.jsx    # Shopping cart state
│   └── WishlistContext.jsx # Wishlist functionality
├── data/               # Static data
│   └── products.js     # Comprehensive product database
├── pages/              # Page components
│   ├── Home.jsx        # Landing page with featured items
│   ├── Products.jsx    # Product listing with advanced filters
│   ├── ProductDetail.jsx # Detailed product view
│   ├── Account.jsx     # User dashboard
│   └── Cart.jsx        # Shopping cart
├── App.jsx             # Main app component with routing
├── main.jsx            # App entry point
└── index.css           # Global styles and Tailwind imports
```
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── Products.jsx    # Product listing page
│   ├── ProductDetail.jsx # Product detail page
│   └── Account.jsx     # User account page
├── App.jsx             # Main app component
├── main.jsx           # Entry point
└── index.css          # TailwindCSS imports
```

## 🎨 Design Features

- **Dark Theme** with neon green (#00ff88) accents
- **Gaming Aesthetics** with glowing effects
- **Smooth Animations** and transitions
- **Responsive Layout** for mobile, tablet, and desktop

## 🔧 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Font Awesome** - Icons

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Routes

- `/` - Homepage
- `/products` - Product listing with filters
- `/product/:id` - Individual product detail page
- `/account` - User account dashboard

## 🎮 Features Overview

### Homepage
- Hero section with animated background
- Featured items showcase
- Category grid
- Statistics display

### Products Page
- Advanced filtering (weapon type, rarity, condition, price)
- Sorting options
- Responsive product grid
- Real-time filter updates

### Product Detail
- Multiple image views
- Detailed statistics
- Buy/Trade buttons
- Tabbed content (description, specs, history, reviews)
- Related items

### Account Dashboard
- Dashboard with statistics
- Inventory management
- Wishlist
- Purchase/Sales history
- Trade management
- Settings

## 🎯 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  'accent-primary': '#00ff88',  // Neon green
  'accent-secondary': '#ff6b6b', // Coral red
  // ... more colors
}
```

### Products
Add or modify products in `src/data/products.js`

### CS2 Skin Images

To get actual CS2 skin images, you have several options:

1. **Steam Community Market API**: Use the Steam Web API to fetch item image URLs
   - API endpoint: `https://api.steampowered.com/IEconItems_730/GetPlayerItems/v0001/`
   - Or browse Steam Community Market and inspect image URLs

2. **CS2 Skin Databases**: Download images from:
   - [CS2 Skins DB](https://cs2skinsdb.com)
   - [Giga Skins](https://gigaskins.com)
   - [CSGOStash](https://csgostash.com)

3. **Local Images**: Download skin images and place them in `public/images/skins/`, then update image paths in `src/data/products.js`

4. **Image URLs**: Update the `image` property in each product object with actual image URLs from any of the above sources

The current implementation includes error handling that will attempt to load fallback images if the primary image fails.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License

This is a demonstration project. Feel free to use and modify as needed.

---

**Built with ❤️ for CS2 players and collectors**
