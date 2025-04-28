// DOM Elements
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const productActions = document.querySelectorAll('.product-actions button');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const newsletterForm = document.querySelector('.newsletter-form');
const mobileMenuButton = document.querySelector('.all-categories');
const navLinks = document.querySelector('.sub-nav-left');
const cartIcon = document.querySelector('.cart i');
const cartDropdown = document.querySelector('.cart-dropdown');
const cartItemsContainer = document.querySelector('.cart-items');
const totalAmountElement = document.querySelector('.total-amount');
const cartButton = document.querySelector('.cart');
const closeCartButton = document.querySelector('.close-cart');
const cartTotalElement = document.querySelector('.cart-total');
const checkoutBtn = document.querySelector('.checkout-btn');

// Profile dropdown functionality
const profileButton = document.querySelector('.profile');
const profileDropdown = document.querySelector('.profile-dropdown');
const closeProfileBtn = document.querySelector('.close-profile');
const logoutBtn = document.querySelector('.logout-btn');

// Initialize cart from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let cartItemsCount = 0;

// Profile data
const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com'
};

// Function to update profile information
function updateProfileInfo() {
    const profileDetails = document.querySelector('.profile-details');
    if (profileDetails) {
        profileDetails.innerHTML = `
            <h4>${userProfile.name}</h4>
            <p>${userProfile.email}</p>
        `;
    }
}

// Function to save cart to localStorage
function saveToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Function to update cart count in header
function updateCartCount() {
    const cartButton = document.querySelector('.action-btn.cart');
    const existingCount = cartButton.querySelector('.cart-count');
    
    if (existingCount) {
        existingCount.remove();
    }
    
    if (cartItems.length > 0) {
        const cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        cartCount.textContent = cartItems.length;
        cartButton.appendChild(cartCount);
    }
}

// Function to update cart total
function updateCartTotal() {
    if (totalAmountElement) {
        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
        totalAmountElement.textContent = `₹${total.toLocaleString('en-IN')}`;
    }
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Function to update orders count in header
function updateOrdersCount() {
    const ordersCount = document.querySelector('.orders-count');
    if (ordersCount) {
        ordersCount.textContent = orders.length;
        if (orders.length > 0) {
            ordersCount.style.display = 'flex';
        } else {
            ordersCount.style.display = 'none';
        }
    }
}

// Function to add item to cart and orders
function addToCart(productId, productName, productPrice, productImage) {
    // Add to cart
    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    // Add to orders
    orders.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
        date: new Date().toISOString(),
        status: 'Pending'
    });

    // Save to localStorage
    saveToStorage();
    
    // Update UI
    updateCartCount();
    updateOrdersCount();
    
    // Show notification
    showCartNotification(productName);
    
    // Animate cart icon
    const cartIcon = document.querySelector('.action-btn.cart i');
    cartIcon.classList.add('animate');
    setTimeout(() => {
        cartIcon.classList.remove('animate');
    }, 300);
}

// Function to show notification
function showCartNotification(productName) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} added to cart and orders!</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Function to update cart dropdown
function updateCartDropdown() {
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">₹${parseFloat(item.price).toLocaleString('en-IN')}</p>
                </div>
                <span class="cart-item-remove" data-index="${index}">×</span>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
}

// Toggle cart dropdown
cartButton.addEventListener('click', function(e) {
    e.stopPropagation();
    if (cartDropdown) {
        cartDropdown.classList.toggle('active');
    }
});

// Close cart dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.cart') && !e.target.closest('.cart-dropdown')) {
        if (cartDropdown) {
            cartDropdown.classList.remove('active');
        }
    }
});

// Close cart dropdown with close button
closeCartButton.addEventListener('click', function() {
    if (cartDropdown) {
        cartDropdown.classList.remove('active');
    }
});

// Product actions (wishlist, quick view)
productActions.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const icon = button.querySelector('i');
        
        if (icon.classList.contains('fa-heart')) {
            icon.style.color = icon.style.color === 'red' ? '' : 'red';
        } else if (icon.classList.contains('fa-eye')) {
            // Implement quick view functionality
            showQuickView(button.closest('.product-card'));
        }
    });
});

