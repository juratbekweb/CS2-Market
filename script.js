// ============================================
// CS2 Marketplace - Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle')
  const navMenu = document.querySelector('.nav-menu')

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active')
    })
  }

  document.addEventListener('click', function (event) {
    if (navMenu && navToggle && !navMenu.contains(event.target) && !navToggle.contains(event.target)) {
      navMenu.classList.remove('active')
    }
  })

  const thumbnails = document.querySelectorAll('.thumbnail')
  const mainImage = document.getElementById('mainProductImage')

  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', function () {
        const imageUrl = this.getAttribute('data-image')
        if (imageUrl && mainImage) {
          mainImage.src = imageUrl
          thumbnails.forEach((item) => item.classList.remove('active'))
          this.classList.add('active')
        }
      })
    })
  }

  const tabButtons = document.querySelectorAll('.tab-btn')
  const tabPanes = document.querySelectorAll('.tab-pane')

  tabButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab')
      tabButtons.forEach((item) => item.classList.remove('active'))
      tabPanes.forEach((pane) => pane.classList.remove('active'))
      this.classList.add('active')
      const targetPane = document.getElementById(targetTab)
      if (targetPane) {
        targetPane.classList.add('active')
      }
    })
  })

  const accountNavItems = document.querySelectorAll('.nav-item[data-section]')
  const accountPanels = document.querySelectorAll('.account-panel')

  accountNavItems.forEach((item) => {
    item.addEventListener('click', function (event) {
      event.preventDefault()
      const targetSection = this.getAttribute('data-section')
      accountNavItems.forEach((nav) => nav.classList.remove('active'))
      accountPanels.forEach((panel) => panel.classList.remove('active'))
      this.classList.add('active')
      const targetPanel = document.getElementById(targetSection)
      if (targetPanel) {
        targetPanel.classList.add('active')
      }
    })
  })

  const priceMin = document.getElementById('priceMin')
  const priceMax = document.getElementById('priceMax')
  const priceMinValue = document.getElementById('priceMinValue')
  const priceMaxValue = document.getElementById('priceMaxValue')

  function updatePriceDisplay() {
    priceMinValue.textContent = priceMin.value
    priceMaxValue.textContent = priceMax.value
    if (parseInt(priceMin.value, 10) > parseInt(priceMax.value, 10)) {
      priceMin.value = priceMax.value
    }
    if (parseInt(priceMax.value, 10) < parseInt(priceMin.value, 10)) {
      priceMax.value = priceMin.value
    }
  }

  if (priceMin && priceMax && priceMinValue && priceMaxValue) {
    priceMin.addEventListener('input', updatePriceDisplay)
    priceMax.addEventListener('input', updatePriceDisplay)
  }

  const filterApply = document.querySelector('.filter-apply')
  if (filterApply) {
    filterApply.addEventListener('click', function () {
      const selectedFilters = {
        weaponTypes: [],
        rarities: [],
        conditions: [],
        priceRange: {
          min: priceMin ? priceMin.value : 0,
          max: priceMax ? priceMax.value : 5000,
        },
      }

      document.querySelectorAll('.filter-options input[type="checkbox"]').forEach((checkbox) => {
        if (!checkbox.checked) return
        const filterGroup = checkbox.closest('.filter-group')
        const filterTitle = filterGroup.querySelector('.filter-title').textContent

        if (filterTitle === 'Weapon Type') {
          selectedFilters.weaponTypes.push(checkbox.value)
        } else if (filterTitle === 'Rarity') {
          selectedFilters.rarities.push(checkbox.value)
        } else if (filterTitle === 'Condition') {
          selectedFilters.conditions.push(checkbox.value)
        }
      })

      console.log('Applied filters:', selectedFilters)
      alert('Filters applied! (This is a demo - filters would update the product list)')
    })
  }

  const filterReset = document.querySelector('.filter-reset')
  if (filterReset) {
    filterReset.addEventListener('click', function () {
      document.querySelectorAll('.filter-options input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false
      })

      if (priceMin && priceMax) {
        priceMin.value = 0
        priceMax.value = 5000
        if (priceMinValue && priceMaxValue) {
          priceMinValue.textContent = '0'
          priceMaxValue.textContent = '5000'
        }
      }
    })
  }

  const sortSelect = document.getElementById('sortSelect')
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      console.log('Sort by:', this.value)
      alert(`Sorting by: ${this.options[this.selectedIndex].text}`)
    })
  }

  const addToCartButtons = document.querySelectorAll('.btn-add-cart')
  const cartCount = document.querySelector('.cart-count')
  let cartItems = 0

  const handleCartAnimation = (button) => {
    cartItems++
    if (cartCount) {
      cartCount.textContent = cartItems
      cartCount.style.animation = 'pulse 0.5s'
      setTimeout(() => {
        cartCount.style.animation = ''
      }, 500)
    }

    const originalText = button.innerHTML
    button.innerHTML = '<i class="fas fa-check"></i>'
    button.style.background = 'var(--accent-primary)'
    button.style.color = 'var(--bg-primary)'

    setTimeout(() => {
      button.innerHTML = originalText
      button.style.background = ''
      button.style.color = ''
    }, 1000)
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', function () {
      handleCartAnimation(this)
    })
  })

  const wishlistButtons = document.querySelectorAll('.btn-wishlist-remove, .btn-icon[title="Add to Wishlist"]')
  wishlistButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const icon = this.querySelector('i')
      if (!icon) return
      if (icon.classList.contains('far')) {
        icon.classList.remove('far')
        icon.classList.add('fas')
        this.style.color = 'var(--accent-secondary)'
      } else {
        icon.classList.remove('fas')
        icon.classList.add('far')
        this.style.color = ''
      }
    })
  })

  const quickViewButtons = document.querySelectorAll('.btn-quick-view')
  quickViewButtons.forEach((button) => {
    button.addEventListener('click', function () {
      if (this.tagName === 'A') return
      const itemCard = this.closest('.item-card')
      if (itemCard) {
        const itemName = itemCard.querySelector('.item-name')?.textContent || 'Item'
        alert(`Quick View: ${itemName}\n\nIn a real application, this would open a modal with item details.`)
      }
    })
  })

  const productsGrid = document.getElementById('productsGrid')
  if (productsGrid && productsGrid.children.length === 0) {
    const sampleProducts = [
      { name: 'AK-47 | Redline', rarity: 'covert', condition: 'Field-Tested', price: 125.5, image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkuXLPr7Vn35cppwl3r3E9oWn3gLh-ERpZ2-mLIOUc1M3Y1rX-lK4kO3s1pK-vJzLz3Jh6CJ2-z-DyA/400fx300f' },
      { name: 'M4A4 | Howl', rarity: 'covert', condition: 'Factory New', price: 450, image: 'https://via.placeholder.com/400x300/1a1a2e/ff6b6b?text=M4A4+Howl' },
      { name: 'AWP | Dragon Lore', rarity: 'covert', condition: 'Minimal Wear', price: 3200, image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkuXLPr7Vn35cppwl3r3E9oWn3gLh-ERpZ2-mLIOUc1M3Y1rX-lK4kO3s1pK-vJzLz3Jh6CJ2-z-DyA/400fx300f' },
      { name: 'Karambit | Fade', rarity: 'covert', condition: 'Factory New', price: 2450, image: 'https://via.placeholder.com/400x300/1a1a2e/ff6b6b?text=Karambit+Fade' },
    ]

    sampleProducts.forEach((product) => {
      const itemCard = document.createElement('div')
      itemCard.className = 'item-card'
      itemCard.innerHTML = `
        <div class="item-image">
          <img src="${product.image}" alt="${product.name}">
          <div class="item-rarity rarity-${product.rarity}">${product.rarity.charAt(0).toUpperCase() + product.rarity.slice(1)}</div>
          <div class="item-overlay">
            <a href="product-detail.html" class="btn-quick-view">Quick View</a>
          </div>
        </div>
        <div class="item-info">
          <h3 class="item-name">${product.name}</h3>
          <div class="item-meta">
            <span class="item-condition">${product.condition}</span>
            <span class="item-float">Float: ${(Math.random() * 0.5).toFixed(2)}</span>
          </div>
          <div class="item-price">
            <span class="price-amount">$${product.price.toFixed(2)}</span>
            <button class="btn-add-cart"><i class="fas fa-shopping-cart"></i></button>
          </div>
        </div>
      `
      productsGrid.appendChild(itemCard)
    })

    productsGrid.querySelectorAll('.btn-add-cart').forEach((button) => {
      button.addEventListener('click', function () {
        handleCartAnimation(this)
      })
    })
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      const href = this.getAttribute('href')
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href)
        if (target) {
          event.preventDefault()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    })
  })

  const imageZoom = document.querySelector('.image-zoom')
  if (imageZoom) {
    imageZoom.addEventListener('click', function () {
      alert('Image zoom feature would open a lightbox here.')
    })
  }

  const pageNumbers = document.querySelectorAll('.page-number')
  const prevButton = document.querySelector('.btn-pagination:first-of-type')
  const nextButton = document.querySelector('.btn-pagination:last-of-type')
  let currentPage = 1

  pageNumbers.forEach((pageNum, index) => {
    pageNum.addEventListener('click', function () {
      pageNumbers.forEach((item) => item.classList.remove('active'))
      this.classList.add('active')
      currentPage = index + 1
      if (prevButton) prevButton.disabled = currentPage === 1
      if (nextButton) nextButton.disabled = currentPage === pageNumbers.length
    })
  })

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      if (currentPage < pageNumbers.length) {
        pageNumbers[currentPage].click()
      }
    })
  }

  if (prevButton) {
    prevButton.addEventListener('click', function () {
      if (currentPage > 1) {
        pageNumbers[currentPage - 2].click()
      }
    })
  }

  if (productsGrid) {
    const resultsCount = document.getElementById('resultsCount')
    if (resultsCount) {
      const itemCount = productsGrid.querySelectorAll('.item-card').length
      resultsCount.textContent = `${itemCount} items found`
    }
  }

  document.querySelectorAll('.item-card').forEach((card) => {
    card.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.3s ease'
    })
  })

  console.log('CS2 Marketplace - All scripts loaded successfully!')
})
