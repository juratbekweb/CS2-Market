# CS2 Marketplace - React + TailwindCSS

A modern, professional React application for a Counter-Strike 2 (CS2) skin marketplace built with React, Vite, and TailwindCSS.

## 🚀 Features

- **React Router** for navigation
- **TailwindCSS** for styling with dark esports theme
- **Context API** for state management (cart)
- **Responsive Design** for all devices
- **Interactive UI** with hover effects and animations
- **Product Filtering** by type, rarity, condition, and price
- **User Account Dashboard** with multiple sections
- **Shopping Cart** functionality

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## 🛠️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Footer.jsx      # Footer component
│   └── ItemCard.jsx    # Product card component
├── context/            # React Context
│   └── CartContext.jsx # Shopping cart state
├── data/               # Static data
│   └── products.js    # Product data
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
