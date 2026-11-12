// NovaTech Admin Dashboard Controller & Real-Time Management

const Admin = {
  activeTab: "inventory", // "inventory" | "orders" | "analytics"
  editingProductId: null,

  init() {
    this.renderKPIs();
    this.renderRevenueChart();
    this.renderCategoryChart();
    this.renderInventoryTable();
    this.renderOrdersTable();
    this.bindAdminEvents();

    // Listen to changes
    Store.on("productsChanged", () => {
      this.renderKPIs();
      this.renderInventoryTable();
      this.renderCategoryChart();
    });

    Store.on("ordersChanged", () => {
      this.renderKPIs();
      this.renderOrdersTable();
      this.renderRevenueChart();
    });
  },

  bindAdminEvents() {
    // Admin tab switching
    document.querySelectorAll(".admin-nav-item").forEach(item => {
      item.addEventListener("click", (e) => {
        document.querySelectorAll(".admin-nav-item").forEach(t => t.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.activeTab = e.currentTarget.getAttribute("data-tab");

        const invTab = document.getElementById("admin-tab-inventory");
        const ordTab = document.getElementById("admin-tab-orders");

        if (invTab) invTab.style.display = this.activeTab === "inventory" ? "block" : "none";
        if (ordTab) ordTab.style.display = this.activeTab === "orders" ? "block" : "none";
      });
    });

    // Add Product Modal Trigger
    const addProductBtn = document.getElementById("admin-add-product-btn");
    const productModal = document.getElementById("admin-product-modal");
    if (addProductBtn && productModal) {
      addProductBtn.addEventListener("click", () => {
        this.openProductFormModal(null);
      });
    }

    // Save Product Form
    const productForm = document.getElementById("admin-product-form");
    if (productForm) {
      productForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleProductFormSubmit();
      });
    }

    // Reset Demo Data
    const resetBtn = document.getElementById("admin-reset-demo-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset NovaTech to factory seed dataset? All customized products and orders will be reinitialized.")) {
          Store.resetToDefaults();
          App.showToast("Store reset to factory demo state.", "success");
        }
      });
    }

    // Add Mock Order Demo
    const mockOrderBtn = document.getElementById("admin-mock-order-btn");
    if (mockOrderBtn) {
      mockOrderBtn.addEventListener("click", () => {
        this.generateMockOrder();
      });
    }

    // Preset Image Select in Add Product
    const presetSelect = document.getElementById("prod-image-preset");
    const imageInput = document.getElementById("prod-image-url");
    if (presetSelect && imageInput) {
      presetSelect.addEventListener("change", (e) => {
        if (e.target.value) {
          imageInput.value = e.target.value;
          const previewImg = document.getElementById("prod-img-preview");
          if (previewImg) previewImg.src = e.target.value;
        }
      });
    }
  },

  // KPI Calculations
  renderKPIs() {
    const products = Store.getProducts();
    const orders = Store.getOrders();

    // Gross Revenue
    const totalRev = orders.reduce((sum, ord) => {
      return ord.status !== "Cancelled" ? sum + ord.pricing.total : sum;
    }, 0);

    // Low stock count (< 5 units)
    const lowStock = products.filter(p => p.stock <= 5).length;

    const revEl = document.getElementById("kpi-revenue");
    const ordersEl = document.getElementById("kpi-orders");
    const prodsEl = document.getElementById("kpi-products");
    const stockEl = document.getElementById("kpi-low-stock");

    if (revEl) revEl.textContent = Store.formatPrice(totalRev);
    if (ordersEl) ordersEl.textContent = orders.length;
    if (prodsEl) prodsEl.textContent = products.length;
    if (stockEl) {
      stockEl.textContent = lowStock;
      stockEl.style.color = lowStock > 0 ? "var(--accent-red)" : "var(--accent-emerald)";
    }
  },

  // Interactive Revenue Chart (SVG Area with Gradient)
  renderRevenueChart() {
    const chartContainer = document.getElementById("revenue-chart-svg");
    if (!chartContainer) return;

    // Daily revenue points mock + actual orders
    const dataPoints = [
      { day: "Mon", val: 3200 },
      { day: "Tue", val: 5400 },
      { day: "Wed", val: 4100 },
      { day: "Thu", val: 8900 },
      { day: "Fri", val: 7600 },
      { day: "Sat", val: 11200 },
      { day: "Sun", val: 14800 }
    ];

    const maxVal = Math.max(...dataPoints.map(d => d.val)) * 1.15;
    const width = 640;
    const height = 220;
    const padX = 40;
    const padY = 30;

    const points = dataPoints.map((d, i) => {
      const x = padX + (i * ((width - padX * 2) / (dataPoints.length - 1)));
      const y = height - padY - ((d.val / maxVal) * (height - padY * 2));
      return { x, y, ...d };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

    chartContainer.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#00f2fe" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#00f2fe" />
            <stop offset="100%" stop-color="#9d4edd" />
          </linearGradient>
        </defs>

        <!-- Horizontal Guide Gridlines -->
        <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
        <line x1="${padX}" y1="${height / 2}" x2="${width - padX}" y2="${height / 2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
        <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="rgba(255,255,255,0.12)" />

        <!-- Area fill -->
        <path d="${areaD}" fill="url(#areaGradient)" />

        <!-- Line stroke -->
        <path d="${pathD}" fill="none" stroke="url(#lineGradient)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Circles on points -->
        ${points.map(p => `
          <g class="chart-point-group">
            <circle cx="${p.x}" cy="${p.y}" r="5" fill="#00f2fe" stroke="#07090e" stroke-width="2.5" />
            <circle cx="${p.x}" cy="${p.y}" r="14" fill="transparent" />
            <text x="${p.x}" y="${height - 10}" font-size="11" fill="#64748b" text-anchor="middle" font-family="var(--font-main)">${p.day}</text>
            <text x="${p.x}" y="${p.y - 12}" font-size="10.5" font-weight="700" fill="#fff" text-anchor="middle" font-family="var(--font-mono)">$${(p.val / 1000).toFixed(1)}k</text>
          </g>
        `).join("")}
      </svg>
    `;
  },

  // Category Distribution Donut Chart
  renderCategoryChart() {
    const container = document.getElementById("category-chart-svg");
    const legend = document.getElementById("category-chart-legend");
    if (!container) return;

    const products = Store.getProducts();
    const catCounts = {};
    products.forEach(p => {
      catCounts[p.categoryName] = (catCounts[p.categoryName] || 0) + 1;
    });

    const colors = ["#00f2fe", "#9d4edd", "#f72585", "#10b981", "#f59e0b", "#3b82f6"];
    const total = products.length || 1;
    let accumulatedAngle = 0;

    const segments = Object.entries(catCounts).map(([cat, count], i) => {
      const percentage = count / total;
      const angle = percentage * 360;
      const startAngle = accumulatedAngle;
      accumulatedAngle += angle;
      return {
        cat,
        count,
        percentage: Math.round(percentage * 100),
        color: colors[i % colors.length],
        startAngle,
        angle
      };
    });

    const size = 160;
    const r = 60;
    const cx = size / 2;
    const cy = size / 2;
    const strokeWidth = 24;

    const paths = segments.map(s => {
      const startRad = (s.startAngle - 90) * (Math.PI / 180);
      const endRad = (s.startAngle + s.angle - 90) * (Math.PI / 180);
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = s.angle > 180 ? 1 : 0;

      return `
        <path d="M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}" 
              stroke="${s.color}" 
              stroke-width="${strokeWidth}" 
              fill="none" 
              stroke-linecap="round" />
      `;
    }).join("");

    container.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${paths}
        <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="20" font-weight="800" fill="#fff" font-family="var(--font-main)">${products.length}</text>
        <text x="${cx}" y="${cy + 15}" text-anchor="middle" font-size="10" font-weight="700" fill="#64748b" text-transform="uppercase" font-family="var(--font-main)">Items</text>
      </svg>
    `;

    if (legend) {
      legend.innerHTML = segments.map(s => `
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.4rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${s.color};"></span>
            <span style="color: var(--text-secondary);">${s.cat}</span>
          </div>
          <strong style="color: #fff;">${s.count} (${s.percentage}%)</strong>
        </div>
      `).join("");
    }
  },

  // Inventory Table
  renderInventoryTable() {
    const tbody = document.getElementById("admin-inventory-tbody");
    if (!tbody) return;

    const products = Store.getProducts();

    tbody.innerHTML = products.map(product => {
      const isLow = product.stock <= 5;
      const statusText = product.stock === 0 ? "Depleted" : (isLow ? "Low Stock" : "Optimal");
      const statusClass = product.stock === 0 ? "cancelled" : (isLow ? "processing" : "delivered");

      return `
        <tr data-product-id="${product.id}">
          <td>
            <div class="table-product-cell">
              <img class="table-product-thumb" src="${product.image}" alt="${product.name}" />
              <div>
                <strong style="color: #fff; font-size: 0.92rem; display: block;">${product.name}</strong>
                <span style="color: var(--text-muted); font-size: 0.75rem; font-family: var(--font-mono);">${product.id}</span>
              </div>
            </div>
          </td>
          <td>
            <span style="color: var(--accent-cyan); font-weight: 600; font-size: 0.85rem;">${product.categoryName}</span>
          </td>
          <td>
            <strong style="color: #fff; font-size: 0.95rem;">${Store.formatPrice(product.price)}</strong>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <button class="action-btn-sm" onclick="Admin.adjustStock('${product.id}', -1)" title="Decrement stock">&minus;</button>
              <strong style="min-width: 28px; text-align: center; color: ${isLow ? 'var(--accent-red)' : '#fff'};">${product.stock}</strong>
              <button class="action-btn-sm" onclick="Admin.adjustStock('${product.id}', 1)" title="Increment stock">&plus;</button>
            </div>
          </td>
          <td>
            <span class="status-pill ${statusClass}">${statusText}</span>
          </td>
          <td>
            <div class="table-action-btns">
              <button class="action-btn-sm" onclick="Admin.openProductFormModal('${product.id}')" title="Edit Product">
                Edit
              </button>
              <button class="action-btn-sm delete" onclick="Admin.deleteProduct('${product.id}')" title="Delete Product">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  adjustStock(productId, delta) {
    const prod = Store.getProductById(productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    Store.updateProduct(productId, { stock: newStock });
    App.showToast(`Updated stock for "${prod.name}" to ${newStock}`, "info");
  },

  deleteProduct(productId) {
    const prod = Store.getProductById(productId);
    if (!prod) return;
    if (confirm(`Are you sure you want to delete "${prod.name}" from the store catalog?`)) {
      Store.deleteProduct(productId);
      App.showToast(`Deleted "${prod.name}" from catalog.`, "info");
    }
  },

  // Open Add/Edit Product Modal
  openProductFormModal(productId = null) {
    this.editingProductId = productId;
    const modal = document.getElementById("admin-product-modal");
    const formTitle = document.getElementById("admin-form-modal-title");
    const submitBtn = document.getElementById("admin-form-submit-btn");

    const nameInput = document.getElementById("prod-name");
    const catInput = document.getElementById("prod-category");
    const priceInput = document.getElementById("prod-price");
    const origPriceInput = document.getElementById("prod-orig-price");
    const stockInput = document.getElementById("prod-stock");
    const tagInput = document.getElementById("prod-tag");
    const imgInput = document.getElementById("prod-image-url");
    const shortDescInput = document.getElementById("prod-short-desc");
    const descInput = document.getElementById("prod-desc");
    const previewImg = document.getElementById("prod-img-preview");

    if (productId) {
      const prod = Store.getProductById(productId);
      if (!prod) return;

      if (formTitle) formTitle.textContent = `Edit Product: ${prod.name}`;
      if (submitBtn) submitBtn.textContent = "Save Changes";

      if (nameInput) nameInput.value = prod.name;
      if (catInput) catInput.value = prod.category;
      if (priceInput) priceInput.value = prod.price;
      if (origPriceInput) origPriceInput.value = prod.originalPrice || "";
      if (stockInput) stockInput.value = prod.stock;
      if (tagInput) tagInput.value = prod.tag || "";
      if (imgInput) imgInput.value = prod.image;
      if (shortDescInput) shortDescInput.value = prod.shortDesc;
      if (descInput) descInput.value = prod.description;
      if (previewImg) previewImg.src = prod.image;
    } else {
      if (formTitle) formTitle.textContent = "Deploy New Product to Vault";
      if (submitBtn) submitBtn.textContent = "Create Product";

      if (nameInput) nameInput.value = "";
      if (catInput) catInput.value = "laptops";
      if (priceInput) priceInput.value = "";
      if (origPriceInput) origPriceInput.value = "";
      if (stockInput) stockInput.value = "10";
      if (tagInput) tagInput.value = "New Arrival";
      if (imgInput) imgInput.value = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80";
      if (shortDescInput) shortDescInput.value = "";
      if (descInput) descInput.value = "";
      if (previewImg) previewImg.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80";
    }

    if (modal) modal.classList.add("open");
  },

  handleProductFormSubmit() {
    const name = document.getElementById("prod-name")?.value.trim();
    const category = document.getElementById("prod-category")?.value;
    const price = parseFloat(document.getElementById("prod-price")?.value);
    const origPrice = parseFloat(document.getElementById("prod-orig-price")?.value) || null;
    const stock = parseInt(document.getElementById("prod-stock")?.value, 10);
    const tag = document.getElementById("prod-tag")?.value.trim();
    const image = document.getElementById("prod-image-url")?.value.trim();
    const shortDesc = document.getElementById("prod-short-desc")?.value.trim();
    const description = document.getElementById("prod-desc")?.value.trim();

    if (!name || isNaN(price) || isNaN(stock)) {
      App.showToast("Please provide product name, valid price, and stock count.", "error");
      return;
    }

    const catLabels = {
      laptops: "Laptops & Computing",
      wearables: "Wearables & Spatial",
      audio: "Audio & Acoustics",
      gaming: "Gaming & Peripherals",
      smart: "Smart & Robotics"
    };

    const payload = {
      name,
      category,
      categoryName: catLabels[category] || "Hardware",
      price,
      originalPrice: origPrice,
      stock,
      tag,
      image,
      shortDesc,
      description
    };

    if (this.editingProductId) {
      Store.updateProduct(this.editingProductId, payload);
      App.showToast(`Updated "${name}" successfully!`, "success");
    } else {
      Store.addProduct(payload);
      App.showToast(`Added "${name}" to store catalog!`, "success");
    }

    const modal = document.getElementById("admin-product-modal");
    if (modal) modal.classList.remove("open");
  },

  // Orders Table & Live Status Updating
  renderOrdersTable() {
    const tbody = document.getElementById("admin-orders-tbody");
    if (!tbody) return;

    const orders = Store.getOrders();

    tbody.innerHTML = orders.map(ord => {
      return `
        <tr data-order-id="${ord.id}">
          <td>
            <strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${ord.id}</strong>
          </td>
          <td>
            <strong style="color: #fff;">${ord.customer.name}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${ord.customer.email}</div>
          </td>
          <td>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">${new Date(ord.placedAt).toLocaleDateString()}</span>
          </td>
          <td>
            <span style="font-size: 0.85rem;">${ord.items.length} item(s)</span>
          </td>
          <td>
            <strong style="color: #fff;">${Store.formatPrice(ord.pricing.total)}</strong>
          </td>
          <td>
            <select class="form-control" style="padding: 0.35rem 0.65rem; font-size: 0.82rem; font-weight: 700; width: auto;" 
                    onchange="Admin.changeOrderStatus('${ord.id}', this.value)">
              <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>⏳ Processing</option>
              <option value="Shipped" ${ord.status === 'Shipped' ? 'selected' : ''}>🚀 Shipped</option>
              <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>✅ Delivered</option>
              <option value="Cancelled" ${ord.status === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
            </select>
          </td>
          <td>
            <button class="action-btn-sm" onclick="App.viewInvoiceReceipt('${ord.id}')">
              Invoice
            </button>
          </td>
        </tr>
      `;
    }).join("");
  },

  changeOrderStatus(orderId, newStatus) {
    const updated = Store.updateOrderStatus(orderId, newStatus);
    if (updated) {
      App.showToast(`Order #${orderId} status set to "${newStatus}"`, "success");
    }
  },

  // Fast Mock Order Generator for Demonstration
  generateMockOrder() {
    const prods = Store.getProducts();
    const randomProd = prods[Math.floor(Math.random() * prods.length)];

    const names = ["Aria Thorne", "Liam Chen", "Sophia Dubois", "Kenji Sato", "Maya Lin"];
    const cities = ["Tokyo", "Stockholm", "Austin", "Toronto", "Seoul"];
    const randName = names[Math.floor(Math.random() * names.length)];
    const randCity = cities[Math.floor(Math.random() * cities.length)];

    // Create a temporary mock cart
    const prevCart = [...Store.cart];
    Store.cart = [{
      productId: randomProd.id,
      name: randomProd.name,
      price: randomProd.price,
      quantity: 1,
      color: "Standard",
      storage: "Base",
      image: randomProd.image
    }];

    const order = Store.createOrder({
      customer: {
        name: randName,
        email: `${randName.toLowerCase().replace(/\s+/g, '.')}@future.net`,
        address: "88 Horizon Blvd",
        city: randCity,
        state: "Metropolis",
        zip: "10001",
        country: "Global",
        phone: "+1 800 555 0199"
      },
      shippingMethodCode: "express",
      shippingMethodLabel: "Priority Air Express",
      paymentMethodLabel: "Credit Card (•••• 8821)"
    });

    // Restore previous cart
    Store.cart = prevCart;
    Store.saveCart();

    App.showToast(`Simulated new incoming order #${order.id} from ${randName}!`, "success");
  }
};

window.Admin = Admin;
