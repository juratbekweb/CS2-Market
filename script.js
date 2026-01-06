// ============================================
// CS2 Marketplace - Interactive Features
// ============================================

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navToggle && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Product Image Thumbnail Switching
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const imageUrl = this.getAttribute('data-image');
                if (imageUrl && mainImage) {
                    mainImage.src = imageUrl;
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }

    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Account Navigation
    const accountNavItems = document.querySelectorAll('.nav-item[data-section]');
    const accountPanels = document.querySelectorAll('.account-panel');
    
    accountNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav items and panels
            accountNavItems.forEach(nav => nav.classList.remove('active'));
            accountPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetSection);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Price Range Sliders
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceMinValue = document.getElementById('priceMinValue');
    const priceMaxValue = document.getElementById('priceMaxValue');
    
    if (priceMin && priceMax && priceMinValue && priceMaxValue) {
        function updatePriceDisplay() {
            priceMinValue.textContent = priceMin.value;
            priceMaxValue.textContent = priceMax.value;
            
            // Ensure min doesn't exceed max
            if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
                priceMin.value = priceMax.value;
            }
            if (parseInt(priceMax.value) < parseInt(priceMin.value)) {
                priceMax.value = priceMin.value;
            }
        }
        
        priceMin.addEventListener('input', updatePriceDisplay);
        priceMax.addEventListener('input', updatePriceDisplay);
    }

    // Filter Apply Button
    const filterApply = document.querySelector('.filter-apply');
    if (filterApply) {
        filterApply.addEventListener('click', function() {
            // Get all selected filters
            const selectedFilters = {
                weaponTypes: [],
                rarities: [],
                conditions: [],
                priceRange: {
                    min: priceMin ? priceMin.value : 0,
                    max: priceMax ? priceMax.value : 5000
                }
            };
            
            // Collect weapon type filters
            document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
                if (checkbox.checked) {
                    const filterGroup = checkbox.closest('.filter-group');
                    const filterTitle = filterGroup.querySelector('.filter-title').textContent;
                    
                    if (filterTitle === 'Weapon Type') {
                        selectedFilters.weaponTypes.push(checkbox.value);
                    } else if (filterTitle === 'Rarity') {
                        selectedFilters.rarities.push(checkbox.value);
                    } else if (filterTitle === 'Condition') {
                        selectedFilters.conditions.push(checkbox.value);
                    }
                }
            });
            
            console.log('Applied filters:', selectedFilters);
            // In a real application, this would filter the products
            alert('Filters applied! (This is a demo - filters would update the product list)');
        });
    }

    // Filter Reset Button
    const filterReset = document.querySelector('.filter-reset');
    if (filterReset) {
        filterReset.addEventListener('click', function() {
            document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            if (priceMin && priceMax) {
                priceMin.value = 0;
                priceMax.value = 5000;
                if (priceMinValue && priceMaxValue) {
                    priceMinValue.textContent = '0';
                    priceMaxValue.textContent = '5000';
                }
            }
        });
    }

    // Sort Select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sort by:', sortValue);
            // In a real application, this would sort the products
            alert('Sorting by: ' + this.options[this.selectedIndex].text);
        });
    }

    // Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartItems++;
            if (cartCount) {
                cartCount.textContent = cartItems;
                cartCount.style.animation = 'pulse 0.5s';
                setTimeout(() => {
                    cartCount.style.animation = '';
                }, 500);
            }
            
            // Show feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.style.background = 'var(--accent-primary)';
            this.style.color = 'var(--bg-primary)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
                this.style.color = '';
            }, 1000);
        });
    });

    // Wishlist Toggle
    const wishlistButtons = document.querySelectorAll('.btn-wishlist-remove, .btn-icon[title="Add to Wishlist"]');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.style.color = 'var(--accent-secondary)';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.style.color = '';
                }
            }
        });
    });

    // Quick View Modal (Placeholder)
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // If it's a link, let it navigate normally
            if (this.tagName === 'A') {
                return;
            }
            // Otherwise, show quick view (would open a modal in real app)
            const itemCard = this.closest('.item-card');
            if (itemCard) {
                const itemName = itemCard.querySelector('.item-name')?.textContent || 'Item';
                alert('Quick View: ' + itemName + '\n\nIn a real application, this would open a modal with item details.');
            }
        });
    });

    // Generate Product Cards for Products Page
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid && productsGrid.children.length === 0) {
        // Sample product data
        const sampleProducts = [
            { name: 'AK-47 | Redline', rarity: 'covert', condition: 'Field-Tested', price: 125.50, image: 'https://via.placeholder.com/400x300/1a1a2e/00ff88?text=AK-47+Redline' },
            { name: 'M4A4 | Howl', rarity: 'covert', condition: 'Factory New', price: 450.00, image: 'https://via.placeholder.com/400x300/1a1a2e/ff6b6b?text=M4A4+Howl' },
            { name: 'AWP | Dragon Lore', rarity: 'covert', condition: 'Minimal Wear', price: 3200.00, image: 'https://via.placeholder.com/400x300/1a1a2e/4ecdc4?text=AWP+Dragon+Lore' },
            { name: '★ Karambit | Fade', rarity: 'covert', condition: 'Factory New', price: 2450.00, image: 'https://via.placeholder.com/400x300/1a1a2e/ff6b6b?text=Karambit+Fade' },
            { name: 'Glock-18 | Fade', rarity: 'covert', condition: 'Factory New', price: 380.00, image: 'https://via.placeholder.com/400x300/1a1a2e/ffd93d?text=Glock+Fade' },
            { name: 'Sport Gloves | Pandora\'s Box', rarity: 'classified', condition: 'Field-Tested', price: 890.00, image: 'https://via.placeholder.com/400x300/1a1a2e/ffd93d?text=Sport+Gloves' },
            { name: 'AK-47 | Vulcan', rarity: 'covert', condition: 'Minimal Wear', price: 98.00, image: 'https://via.placeholder.com/400x300/1a1a2e/ff6b6b?text=AK-47+Vulcan' },
            { name: 'Desert Eagle | Blaze', rarity: 'covert', condition: 'Factory New', price: 220.00, image: 'https://via.placeholder.com/400x300/1a1a2e/ff6b6b?text=Deagle+Blaze' },
            { name: 'AWP | Asiimov', rarity: 'covert', condition: 'Field-Tested', price: 45.00, image: 'https://via.placeholder.com/400x300/1a1a2e/4ecdc4?text=AWP+Asiimov' },
            { name: 'M4A1-S | Icarus Fell', rarity: 'classified', condition: 'Factory New', price: 85.00, image: 'https://via.placeholder.com/400x300/1a1a2e/00ff88?text=M4A1-S+Icarus' },
            { name: '★ Butterfly Knife | Fade', rarity: 'covert', condition: 'Factory New', price: 1850.00, image: 'https://via.placeholder.com/400x300/1a1a2e/ff6b6b?text=Butterfly+Fade' },
            { name: 'USP-S | Kill Confirmed', rarity: 'covert', condition: 'Minimal Wear', price: 65.00, image: 'https://via.placeholder.com/400x300/1a1a2e/00ff88?text=USP-S+Kill' }
        ];

        sampleProducts.forEach(product => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
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
            `;
            productsGrid.appendChild(itemCard);
        });

        // Re-attach event listeners to new buttons
        const newAddToCartButtons = productsGrid.querySelectorAll('.btn-add-cart');
        newAddToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                cartItems++;
                if (cartCount) {
                    cartCount.textContent = cartItems;
                    cartCount.style.animation = 'pulse 0.5s';
                    setTimeout(() => {
                        cartCount.style.animation = '';
                    }, 500);
                }
                
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.background = 'var(--accent-primary)';
                this.style.color = 'var(--bg-primary)';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '';
                    this.style.color = '';
                }, 1000);
            });
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Image Zoom Effect (Placeholder)
    const imageZoom = document.querySelector('.image-zoom');
    if (imageZoom) {
        imageZoom.addEventListener('click', function() {
            alert('Image zoom feature would open a lightbox here.');
        });
    }

    // Pagination
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevButton = document.querySelector('.btn-pagination:first-of-type');
    const nextButton = document.querySelector('.btn-pagination:last-of-type');
    let currentPage = 1;

    pageNumbers.forEach((pageNum, index) => {
        pageNum.addEventListener('click', function() {
            pageNumbers.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            currentPage = index + 1;
            
            if (prevButton) {
                prevButton.disabled = currentPage === 1;
            }
            if (nextButton) {
                nextButton.disabled = currentPage === pageNumbers.length;
            }
        });
    });

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (currentPage < pageNumbers.length) {
                pageNumbers[currentPage].click();
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                pageNumbers[currentPage - 2].click();
            }
        });
    }

    // Update results count (placeholder)
    if (productsGrid) {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            const itemCount = productsGrid.querySelectorAll('.item-card').length;
            resultsCount.textContent = `${itemCount} items found`;
        }
    }

    // Add hover effects to cards
    const itemCards = document.querySelectorAll('.item-card');
    itemCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Console log for debugging
    console.log('CS2 Marketplace - All scripts loaded successfully!');
});

