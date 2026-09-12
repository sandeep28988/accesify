# ACCESSIFY — Streetwear & Gothic Y2K Accessories E-Commerce (https://blyo.in/)

ACCESSIFY is an online streetwear and fashion accessories brand featuring 205 authentic products: 316L stainless steel rings, chains, necklaces, curb bracelets, belts, wallets, combos, and fragrances.

This project features a direct **WhatsApp Ordering System** integrated with the official number **+91 7012400815**, allowing customers to order individual products or entire carts with automatic pre-filled messages on both mobile and desktop.

---

## 🚀 Key Features

- **205 Authentic Products**: Sourced from Blyo's official catalogue with high-definition CDN photos (`cdn.zepio.io`), exact INR (`₹`) prices, compare prices, discounts, and size options.
- **Direct WhatsApp Ordering**:
  - **Single Product Order**: Clicking "Order through WhatsApp" automatically formats:
    ```
    Hi! I want to order this product:

    Product: [Product Name]
    Category: [Category]
    Price: ₹[Price]
    Product Link: [Product URL]

    Please confirm availability and ordering details.
    ```
  - **Cart / Multi-Product Order**: Clicking "Order Cart through WhatsApp" automatically formats:
    ```
    Hi! I would like to place an order:

    1. [Product Name] × [Qty] — ₹[Price]
    2. [Product Name] × [Qty] — ₹[Price]

    Total: ₹[Total]

    Please confirm my order and delivery details.
    ```
- **Official WhatsApp Number**: `+91 7012400815` (`https://wa.me/917012400815`).
- **Responsive Category Filtering**: All (205), Rings (88), Chains & Necklaces (50), Bracelets (21), Combos & Sets (16), Fragrances (13), Grooming (10), Limited Edition (5), Belts & Wallets (2).
- **Live Search & Price Sliders**: Real-time lookup with instant photo and price results.
- **Zero Build Setup Required**: Built with native ES Modules (Preact + HTM) and Vanilla CSS. Runs instantly in any modern browser.

---

## 📁 Workspace Structure

```
accesify/
├── index.html            # Entry HTML, SEO & Blyo metadata
├── package.json          # ESM module configuration
├── README.md             # Project documentation
└── src/
    ├── main.js           # Hash-router & Preact boot script
    ├── data/
    │   └── products.js   # Complete 205 Accessify products dataset
    ├── utils/
    │   └── whatsapp.js   # WhatsApp ordering URL generators (+91 7012400815)
    ├── components/
    │   ├── Navbar.js         # Header, drawer & live search in ₹
    │   ├── Footer.js         # Social links, guarantees & WhatsApp helpline
    │   ├── ProductCard.js    # Product cards with WhatsApp Order button & INR pricing
    │   ├── CartDrawer.js     # Slide-in bag with "Order Cart through WhatsApp" CTA
    │   ├── WhatsAppIcon.js   # Official WhatsApp SVG logo component
    │   ├── WhatsAppButton.js # Floating support button (+91 7012400815)
    │   └── Toast.js          # Feedback notifications
    ├── context/
    │   └── AppContext.js     # State store (cart, wishlist, routing)
    ├── pages/
    │   ├── Home.js           # Hero banner, category pills & top drops
    │   ├── Shop.js           # Full 205 products catalogue & filters
    │   ├── ProductDetails.js # Gallery zoom, size picker & WhatsApp CTA
    │   ├── Cart.js           # Detailed bag & WhatsApp multi-item order
    │   ├── Checkout.js       # Order confirmation & WhatsApp order launch
    │   ├── WishlistPage.js   # Saved favorites
    │   ├── About.js          # Brand identity & craftsmanship
    │   └── Contact.js        # Contact details & WhatsApp direct chat
    ├── services/
    │   └── db.js             # LocalStorage adapter seeded with 205 products
    └── styles/
        ├── index.css         # Theme variables & WhatsApp button styles
        ├── components.css    # Layout & component CSS
        └── pages.css         # Product grids & gallery styles
```

---

## 🌐 Running Locally

You can serve this project with any local HTTP server:

```bash
# Using Node / npx
npx serve .

# Or using Python
python -m http.server 8080
```
Then open `http://localhost:3000` or `http://localhost:8080` in your browser.
