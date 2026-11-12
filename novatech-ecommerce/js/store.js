// NovaTech State Store with LocalStorage Persistence & Event Dispatcher

class StoreService {
  constructor() {
    this.listeners = {};
    this.init();
  }

  init() {
    // Initialize or load products
    const savedProducts = localStorage.getItem("novatech_products");
    if (!savedProducts) {
      this.products = [...INITIAL_PRODUCTS];
      this.saveProducts();
    } else {
      try {
        this.products = JSON.parse(savedProducts);
      } catch (e) {
        this.products = [...INITIAL_PRODUCTS];
        this.saveProducts();
      }
    }

    // Initialize or load cart
    const savedCart = localStorage.getItem("novatech_cart");
    this.cart = savedCart ? JSON.parse(savedCart) : [];

    // Initialize or load wishlist
    const savedWishlist = localStorage.getItem("novatech_wishlist");
    this.wishlist = savedWishlist ? JSON.parse(savedWishlist) : ["prod-1", "prod-3"];

    // Initialize or load orders
    const savedOrders = localStorage.getItem("novatech_orders");
    if (!savedOrders) {
      this.orders = [...INITIAL_ORDERS];
      this.saveOrders();
    } else {
      try {
        this.orders = JSON.parse(savedOrders);
      } catch (e) {
        this.orders = [...INITIAL_ORDERS];
        this.saveOrders();
      }
    }

    // Coupon
    const savedCoupon = localStorage.getItem("novatech_coupon");
    this.appliedCoupon = savedCoupon ? JSON.parse(savedCoupon) : null;

    // Currency
    this.currency = localStorage.getItem("novatech_currency") || "USD";
    this.currencyRates = {
      USD: { symbol: "$", rate: 1.0 },
      EUR: { symbol: "€", rate: 0.92 },
      GBP: { symbol: "£", rate: 0.79 },
      JPY: { symbol: "¥", rate: 155.0 }
    };
  }

  // Event Pub/Sub
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // Persistence Helpers
  saveProducts() {
    localStorage.setItem("novatech_products", JSON.stringify(this.products));
    this.emit("productsChanged", this.products);
  }

  saveCart() {
    localStorage.setItem("novatech_cart", JSON.stringify(this.cart));
    this.emit("cartChanged", this.cart);
  }

  saveWishlist() {
    localStorage.setItem("novatech_wishlist", JSON.stringify(this.wishlist));
    this.emit("wishlistChanged", this.wishlist);
  }

  saveOrders() {
    localStorage.setItem("novatech_orders", JSON.stringify(this.orders));
    this.emit("ordersChanged", this.orders);
  }

  // Currency
  setCurrency(currencyCode) {
    if (this.currencyRates[currencyCode]) {
      this.currency = currencyCode;
      localStorage.setItem("novatech_currency", currencyCode);
      this.emit("currencyChanged", this.currency);
    }
  }

  formatPrice(amountInUSD) {
    const config = this.currencyRates[this.currency] || this.currencyRates.USD;
    const converted = amountInUSD * config.rate;
    if (this.currency === "JPY") {
      return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Products
  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  addProduct(newProduct) {
    const product = {
      ...newProduct,
      id: "prod-" + Date.now(),
      rating: newProduct.rating || 5.0,
      reviewsCount: newProduct.reviewsCount || 1,
      gallery: newProduct.gallery && newProduct.gallery.length ? newProduct.gallery : [newProduct.image],
      variants: newProduct.variants || {
        colors: [{ name: "Standard Black", hex: "#111827" }],
        storage: [{ label: "Standard Spec", priceDelta: 0 }]
      }
    };
    this.products.unshift(product);
    this.saveProducts();
    return product;
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveProducts();
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveProducts();
  }

  // Cart
  getCart() {
    return this.cart;
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  addToCart(productId, quantity = 1, options = {}) {
    const product = this.getProductById(productId);
    if (!product) return { success: false, message: "Product not found" };

    const selectedColor = options.color || (product.variants?.colors?.[0]?.name ?? "Standard");
    const selectedStorage = options.storage || (product.variants?.storage?.[0]?.label ?? "Base");
    const priceDelta = options.priceDelta || 0;
    const finalPrice = product.price + priceDelta;

    const cartItemId = `${productId}-${selectedColor.replace(/\s+/g, '')}-${selectedStorage.replace(/\s+/g, '')}`;
    const existingIndex = this.cart.findIndex(item => item.cartItemId === cartItemId);

    const currentQtyInCart = existingIndex > -1 ? this.cart[existingIndex].quantity : 0;
    if (currentQtyInCart + quantity > product.stock) {
      return { 
        success: false, 
        message: `Only ${product.stock} units available in inventory.`, 
        available: product.stock 
      };
    }

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        cartItemId,
        productId,
        name: product.name,
        price: finalPrice,
        basePrice: product.price,
        image: product.image,
        category: product.category,
        quantity,
        color: selectedColor,
        storage: selectedStorage,
        stock: product.stock
      });
    }

    this.saveCart();
    return { success: true, message: `Added ${product.name} to cart` };
  }

  updateCartQuantity(cartItemId, delta) {
    const index = this.cart.findIndex(item => item.cartItemId === cartItemId);
    if (index === -1) return;

    const item = this.cart[index];
    const newQty = item.quantity + delta;
    const product = this.getProductById(item.productId);
    const stockLimit = product ? product.stock : item.stock;

    if (newQty <= 0) {
      this.cart.splice(index, 1);
    } else if (newQty > stockLimit) {
      return { success: false, message: `Maximum available stock is ${stockLimit}` };
    } else {
      item.quantity = newQty;
    }

    this.saveCart();
    return { success: true };
  }

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter(item => item.cartItemId !== cartItemId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    localStorage.removeItem("novatech_coupon");
    this.saveCart();
  }

