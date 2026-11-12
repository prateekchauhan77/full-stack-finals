# ⚡ NovaTech — E-Commerce Platform

NovaTech is a high-performance, responsive e-commerce web platform featuring products catalog, shopping cart drawer, multi-step checkout with 3D card preview, simulated payment, order tracking, and an admin operations console.

---

## 🚀 How to Run in Visual Studio Code (3 Easy Ways)

### Method 1: Using the VS Code Terminal (Recommended)
1. **Open the Project in VS Code:**
   - Launch VS Code.
   - Go to **File** > **Open Folder...** (or press `Ctrl + K, Ctrl + O`).
   - Select this unzipped `novatech-ecommerce` folder.
2. **Open the Integrated Terminal:**
   - Press `Ctrl + ~` (tilde) or go to **Terminal** > **New Terminal**.
3. **Start the Local Server:**
   ```bash
   npm start
   ```
   *(or simply `node server.js`)*
4. **Open in Your Browser:**
   - Click the link printed in the terminal or visit:
   - 👉 **http://localhost:3000**

---

### Method 2: Using the VS Code "Live Server" Extension
1. Open the project folder in VS Code.
2. If you have the popular **Live Server** extension installed:
   - Right-click [`index.html`](file:///index.html) in the VS Code file explorer.
   - Click **"Open with Live Server"**.
3. It will automatically launch your default browser!

---

### Method 3: Direct Double-Click (Zero Install)
1. You can simply double-click [`index.html`](file:///index.html) in Windows File Explorer.
2. It will open directly in Chrome, Edge, Brave, or Firefox with all store, cart, checkout, and admin features working via localStorage!

---

## 🌟 Key Features to Try

- **Store & Search:** Search laptops, mice, headsets, or filter by category and price.
- **Quick Specs Modal:** Click **"Quick Specs"** on any item to view technical details, select colorways, and customize configurations.
- **Cart & Promo Codes:** Add items to cart, slide out the cart drawer, and enter promo code `NOVAFIRST` for 15% off.
- **Checkout & 3D Card Simulation:** Click **Proceed to Checkout**, fill shipping details, and see the interactive 3D card update live as you type.
- **Order Tracking:** After placing an order, view your shipment tracking timeline and print the official invoice receipt.
- **Admin Console:** Click **"Admin Console"** in the top navigation bar to see live revenue charts, adjust inventory stock levels (+/-), add new products, or change customer order statuses!

---

## 📁 Project Structure

```text
novatech-ecommerce/
│
├── index.html            # Main Single-Page Application (SPA)
├── package.json          # Project info and npm start script
├── server.js             # Built-in zero-dependency Node HTTP server
├── README.md             # Guide & instructions
│
├── css/
│   └── style.css         # Futuristic obsidian theme, glassmorphism & 3D card styling
│
└── js/
    ├── data.js           # Seed product catalog & initial orders
    ├── store.js          # Reactive state store & localStorage persistence
    ├── app.js            # Client UI, cart drawer, checkout & invoices
    └── admin.js          # Admin dashboard, SVG charts & inventory CRUD
```
