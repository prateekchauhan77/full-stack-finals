// NovaTech Main Client Application Logic & UI Controllers

const App = {
  activeView: "store", // "store" | "orders" | "wishlist" | "admin"
  activeCategory: "all",
  searchQuery: "",
  sortBy: "featured",
  onlyInStock: false,
  selectedShippingTier: "standard",
  selectedPaymentMethod: "card",

  init() {
    this.bindEvents();
    this.renderCatalog();
    this.updateCartBadge();
    this.updateWishlistBadge();

    // Listen to Store changes
    Store.on("cartChanged", () => {
      this.updateCartBadge();
      this.renderCartDrawer();
    });

    Store.on("wishlistChanged", () => {
      this.updateWishlistBadge();
      if (this.activeView === "wishlist") {
        this.renderCatalog();
      }
    });

    Store.on("productsChanged", () => {
      this.renderCatalog();
    });

    Store.on("currencyChanged", () => {
      this.renderCatalog();
      this.renderCartDrawer();
      if (this.activeView === "orders") {
        this.renderOrdersView();
      }
    });
  },

  bindEvents() {
    // Navigation view buttons
    document.querySelectorAll("[data-nav-view]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const view = e.currentTarget.getAttribute("data-nav-view");
        this.switchView(view);
      });
    });

    // Logo brand click -> home
    document.getElementById("brand-home-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.switchView("store");
    });

    // Search bar
    const searchInput = document.getElementById("search-input");
    const searchClear = document.getElementById("search-clear");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (searchClear) {
          searchClear.classList.toggle("visible", this.searchQuery.length > 0);
        }
        this.renderCatalog();
      });
    }
    if (searchClear) {
      searchClear.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        this.searchQuery = "";
        searchClear.classList.remove("visible");
        this.renderCatalog();
      });
    }

    // Category Tabs
    document.querySelectorAll(".cat-tab-btn").forEach(tab => {
      tab.addEventListener("click", (e) => {
        document.querySelectorAll(".cat-tab-btn").forEach(t => t.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.activeCategory = e.currentTarget.getAttribute("data-category");
        this.renderCatalog();
      });
    });

    // Sort and In-stock filters
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderCatalog();
      });
    }

    const inStockToggle = document.getElementById("in-stock-only");
    if (inStockToggle) {
      inStockToggle.addEventListener("change", (e) => {
        this.onlyInStock = e.target.checked;
        this.renderCatalog();
      });
    }

    // Currency selector
    const currencySelect = document.getElementById("currency-select");
    if (currencySelect) {
      currencySelect.value = Store.currency;
      currencySelect.addEventListener("change", (e) => {
        Store.setCurrency(e.target.value);
        this.showToast(`Switched currency to ${e.target.value}`, "info");
      });
    }

    // Cart Drawer Toggle
    const cartToggleBtn = document.getElementById("cart-toggle-btn");
    const cartBackdrop = document.getElementById("cart-drawer-backdrop");
    const cartCloseBtn = document.getElementById("cart-close-btn");
    if (cartToggleBtn) {
      cartToggleBtn.addEventListener("click", () => this.openCartDrawer());
    }
    if (cartBackdrop) {
      cartBackdrop.addEventListener("click", () => this.closeCartDrawer());
    }
    if (cartCloseBtn) {
      cartCloseBtn.addEventListener("click", () => this.closeCartDrawer());
    }

    // Coupon Apply
    const couponBtn = document.getElementById("coupon-apply-btn");
    const couponInput = document.getElementById("coupon-input");
    if (couponBtn && couponInput) {
      couponBtn.addEventListener("click", () => {
        const code = couponInput.value.trim();
        if (!code) return;
        const res = Store.applyCoupon(code);
        if (res.success) {
          this.showToast(res.message, "success");
          couponInput.value = "";
        } else {
          this.showToast(res.message, "error");
        }
      });
      couponInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") couponBtn.click();
      });
    }

    // Checkout modal trigger from Cart
    const checkoutStartBtn = document.getElementById("cart-checkout-btn");
    if (checkoutStartBtn) {
      checkoutStartBtn.addEventListener("click", () => {
        if (Store.getCart().length === 0) {
          this.showToast("Your cart is empty!", "error");
          return;
        }
        this.closeCartDrawer();
        this.openCheckoutModal();
      });
    }

    // Modal Close buttons
    document.querySelectorAll(".modal-close-trigger").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.currentTarget.closest(".modal-overlay");
        if (modal) modal.classList.remove("open");
      });
    });

    // Credit Card Flip & formatting
    this.bindCreditCardLivePreview();
  },

  // View Switcher: Store vs Orders vs Wishlist vs Admin
  switchView(viewName) {
    this.activeView = viewName;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update active nav button
    document.querySelectorAll("[data-nav-view]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-nav-view") === viewName);
    });

    const storeView = document.getElementById("store-view-section");
    const heroSection = document.getElementById("hero-section");
    const ordersView = document.getElementById("orders-view-section");
    const adminView = document.getElementById("admin-view-section");
    const viewTitle = document.getElementById("catalog-section-title");

    if (viewName === "store") {
      if (storeView) storeView.style.display = "block";
      if (heroSection) heroSection.style.display = "block";
      if (ordersView) ordersView.style.display = "none";
      if (adminView) adminView.style.display = "none";
      if (viewTitle) viewTitle.textContent = "Featured Hardware & Computing";
      this.renderCatalog();
    } else if (viewName === "wishlist") {
      if (storeView) storeView.style.display = "block";
      if (heroSection) heroSection.style.display = "none";
      if (ordersView) ordersView.style.display = "none";
      if (adminView) adminView.style.display = "none";
      if (viewTitle) viewTitle.textContent = "Your Saved Wishlist";
      this.renderCatalog();
    } else if (viewName === "orders") {
      if (storeView) storeView.style.display = "none";
      if (heroSection) heroSection.style.display = "none";
      if (ordersView) ordersView.style.display = "block";
      if (adminView) adminView.style.display = "none";
      this.renderOrdersView();
    } else if (viewName === "admin") {
      if (storeView) storeView.style.display = "none";
      if (heroSection) heroSection.style.display = "none";
      if (ordersView) ordersView.style.display = "none";
      if (adminView) adminView.style.display = "block";
      if (window.Admin) {
        Admin.init();
      }
    }
  },

  // Product Catalog Rendering with filtering & search
  renderCatalog() {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    let products = Store.getProducts();

    // Wishlist view filter
    if (this.activeView === "wishlist") {
      const wishlistIds = Store.getWishlist();
      products = products.filter(p => wishlistIds.includes(p.id));
    }

    // Category filter
    if (this.activeCategory !== "all") {
      products = products.filter(p => p.category === this.activeCategory);
    }

    // Search query filter
    if (this.searchQuery) {
      products = products.filter(p => {
        const text = `${p.name} ${p.categoryName} ${p.shortDesc} ${p.description} ${p.tag || ""}`.toLowerCase();
        return text.includes(this.searchQuery);
      });
    }

    // In stock filter
    if (this.onlyInStock) {
      products = products.filter(p => p.stock > 0);
    }

    // Sorting
    if (this.sortBy === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    }

    // Update count indicator
    const countBadge = document.getElementById("catalog-count-badge");
    if (countBadge) {
      countBadge.innerHTML = `Showing <strong>${products.length}</strong> flagship devices`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem;">No products match your criteria</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.25rem;">Try adjusting your search terms or clearing category filters.</p>
          <button class="btn-secondary" onclick="App.resetCatalogFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(product => {
      const isWishlisted = Store.isInWishlist(product.id);
      const stockClass = product.stock <= 3 ? "low-stock" : "in-stock";
      const stockText = product.stock === 0 ? "Out of Stock" : (product.stock <= 3 ? `Only ${product.stock} left in vault` : "In Stock • Ships Next-Day");

      return `
        <div class="product-card" data-product-id="${product.id}">
          <div class="card-img-wrap" onclick="App.openQuickView('${product.id}')">
            <img class="card-img" src="${product.image}" alt="${product.name}" loading="lazy" />
            ${product.tag ? `<span class="card-tag" style="color: ${product.badgeColor || '#00f2fe'}">${product.tag}</span>` : ''}
            <button class="wishlist-heart-btn ${isWishlisted ? 'active' : ''}" 
                    title="Save to Wishlist" 
                    onclick="event.stopPropagation(); App.toggleWishlist('${product.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </button>
            <button class="quick-view-overlay-btn" onclick="event.stopPropagation(); App.openQuickView('${product.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Quick Specs
            </button>
          </div>
          <div class="card-body">
            <span class="card-cat-label">${product.categoryName}</span>
            <h4 class="card-title" onclick="App.openQuickView('${product.id}')">${product.name}</h4>
            <div class="card-rating-row">
              <span>★ ${product.rating.toFixed(1)}</span>
              <span class="count">(${product.reviewsCount})</span>
              <span style="margin-left: auto;" class="stock-indicator ${stockClass}">• ${stockText}</span>
            </div>
            <p class="card-desc">${product.shortDesc}</p>
            <div class="card-footer">
              <div class="price-wrap">
                <span class="current-price">${Store.formatPrice(product.price)}</span>
                ${product.originalPrice ? `<span class="original-price">${Store.formatPrice(product.originalPrice)}</span>` : ''}
              </div>
              <button class="card-add-btn" 
                      title="Add to Vault Cart" 
                      ${product.stock === 0 ? 'disabled' : ''} 
                      onclick="App.quickAddToCart('${product.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  resetCatalogFilters() {
    this.searchQuery = "";
    this.activeCategory = "all";
    this.onlyInStock = false;
    this.sortBy = "featured";

    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = "featured";
    const inStockToggle = document.getElementById("in-stock-only");
    if (inStockToggle) inStockToggle.checked = false;

    document.querySelectorAll(".cat-tab-btn").forEach(t => {
      t.classList.toggle("active", t.getAttribute("data-category") === "all");
    });

    this.renderCatalog();
  },

  // Wishlist
  toggleWishlist(productId) {
    const added = Store.toggleWishlist(productId);
    const prod = Store.getProductById(productId);
    const title = prod ? prod.name : "Device";
    if (added) {
      this.showToast(`Saved "${title}" to your wishlist`, "success");
    } else {
      this.showToast(`Removed "${title}" from wishlist`, "info");
    }
  },

  updateWishlistBadge() {
    const badge = document.getElementById("wishlist-badge-count");
    if (badge) {
      badge.textContent = Store.getWishlist().length;
    }
  },

  // Cart Badge & Drawer
  updateCartBadge() {
    const badge = document.getElementById("cart-badge-count");
    if (badge) {
      badge.textContent = Store.getCartCount();
    }
  },

  openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-drawer-backdrop");
    if (drawer) drawer.classList.add("open");
    if (backdrop) backdrop.classList.add("open");
    this.renderCartDrawer();
  },

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-drawer-backdrop");
    if (drawer) drawer.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
  },

  quickAddToCart(productId) {
    const res = Store.addToCart(productId, 1);
    if (res.success) {
      this.showToast(res.message, "success");
      this.openCartDrawer();
    } else {
      this.showToast(res.message, "error");
    }
  },

  renderCartDrawer() {
    const container = document.getElementById("cart-items-container");
    const billSummary = document.getElementById("cart-bill-summary");
    const activeCouponBadge = document.getElementById("active-coupon-display");
    const shippingTracker = document.getElementById("cart-shipping-tracker");
    if (!container) return;

    const cart = Store.getCart();
    const totals = Store.getCartTotals(this.selectedShippingTier);

    // Free shipping progress bar
    if (shippingTracker) {
      if (totals.subtotal >= totals.freeShippingThreshold || totals.coupon?.type === "shipping") {
        shippingTracker.innerHTML = `
          <div class="shipping-progress-text">
            <span>🎉 You qualify for <strong>FREE Express Shipping</strong>!</span>
            <strong>100%</strong>
          </div>
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width: 100%;"></div></div>
        `;
      } else {
        const percent = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));
        shippingTracker.innerHTML = `
          <div class="shipping-progress-text">
            <span>Add <strong>${Store.formatPrice(totals.freeShippingRemaining)}</strong> more for Free Shipping</span>
            <strong>${percent}%</strong>
          </div>
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width: ${percent}%;"></div></div>
        `;
      }
    }

    // Applied Coupon display
    if (activeCouponBadge) {
      if (totals.coupon) {
        activeCouponBadge.style.display = "flex";
        activeCouponBadge.innerHTML = `
          <span>🏷️ Promo <strong>${totals.coupon.code}</strong> applied (${totals.coupon.desc})</span>
          <button onclick="Store.removeCoupon(); App.showToast('Coupon removed', 'info');" title="Remove">&times;</button>
        `;
      } else {
        activeCouponBadge.style.display = "none";
      }
    }

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <h4>Your vault cart is empty</h4>
          <p>Discover flagship tech to elevate your stack.</p>
        </div>
      `;
      if (billSummary) billSummary.style.display = "none";
      return;
    }

    if (billSummary) billSummary.style.display = "flex";

    container.innerHTML = cart.map(item => `
      <div class="cart-item-row" data-cart-id="${item.cartItemId}">
        <img class="cart-item-thumb" src="${item.image}" alt="${item.name}" />
        <div class="cart-item-meta">
          <h5 class="cart-item-title">${item.name}</h5>
          <span class="cart-item-variants">${item.color} • ${item.storage}</span>
          <span class="cart-item-price">${Store.formatPrice(item.price)}</span>
        </div>
        <div class="cart-item-controls">
          <div class="qty-stepper">
            <button class="qty-btn" onclick="App.updateCartQty('${item.cartItemId}', -1)">&minus;</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn" onclick="App.updateCartQty('${item.cartItemId}', 1)">&plus;</button>
          </div>
          <button class="item-remove-btn" onclick="Store.removeFromCart('${item.cartItemId}')">Remove</button>
        </div>
      </div>
    `).join("");

    // Render bill rows
    if (billSummary) {
      billSummary.innerHTML = `
        <div class="bill-row">
          <span>Subtotal</span>
          <span>${Store.formatPrice(totals.subtotal)}</span>
        </div>
        ${totals.discount > 0 ? `
          <div class="bill-row" style="color: var(--accent-emerald);">
            <span>Discount (${totals.coupon.code})</span>
            <span>-${Store.formatPrice(totals.discount)}</span>
          </div>
        ` : ''}
        <div class="bill-row">
          <span>Est. Delivery</span>
          <span>${totals.shipping === 0 ? '<strong style="color: var(--accent-emerald)">FREE</strong>' : Store.formatPrice(totals.shipping)}</span>
        </div>
        <div class="bill-row">
          <span>Est. Tax (8.25%)</span>
          <span>${Store.formatPrice(totals.tax)}</span>
        </div>
        <div class="bill-row total-row">
          <span>Total Vault Due</span>
          <span>${Store.formatPrice(totals.total)}</span>
        </div>
      `;
    }
  },

  updateCartQty(cartItemId, delta) {
    const res = Store.updateCartQuantity(cartItemId, delta);
    if (res && !res.success) {
      this.showToast(res.message, "error");
    }
  },

  // Quick View / Product Detail Modal
  openQuickView(productId) {
    const product = Store.getProductById(productId);
    if (!product) return;

    const modal = document.getElementById("quickview-modal");
    const container = document.getElementById("quickview-content");
    if (!modal || !container) return;

    let selectedColor = product.variants?.colors?.[0]?.name || "Standard";
    let selectedStorage = product.variants?.storage?.[0]?.label || "Base";
    let priceDelta = product.variants?.storage?.[0]?.priceDelta || 0;

    const renderQuickviewBody = () => {
      const currentPrice = product.price + priceDelta;
      container.innerHTML = `
        <div class="quickview-grid">
          <div class="qv-gallery-col">
            <img id="qv-main-image" class="qv-main-img" src="${product.image}" alt="${product.name}" />
            <div class="qv-thumbs-row">
              ${(product.gallery || [product.image]).map((imgUrl, i) => `
                <img class="qv-thumb ${i === 0 ? 'active' : ''}" src="${imgUrl}" alt="Gallery ${i}" 
                     onclick="document.getElementById('qv-main-image').src = '${imgUrl}'; document.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active')); this.classList.add('active');" />
              `).join("")}
            </div>
          </div>
          <div class="qv-info-col">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="card-cat-label">${product.categoryName}</span>
              ${product.tag ? `<span class="card-tag" style="position: static; color: ${product.badgeColor || '#00f2fe'}">${product.tag}</span>` : ''}
            </div>
            <h2 class="qv-title">${product.name}</h2>
            <div class="card-rating-row" style="font-size: 0.95rem;">
              <span>★ ${product.rating.toFixed(1)}</span>
              <span class="count">(${product.reviewsCount} verified technical reviews)</span>
              <span style="margin-left: auto; color: var(--accent-emerald);">• Vault Stock: ${product.stock} Units</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 0.75rem;">
              <span class="current-price" style="font-size: 1.85rem;" id="qv-dynamic-price">${Store.formatPrice(currentPrice)}</span>
              ${product.originalPrice ? `<span class="original-price" style="font-size: 1.05rem;">${Store.formatPrice(product.originalPrice + priceDelta)}</span>` : ''}
            </div>
            <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">${product.description}</p>
            
            ${product.variants?.colors?.length ? `
              <div>
                <div class="variant-block-label">Select Colorway: <strong style="color: #fff;" id="qv-color-name">${selectedColor}</strong></div>
                <div class="color-dots-group">
                  ${product.variants.colors.map(c => `
                    <div class="color-dot-choice ${c.name === selectedColor ? 'selected' : ''}" 
                         style="background-color: ${c.hex};" 
                         title="${c.name}" 
                         onclick="App.updateQVColor('${product.id}', '${c.name}')"></div>
                  `).join("")}
                </div>
              </div>
            ` : ''}

            ${product.variants?.storage?.length ? `
              <div>
                <div class="variant-block-label">Configuration & Capacity</div>
                <div class="pill-variants-group">
                  ${product.variants.storage.map(s => `
                    <button class="variant-pill ${s.label === selectedStorage ? 'selected' : ''}" 
                            onclick="App.updateQVStorage('${product.id}', '${s.label}', ${s.priceDelta})">
                      ${s.label} ${s.priceDelta > 0 ? `(+${Store.formatPrice(s.priceDelta)})` : ''}
                    </button>
                  `).join("")}
                </div>
              </div>
            ` : ''}

            <div>
              <div class="variant-block-label">Technical Architecture Specs</div>
              <table class="qv-spec-table">
                ${Object.entries(product.specs || {}).map(([key, val]) => `
                  <tr>
                    <td>${key}</td>
                    <td>${val}</td>
                  </tr>
                `).join("")}
              </table>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="App.addQVToCart('${product.id}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                Deploy To Vault Cart
              </button>
              <button class="btn-secondary" onclick="App.toggleWishlist('${product.id}')" title="Save to Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    };

    this.currentQV = {
      productId: product.id,
      selectedColor,
      selectedStorage,
      priceDelta,
      reRender: renderQuickviewBody
    };

    renderQuickviewBody();
    modal.classList.add("open");
  },

  updateQVColor(productId, colorName) {
    if (this.currentQV && this.currentQV.productId === productId) {
      this.currentQV.selectedColor = colorName;
      this.currentQV.reRender();
    }
  },

  updateQVStorage(productId, storageLabel, priceDelta) {
    if (this.currentQV && this.currentQV.productId === productId) {
      this.currentQV.selectedStorage = storageLabel;
      this.currentQV.priceDelta = priceDelta;
      this.currentQV.reRender();
    }
  },

  addQVToCart(productId) {
    if (!this.currentQV) return;
    const res = Store.addToCart(productId, 1, {
      color: this.currentQV.selectedColor,
      storage: this.currentQV.selectedStorage,
      priceDelta: this.currentQV.priceDelta
    });

    if (res.success) {
      this.showToast(res.message, "success");
      const modal = document.getElementById("quickview-modal");
      if (modal) modal.classList.remove("open");
      this.openCartDrawer();
    } else {
      this.showToast(res.message, "error");
    }
  },

  // Checkout Flow
  openCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;
    this.checkoutStep = 1;
    this.renderCheckoutStep();
    modal.classList.add("open");
  },

  renderCheckoutStep() {
    const step1El = document.getElementById("checkout-step-1");
    const step2El = document.getElementById("checkout-step-2");
    const ind1 = document.getElementById("step-ind-1");
    const ind2 = document.getElementById("step-ind-2");

    if (this.checkoutStep === 1) {
      if (step1El) step1El.style.display = "block";
      if (step2El) step2El.style.display = "none";
      if (ind1) { ind1.className = "step-indicator active"; }
      if (ind2) { ind2.className = "step-indicator"; }
    } else {
      if (step1El) step1El.style.display = "none";
      if (step2El) step2El.style.display = "block";
      if (ind1) { ind1.className = "step-indicator completed"; }
      if (ind2) { ind2.className = "step-indicator active"; }
      this.updateCheckoutBillPreview();
    }
  },

  selectShippingTier(tier) {
    this.selectedShippingTier = tier;
    document.querySelectorAll(".shipping-card").forEach(c => {
      c.classList.toggle("selected", c.getAttribute("data-tier") === tier);
    });
    this.renderCartDrawer();
  },

  proceedToPayment() {
    // Validate Step 1 form fields
    const name = document.getElementById("checkout-name")?.value.trim();
    const email = document.getElementById("checkout-email")?.value.trim();
    const address = document.getElementById("checkout-address")?.value.trim();
    const city = document.getElementById("checkout-city")?.value.trim();

    if (!name || !email || !address || !city) {
      this.showToast("Please fill in all shipping fields.", "error");
      return;
    }

    this.checkoutStep = 2;
    this.renderCheckoutStep();
  },

  backToShipping() {
    this.checkoutStep = 1;
    this.renderCheckoutStep();
  },

  selectPaymentMethod(method) {
    this.selectedPaymentMethod = method;
    document.querySelectorAll(".payment-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-method") === method);
    });

    const cardBox = document.getElementById("pay-card-section");
    const qrBox = document.getElementById("pay-qr-section");
    const walletBox = document.getElementById("pay-wallet-section");

    if (cardBox) cardBox.style.display = method === "card" ? "block" : "none";
    if (qrBox) qrBox.style.display = method === "qr" ? "block" : "none";
    if (walletBox) walletBox.style.display = method === "wallet" ? "block" : "none";
  },

  bindCreditCardLivePreview() {
    const cardNumInput = document.getElementById("cc-number");
    const cardNameInput = document.getElementById("cc-name");
    const cardExpInput = document.getElementById("cc-exp");
    const cardCvvInput = document.getElementById("cc-cvv");
    const cardInner = document.getElementById("credit-card-inner");

    if (cardNumInput) {
      cardNumInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "").substring(0, 16);
        let formatted = val.replace(/(.{4})/g, "$1 ").trim();
        e.target.value = formatted;
        document.getElementById("preview-card-num").textContent = formatted || "•••• •••• •••• ••••";
      });
    }

    if (cardNameInput) {
      cardNameInput.addEventListener("input", (e) => {
        document.getElementById("preview-card-name").textContent = e.target.value.toUpperCase() || "CARTER STERLING";
      });
    }

    if (cardExpInput) {
      cardExpInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "").substring(0, 4);
        if (val.length >= 2) val = val.substring(0, 2) + "/" + val.substring(2);
        e.target.value = val;
        document.getElementById("preview-card-exp").textContent = val || "MM/YY";
      });
    }

    if (cardCvvInput && cardInner) {
      cardCvvInput.addEventListener("focus", () => cardInner.classList.add("flipped"));
      cardCvvInput.addEventListener("blur", () => cardInner.classList.remove("flipped"));
      cardCvvInput.addEventListener("input", (e) => {
        document.getElementById("preview-card-cvv").textContent = e.target.value || "•••";
      });
    }
  },

  updateCheckoutBillPreview() {
    const preview = document.getElementById("checkout-bill-preview");
    if (!preview) return;
    const totals = Store.getCartTotals(this.selectedShippingTier);
    preview.innerHTML = `
      <div class="bill-row"><span>Items Subtotal:</span><span>${Store.formatPrice(totals.subtotal)}</span></div>
      ${totals.discount > 0 ? `<div class="bill-row" style="color: var(--accent-emerald);"><span>Promo Discount:</span><span>-${Store.formatPrice(totals.discount)}</span></div>` : ''}
      <div class="bill-row"><span>Shipping Tier:</span><span>${totals.shipping === 0 ? 'FREE' : Store.formatPrice(totals.shipping)}</span></div>
      <div class="bill-row"><span>Taxes:</span><span>${Store.formatPrice(totals.tax)}</span></div>
      <div class="bill-row total-row"><span>Authorized Total:</span><span>${Store.formatPrice(totals.total)}</span></div>
    `;
  },

  submitPayment() {
    const payBtn = document.getElementById("submit-pay-btn");
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Authenticating Cryptographic Shield...
      `;
    }

    setTimeout(() => {
      // Gather customer data
      const name = document.getElementById("checkout-name")?.value || "Marcus Vance";
      const email = document.getElementById("checkout-email")?.value || "marcus@neural.io";
      const address = document.getElementById("checkout-address")?.value || "742 Innovation Way";
      const city = document.getElementById("checkout-city")?.value || "San Francisco";
      const state = document.getElementById("checkout-state")?.value || "CA";
      const zip = document.getElementById("checkout-zip")?.value || "94107";
      const country = document.getElementById("checkout-country")?.value || "United States";
      const phone = document.getElementById("checkout-phone")?.value || "+1 (555) 948-2019";

      let paymentLabel = "Credit Card (•••• " + (document.getElementById("cc-number")?.value.slice(-4) || "4242") + ")";
      if (this.selectedPaymentMethod === "qr") paymentLabel = "Instant UPI / QR Shield";
      if (this.selectedPaymentMethod === "wallet") paymentLabel = "NovaPay One-Click Biometric";

      let shippingLabel = "Standard Secure Logistics";
      if (this.selectedShippingTier === "express") shippingLabel = "Priority Air Express";
      if (this.selectedShippingTier === "drone") shippingLabel = "Hyperloop Drone Overnight";

      const order = Store.createOrder({
        customer: { name, email, address, city, state, zip, country, phone },
        shippingMethodCode: this.selectedShippingTier,
        shippingMethodLabel: shippingLabel,
        paymentMethodLabel: paymentLabel
      });

      if (payBtn) {
        payBtn.disabled = false;
        payBtn.innerHTML = `Complete Order & Authorize`;
      }

      // Close checkout modal
      const checkoutModal = document.getElementById("checkout-modal");
      if (checkoutModal) checkoutModal.classList.remove("open");

      // Show Order Success Modal
      this.showOrderConfirmationModal(order);
    }, 1200);
  },

  showOrderConfirmationModal(order) {
    const modal = document.getElementById("order-confirmation-modal");
    const details = document.getElementById("order-confirmation-details");
    if (!modal || !details) return;

    details.innerHTML = `
      <div class="order-success-card">
        <div class="order-success-icon">✓</div>
        <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Deployment Confirmed</h2>
        <p style="color: var(--text-secondary); max-width: 520px; margin: 0 auto;">Thank you, <strong>${order.customer.name}</strong>. Your hardware package has been allocated in the cleanroom vault.</p>
        <div class="order-code-badge">ORDER ${order.id}</div>
        
        <div class="order-tracking-timeline">
          ${order.timeline.map(step => `
            <div class="timeline-point ${step.completed ? 'done' : ''}">
              <div class="timeline-node">${step.completed ? '✓' : '•'}</div>
              <span class="timeline-label">${step.step}</span>
            </div>
          `).join("")}
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 2rem; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="color: var(--text-muted); font-size: 0.85rem;">Tracking Code:</span>
            <strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${order.trackingNumber}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="color: var(--text-muted); font-size: 0.85rem;">Estimated Delivery:</span>
            <strong style="color: #fff;">Within 48 Hours</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted); font-size: 0.85rem;">Total Paid:</span>
            <strong style="color: #fff; font-size: 1.1rem;">${Store.formatPrice(order.pricing.total)}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary" onclick="App.viewInvoiceReceipt('${order.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Printable Invoice Receipt
          </button>
          <button class="btn-secondary" onclick="document.getElementById('order-confirmation-modal').classList.remove('open'); App.switchView('orders');">
            View in My Orders
          </button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  },

  // Customer Orders Tab
  renderOrdersView() {
    const list = document.getElementById("customer-orders-list");
    if (!list) return;

    const orders = Store.getOrders();
    if (orders.length === 0) {
      list.innerHTML = `
        <div class="empty-catalog-state" style="max-width: 600px; margin: 3rem auto;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <path d="M3 6h18"></path>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h3>No Orders Recorded</h3>
          <p>Your hardware deployment history is currently clear.</p>
          <button class="btn-primary" style="margin-top: 1rem;" onclick="App.switchView('store')">Browse Store</button>
        </div>
      `;
      return;
    }

    list.innerHTML = orders.map(ord => {
      const statusClass = ord.status.toLowerCase();
      return `
        <div class="kpi-card" style="margin-bottom: 1.5rem; padding: 1.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: gap; margin-bottom: 1.25rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <h4 style="font-size: 1.25rem; font-weight: 800;">Order ${ord.id}</h4>
                <span class="status-pill ${statusClass}">${ord.status}</span>
              </div>
              <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
                Placed on ${new Date(ord.placedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })} • Tracking: <span style="font-family: var(--font-mono); color: var(--accent-cyan);">${ord.trackingNumber}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.4rem; font-weight: 800; color: #fff;">${Store.formatPrice(ord.pricing.total)}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${ord.paymentMethod}</div>
            </div>
          </div>

          <div class="order-tracking-timeline" style="margin: 1.5rem 0 2rem;">
            ${ord.timeline.map(step => `
              <div class="timeline-point ${step.completed ? 'done' : ''}">
                <div class="timeline-node">${step.completed ? '✓' : '•'}</div>
                <span class="timeline-label">${step.step}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${step.time || ''}</span>
              </div>
            `).join("")}
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
            ${ord.items.map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; background: #111522;" />
                  <div>
                    <strong style="color: #fff; font-size: 0.95rem;">${item.name}</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${item.color} • ${item.storage} • Qty: ${item.quantity}</div>
                  </div>
                </div>
                <span style="font-weight: 700; color: var(--accent-cyan);">${Store.formatPrice(item.price * item.quantity)}</span>
              </div>
            `).join("")}
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
            <button class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="App.viewInvoiceReceipt('${ord.id}')">
              View Invoice
            </button>
            <button class="btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.85rem;" onclick="App.reorder('${ord.id}')">
              Reorder All Items
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  reorder(orderId) {
    const order = Store.getOrderById(orderId);
    if (!order) return;
    order.items.forEach(item => {
      Store.addToCart(item.id, item.quantity, { color: item.color, storage: item.storage });
    });
    this.showToast("All items copied to your cart!", "success");
    this.openCartDrawer();
  },

  // Invoice Receipt Modal
  viewInvoiceReceipt(orderId) {
    const order = Store.getOrderById(orderId);
    if (!order) return;

    const modal = document.getElementById("invoice-modal");
    const content = document.getElementById("invoice-content");
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="background: #090c13; padding: 2.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); font-family: var(--font-main);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.5rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="width: 28px; height: 28px; border-radius: 8px; background: var(--grad-cyan-blue); display: inline-flex; align-items: center; justify-content: center; font-weight: 800; color: #07090e;">N</span>
              <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff;">NOVATECH SYSTEMS</h2>
            </div>
            <p style="color: var(--text-muted); font-size: 0.82rem;">Quantum Hardware & Spatial Laboratories Inc.<br>400 Mission Street, San Francisco, CA 94105</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-mono);">INVOICE</div>
            <div style="color: #fff; font-weight: 700;">#${order.id}</div>
            <div style="color: var(--text-muted); font-size: 0.85rem;">Date: ${new Date(order.placedAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
          <div>
            <h5 style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.4rem;">Customer & Shipping To:</h5>
            <strong style="color: #fff; font-size: 1rem;">${order.customer.name}</strong>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.2rem;">
              ${order.customer.address}<br>
              ${order.customer.city}, ${order.customer.state} ${order.customer.zip}<br>
              ${order.customer.country}<br>
              ${order.customer.email} • ${order.customer.phone}
            </p>
          </div>
          <div style="text-align: right;">
            <h5 style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.4rem;">Payment Details:</h5>
            <div style="color: #fff; font-weight: 600;">Method: ${order.paymentMethod}</div>
            <div style="color: var(--text-secondary); font-size: 0.85rem;">Logistics: ${order.pricing.shippingMethod}</div>
            <div style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.85rem;">Airbill: ${order.trackingNumber}</div>
            <div style="display: inline-block; margin-top: 0.5rem; padding: 2px 10px; border-radius: 9999px; background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); font-weight: 700; font-size: 0.75rem;">PAID & VERIFIED</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 0.88rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); text-align: left;">
              <th style="padding: 0.75rem 0;">Hardware Device</th>
              <th style="padding: 0.75rem; text-align: center;">Qty</th>
              <th style="padding: 0.75rem; text-align: right;">Unit Price</th>
              <th style="padding: 0.75rem 0; text-align: right;">Line Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(i => `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 0.75rem 0;">
                  <strong style="color: #fff;">${i.name}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${i.color} / ${i.storage}</div>
                </td>
                <td style="padding: 0.75rem; text-align: center; color: #fff;">${i.quantity}</td>
                <td style="padding: 0.75rem; text-align: right; color: var(--text-secondary);">${Store.formatPrice(i.price)}</td>
                <td style="padding: 0.75rem 0; text-align: right; color: #fff; font-weight: 700;">${Store.formatPrice(i.price * i.quantity)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 280px; display: flex; flex-direction: column; gap: 0.4rem;">
            <div style="display: flex; justify-content: space-between; color: var(--text-secondary); font-size: 0.88rem;">
              <span>Subtotal:</span>
              <span>${Store.formatPrice(order.pricing.subtotal)}</span>
            </div>
            ${order.pricing.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: var(--accent-emerald); font-size: 0.88rem;">
                <span>Discount (${order.pricing.couponCode}):</span>
                <span>-${Store.formatPrice(order.pricing.discount)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; color: var(--text-secondary); font-size: 0.88rem;">
              <span>Shipping & Vault Logistics:</span>
              <span>${order.pricing.shipping === 0 ? 'FREE' : Store.formatPrice(order.pricing.shipping)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--text-secondary); font-size: 0.88rem;">
              <span>Tax (8.25%):</span>
              <span>${Store.formatPrice(order.pricing.tax)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #fff; font-weight: 800; font-size: 1.25rem; border-top: 1px solid var(--border-subtle); padding-top: 0.6rem; margin-top: 0.2rem;">
              <span>Total Paid:</span>
              <span style="color: var(--accent-cyan);">${Store.formatPrice(order.pricing.total)}</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 2.5rem; text-align: center; border-top: 1px dashed var(--border-subtle); padding-top: 1.5rem; color: var(--text-muted); font-size: 0.8rem;">
          Thank you for choosing NovaTech. Covered by our 3-Year QuantumCare hardware replacement warranty.
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;">
        <button class="btn-primary" onclick="window.print()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print / Save PDF
        </button>
      </div>
    `;

    modal.classList.add("open");
  },

  // Toast Notification
  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-msg ${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✓";
    if (type === "error") icon = "✕";

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-body">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }
};

// Initialize App when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  App.init();
});