// Search functionality
function searchProducts(query) {
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    let foundProducts = false;
    
    // Clear previous results
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
    
    // Create results container
    searchResults.innerHTML = `
        <div class="search-results-header">
            <h3>Search Results for "${query}"</h3>
            <button class="close-search"><i class="fas fa-times"></i></button>
        </div>
        <div class="search-results-grid"></div>
    `;
    
    const resultsGrid = searchResults.querySelector('.search-results-grid');
    
    // Search through products
    productCards.forEach(card => {
        const productName = card.querySelector('.product-info h3').textContent.toLowerCase();
        if (productName.includes(query.toLowerCase())) {
            foundProducts = true;
            const productClone = card.cloneNode(true);
            
            // Add click event to the entire product card
            productClone.addEventListener('click', (e) => {
                // Don't trigger if clicking on buttons or links
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                    return;
                }
                
                const addToCartBtn = productClone.querySelector('.add-to-cart');
                if (addToCartBtn) {
                    const productId = addToCartBtn.dataset.productId;
                    const productName = addToCartBtn.dataset.productName;
                    const productPrice = addToCartBtn.dataset.productPrice;
                    const productImage = addToCartBtn.dataset.productImage;
                    
                    // Add to cart and orders
                    addToCart(productId, productName, productPrice, productImage);
                    
                    // Show notification
                    showCartNotification(productName);
                    
                    // Close search results
                    searchResults.remove();
                }
            });
            
            resultsGrid.appendChild(productClone);
        }
    });
    
    if (!foundProducts) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No products found matching "${query}"</p>
            </div>
        `;
    }
    
    // Add to page
    document.body.appendChild(searchResults);
    
    // Add close functionality
    const closeButton = searchResults.querySelector('.close-search');
    closeButton.addEventListener('click', () => {
        searchResults.remove();
    });
    
    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && !e.target.closest('.search-container')) {
            searchResults.remove();
        }
    });
}

// Newsletter subscription
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;
    
    if (validateEmail(email)) {
        // Implement newsletter subscription
        showNotification('Thank you for subscribing!');
        newsletterForm.reset();
    } else {
        showNotification('Please enter a valid email address.', 'error');
    }
});

// Mobile menu
mobileMenuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
        const message = contactForm.querySelector('textarea').value;

        // Here you would typically send the data to a server
        // For now, we'll just show the success message
        
        // Show the success message
        successMessage.style.display = 'flex';
        successMessage.style.animation = 'fadeIn 0.5s ease-in-out';
        
        // Hide the success message after 3 seconds
        setTimeout(function() {
            successMessage.style.animation = 'fadeOut 0.5s ease-in-out';
            setTimeout(function() {
                successMessage.style.display = 'none';
            }, 500);
        }, 3000);
        
        // Reset the form
        contactForm.reset();
    });
});

// Helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showQuickView(productCard) {
    // Create quick view modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    
    const productImage = productCard.querySelector('.product-image img').src;
    const productTitle = productCard.querySelector('.product-info h3').textContent;
    const productDescription = productCard.querySelector('.product-description').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-product">
                <img src="${productImage}" alt="${productTitle}">
                <div class="modal-product-info">
                    <h3>${productTitle}</h3>
                    <p>${productDescription}</p>
                    <div class="modal-price">${productPrice}</div>
                    <button class="add-to-cart">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for modal
    const style = document.createElement('style');
    style.textContent = `
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .quick-view-modal.show {
            opacity: 1;
        }
        
        .modal-content {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            max-width: 800px;
            width: 90%;
            position: relative;
        }
        
        .close-modal {
            position: absolute;
            top: 1rem;
            right: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .modal-product {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        
        .modal-product img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 8px;
        }
        
        .notification {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 2rem;
            background-color: var(--accent-color);
            color: var(--background-dark);
            border-radius: 4px;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateY(0);
        }
        
        .notification.error {
            background-color: #ff4444;
            color: white;
        }
    `;
    
    document.head.appendChild(style);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
    
    // Close modal
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            style.remove();
        }, 300);
    });
    
    // Add to cart from modal
    const modalAddToCart = modal.querySelector('.add-to-cart');
    modalAddToCart.addEventListener('click', () => {
        const product = {
            id: button.dataset.productId,
            name: button.dataset.productName,
            price: button.dataset.productPrice,
            image: button.dataset.productImage
        };
        addToCart(product.id, product.name, product.price, product.image);
        showNotification('Item added to cart!');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            style.remove();
        }, 300);
    });
}

// Toggle profile dropdown
profileButton.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
    updateProfileInfo(); // Update profile info when opening dropdown
});

// Close profile dropdown when clicking the close button
closeProfileBtn.addEventListener('click', () => {
    profileDropdown.classList.remove('active');
});

// Close profile dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
        profileDropdown.classList.remove('active');
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    // Add your logout logic here
    profileDropdown.classList.remove('active');
    showNotification('Successfully logged out');
});

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateOrdersCount();
    
    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = this.dataset.productPrice;
            const productImage = this.dataset.productImage;
            
            addToCart(productId, productName, productPrice, productImage);
        });
    });

    // Toggle cart dropdown
    document.querySelector('.cart').addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');
    });

    // Close cart dropdown
    closeCartButton.addEventListener('click', function() {
        cartDropdown.classList.remove('active');
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.cart') && !e.target.closest('.cart-dropdown')) {
            cartDropdown.classList.remove('active');
        }
    });

    // Remove items from cart
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('cart-item-remove')) {
            const index = parseInt(e.target.dataset.index);
            cartItems.splice(index, 1);
            cartItemsCount--;
            updateCartCount();
            updateCartDropdown();
            updateCartTotal();
        }
    });

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cartItems.length > 0) {
            showNotification('Proceeding to checkout...');
            // Here you would typically redirect to a checkout page
            // window.location.href = '/checkout';
        }
    });
});

// Add event listeners for search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-btn');
    
    // Search on button click
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchProducts(query);
        }
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchProducts(query);
            }
        }
    });
});