  // Coupons
  applyCoupon(code) {
    const upperCode = (code || "").trim().toUpperCase();
    const coupon = INITIAL_COUPONS[upperCode];

    if (!coupon) {
      return { success: false, message: "Invalid promo code." };
    }

    const { subtotal } = this.getCartTotals();
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return { 
        success: false, 
        message: `Code ${upperCode} requires minimum order of $${coupon.minSpend}. (Current: $${subtotal.toFixed(2)})` 
      };
    }

    this.appliedCoupon = { code: upperCode, ...coupon };
    localStorage.setItem("novatech_coupon", JSON.stringify(this.appliedCoupon));
    this.emit("cartChanged", this.cart);
    return { success: true, message: `Coupon ${upperCode} applied successfully!`, coupon: this.appliedCoupon };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    localStorage.removeItem("novatech_coupon");
    this.emit("cartChanged", this.cart);
  }

  getCartTotals(shippingMethod = "standard") {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let discount = 0;
    if (this.appliedCoupon) {
      if (this.appliedCoupon.type === "percent") {
        discount = (subtotal * this.appliedCoupon.value) / 100;
      } else if (this.appliedCoupon.type === "fixed") {
        discount = Math.min(this.appliedCoupon.value, subtotal);
      }
    }

    // Shipping calculation: Free over $500 or with FREESHIP coupon
    let shipping = 0;
    if (subtotal > 0) {
      if (subtotal >= 500 || (this.appliedCoupon && this.appliedCoupon.type === "shipping")) {
        shipping = shippingMethod === "drone" ? 20.00 : 0.00;
      } else {
        if (shippingMethod === "express") shipping = 35.00;
        else if (shippingMethod === "drone") shipping = 49.00;
        else shipping = 19.00;
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.0825; // 8.25% standard estimated tax
    const total = taxableAmount + shipping + tax;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      freeShippingThreshold: 500,
      freeShippingRemaining: Math.max(0, 500 - subtotal),
      coupon: this.appliedCoupon
    };
  }

  // Wishlist
  getWishlist() {
    return this.wishlist;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(productId);
      added = true;
    }
    this.saveWishlist();
    return added;
  }

  // Orders
  getOrders() {
    return this.orders;
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  createOrder(orderPayload) {
    const totals = this.getCartTotals(orderPayload.shippingMethodCode);
    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const trackingCode = "NOVA-" + (orderPayload.shippingMethodCode || "STD").toUpperCase() + "-" + Math.floor(10000000 + Math.random() * 90000000);

    const order = {
      id: orderId,
      customer: orderPayload.customer,
      items: this.cart.map(item => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        storage: item.storage,
        image: item.image
      })),
      pricing: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        couponCode: this.appliedCoupon ? this.appliedCoupon.code : null,
        shipping: totals.shipping,
        shippingMethod: orderPayload.shippingMethodLabel || "Standard Secure Logistics",
        tax: totals.tax,
        total: totals.total
      },
      paymentMethod: orderPayload.paymentMethodLabel || "Credit Card",
      status: "Processing",
      placedAt: now.toISOString(),
      trackingNumber: trackingCode,
      timeline: [
        { step: "Order Placed", time: now.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), completed: true },
        { step: "Payment Confirmed", time: now.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), completed: true },
        { step: "Processing in Cleanroom", time: "In Progress", completed: true },
        { step: "Dispatched & In Transit", time: "Pending", completed: false },
        { step: "Delivered", time: "Estimated in 2-3 Business Days", completed: false }
      ]
    };

    // Deduct stock in catalog
    this.cart.forEach(cartItem => {
      const prod = this.getProductById(cartItem.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - cartItem.quantity);
      }
    });
    this.saveProducts();

    // Prepend order
    this.orders.unshift(order);
    this.saveOrders();

    // Clear cart & coupon
    this.clearCart();

    return order;
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.status = newStatus;
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    // Update timeline steps dynamically
    if (newStatus === "Processing") {
      order.timeline[0].completed = true;
      order.timeline[1].completed = true;
      order.timeline[2].completed = true;
      order.timeline[3].completed = false;
      order.timeline[4].completed = false;
    } else if (newStatus === "Shipped") {
      order.timeline.forEach((step, idx) => {
        if (idx <= 3) {
          step.completed = true;
          if (idx === 3) step.time = now;
        } else {
          step.completed = false;
        }
      });
    } else if (newStatus === "Delivered") {
      order.timeline.forEach((step, idx) => {
        step.completed = true;
        if (idx === 4) step.time = now;
      });
    } else if (newStatus === "Cancelled") {
      order.timeline.push({ step: "Order Cancelled & Refunded", time: now, completed: true, isCancelled: true });
    }

    this.saveOrders();
    return order;
  }

  // Reset to seed defaults
  resetToDefaults() {
    this.products = [...INITIAL_PRODUCTS];
    this.orders = [...INITIAL_ORDERS];
    this.cart = [];
    this.wishlist = ["prod-1", "prod-3"];
    this.appliedCoupon = null;
    localStorage.removeItem("novatech_coupon");
    this.saveProducts();
    this.saveOrders();
    this.saveCart();
    this.saveWishlist();
  }
}

// Global Store Instance
const Store = new StoreService();
