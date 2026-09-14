// ACCESSIFY (https://blyo.in/) - Unified Database & LocalStorage Service
import { PRODUCTS_205 } from '../data/products.js';

// Filter out fragrances and grooming as requested - focus 100% on jewelry & streetwear accessories
const INITIAL_PRODUCTS = PRODUCTS_205.filter(p => 
    p.category !== "fragrances" && 
    p.category !== "grooming"
);

const INITIAL_COUPONS = [
    { code: "ACCESSIFY10", type: "percentage", value: 10, active: true },
    { code: "FIRST50", type: "flat", value: 50, active: true },
    { code: "FREESHIP", type: "flat", value: 30, active: true },
];

const INITIAL_REVIEWS = [
    { id: "r1", productId: "acc_3654", author: "Aarav Sharma", rating: 5, date: "2026-05-15", text: "Absolute masterpiece. The buckle weight and chrome polish on this CH97 belt are unmatched." },
    { id: "r2", productId: "acc_3651", author: "Rohan V.", rating: 5, date: "2026-05-20", text: "Heavy link chain and sharp gothic cross. Looks insane on dark denim." },
    { id: "r3", productId: "acc_3542", author: "Kabir M.", rating: 5, date: "2026-06-01", text: "Nine Fox Tale ring fits perfectly. Very comfortable and doesn't fade in water." },
    { id: "r4", productId: "acc_3557", author: "Vikram N.", rating: 5, date: "2026-06-05", text: "Moon bracelet is minimalist yet heavy. High quality 316L stainless steel." }
];

const INITIAL_ORDERS = [
    {
        id: "ACC-9124",
        date: "2026-09-14T14:15:00.000Z",
        customer: {
            name: "Devendra Patel",
            phone: "+919820144582",
            email: "devendra.p@gmail.com",
            address: "402 Skyline Heights, Bandra West, Mumbai, MH 400050"
        },
        items: [
            { id: "acc_3654", name: "CH97 BELT", price: 1499, quantity: 1, image: "assets/images/hero-hand.jpg" },
            { id: "acc_3596", name: "Chrome Heart Earring", price: 349, quantity: 2, image: "assets/images/category-earrings.jpg" }
        ],
        total: 2197,
        paymentMethod: "Cash on Delivery",
        status: "processing"
    },
    {
        id: "ACC-8975",
        date: "2026-09-14T11:42:00.000Z",
        customer: {
            name: "Siddharth Rao",
            phone: "+919940281734",
            email: "siddharth.rao@yahoo.com",
            address: "12/A Richmond Road, Ashok Nagar, Bengaluru, KA 560025"
        },
        items: [
            { id: "acc_3651", name: "Gothic Cross Link Chain", price: 799, quantity: 1, image: "assets/images/category-chains.jpg" }
        ],
        total: 799,
        paymentMethod: "WhatsApp Direct Pay",
        status: "shipped"
    },
    {
        id: "ACC-8610",
        date: "2026-09-13T19:20:00.000Z",
        customer: {
            name: "Ananya Deshmukh",
            phone: "+919711562890",
            email: "ananya.d@outlook.com",
            address: "B-704 Silver Oak, Koregaon Park, Pune, MH 411001"
        },
        items: [
            { id: "acc_3557", name: "Elegant Moon Bracelet", price: 499, quantity: 1, image: "assets/images/category-bracelets.jpg" },
            { id: "acc_3542", name: "Minimal Nine Fox Tale Ring", price: 399, quantity: 1, image: "assets/images/category-rings.jpg" }
        ],
        total: 898,
        paymentMethod: "Cash on Delivery",
        status: "delivered"
    },
    {
        id: "ACC-8402",
        date: "2026-09-13T16:05:00.000Z",
        customer: {
            name: "Karan Malhotra",
            phone: "+919819023411",
            email: "karan.malhotra@gmail.com",
            address: "House 24, Sector 15, Chandigarh, CH 160015"
        },
        items: [
            { id: "acc_3652", name: "Ruby Gothic Cross Pendant Combo", price: 1299, quantity: 1, image: "assets/images/category-combos.jpg" }
        ],
        total: 1299,
        paymentMethod: "WhatsApp Direct Pay",
        status: "pending"
    }
];

const DEFAULT_SETTINGS = {
    storeName: "ACCESSIFY",
    storeTagline: "PREMIUM STREETWEAR & GOTHIC JEWELRY",
    whatsappPhone: "917012400815",
    supportEmail: "orders@accessify.store",
    currency: "₹",
    deliveryFee: 50,
    freeDeliveryThreshold: 999,
    codEnabled: true,
    whatsappCheckoutEnabled: true,
    upiId: "accessify@upi"
};

const INITIAL_BANNERS = [
    {
        id: "b1",
        title: "GET ACCESSIFIED",
        subtitle: "STREETWEAR & GOTHIC Y2K ACCESSORIES",
        description: "Stainless steel rings, heavyweight industrial chains, bracelets, and tactical streetwear essentials.",
        image: "assets/images/hero-hand.jpg",
        ctaText: "EXPLORE SHOP",
        ctaLink: "#/shop"
    }
];

const DEFAULT_CATEGORIES = [
    "chains",
    "rings",
    "earrings",
    "bracelets",
    "sleek-chains",
    "y2k-gothic-necklaces",
    "iced-out-jewels",
    "combos",
    "belts",
    "wallets"
];

// Helper to check localStorage and initialize
const getLocalStorageItem = (key, initialValue) => {
    try {
        const item = localStorage.getItem(`accessify_${key}`);
        return item ? JSON.parse(item) : initialValue;
    } catch (error) {
        console.error("Error accessing localStorage", error);
        return initialValue;
    }
};

const setLocalStorageItem = (key, value) => {
    try {
        localStorage.setItem(`accessify_${key}`, JSON.stringify(value));
    } catch (error) {
        console.error("Error setting localStorage", error);
    }
};

// Seeding - ensure jewelry products are loaded without fragrances/grooming
const existingProducts = getLocalStorageItem("products_v5", null);
if (!existingProducts || !Array.isArray(existingProducts) || existingProducts.length < INITIAL_PRODUCTS.length) {
    setLocalStorageItem("products_v5", INITIAL_PRODUCTS);
}

if (!localStorage.getItem("accessify_coupons")) {
    setLocalStorageItem("coupons", INITIAL_COUPONS);
}
if (!localStorage.getItem("accessify_reviews")) {
    setLocalStorageItem("reviews", INITIAL_REVIEWS);
}
const existingOrders = getLocalStorageItem("orders_v2", null);
if (!existingOrders || !Array.isArray(existingOrders) || existingOrders.length === 0) {
    setLocalStorageItem("orders_v2", INITIAL_ORDERS);
}
if (!localStorage.getItem("accessify_settings_v1")) {
    setLocalStorageItem("settings_v1", DEFAULT_SETTINGS);
}
if (!localStorage.getItem("accessify_banners")) {
    setLocalStorageItem("banners", INITIAL_BANNERS);
}
if (!localStorage.getItem("accessify_custom_categories_v5")) {
    setLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES);
}

// Database Engine Export
export const db = {
    // PRODUCTS
    getProducts: () => {
        const prods = getLocalStorageItem("products_v5", INITIAL_PRODUCTS);
        // Exclude any legacy fragrance or grooming items
        return prods.filter(p => p.category !== "fragrances" && p.category !== "grooming");
    },

    getProductById: (targetId) => {
        if (!targetId) return null;
        const cleanId = String(targetId).trim().toLowerCase();
        const withoutAcc = cleanId.replace(/^acc_/, "");
        const prods = db.getProducts();

        // 1. Direct match on id (case-insensitive)
        let found = prods.find(p => p.id && p.id.toLowerCase() === cleanId);
        if (found) return found;

        // 2. Match with/without acc_ prefix
        found = prods.find(p => p.id && p.id.toLowerCase().replace(/^acc_/, "") === withoutAcc);
        if (found) return found;

        // 3. Match on original_id
        found = prods.find(p => p.original_id && String(p.original_id).trim() === withoutAcc);
        if (found) return found;

        // 4. Match on slug
        found = prods.find(p => p.slug && p.slug.toLowerCase() === cleanId);
        if (found) return found;

        // 5. Normalized name match
        found = prods.find(p => {
            const normName = (p.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            return normName === cleanId;
        });
        if (found) return found;

        // Fallback to full PRODUCTS_205 catalog
        found = PRODUCTS_205.find(p => p.id && p.id.toLowerCase() === cleanId);
        if (found) return found;

        found = PRODUCTS_205.find(p => p.id && p.id.toLowerCase().replace(/^acc_/, "") === withoutAcc);
        if (found) return found;

        found = PRODUCTS_205.find(p => p.original_id && String(p.original_id).trim() === withoutAcc);
        if (found) return found;

        found = PRODUCTS_205.find(p => p.slug && p.slug.toLowerCase() === cleanId);
        if (found) return found;

        return null;
    },
    
    saveProduct: (product) => {
        const products = db.getProducts();
        if (product.id) {
            const index = products.findIndex(p => p.id === product.id);
            if (index !== -1) {
                products[index] = { 
                    ...products[index], 
                    ...product,
                    price: Number(product.price) || 0,
                    comparePrice: Number(product.comparePrice) || Number(product.price) || 0
                };
            }
        } else {
            const newProduct = {
                ...product,
                id: "acc_" + Date.now(),
                price: Number(product.price) || 0,
                comparePrice: Number(product.comparePrice) || Number(product.price) || 0,
                rating: 5.0,
                numReviews: 0,
                images: Array.isArray(product.images) && product.images.length > 0 
                    ? product.images 
                    : ["assets/images/hero-hand.jpg"],
                variants: Array.isArray(product.variants) ? product.variants : ["Standard"],
                stock: Number(product.stock) || 10
            };
            products.unshift(newProduct);
        }
        setLocalStorageItem("products_v5", products);
        return true;
    },

    updateProductPrice: (id, price, comparePrice) => {
        const products = db.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index].price = Number(price);
            if (comparePrice !== undefined && comparePrice !== null && comparePrice !== "") {
                products[index].comparePrice = Number(comparePrice);
            }
            setLocalStorageItem("products_v5", products);
            return products[index];
        }
        return null;
    },

    updateProduct: (id, updatedFields) => {
        const products = db.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedFields };
            if (updatedFields.price !== undefined) products[index].price = Number(updatedFields.price);
            if (updatedFields.comparePrice !== undefined) products[index].comparePrice = Number(updatedFields.comparePrice);
            if (updatedFields.stock !== undefined) products[index].stock = Number(updatedFields.stock);
            setLocalStorageItem("products_v5", products);
            return products[index];
        }
        return null;
    },
    
    deleteProduct: (id) => {
        const products = db.getProducts();
        const filtered = products.filter(p => p.id !== id);
        setLocalStorageItem("products_v5", filtered);
        return true;
    },

    resetToDefaultProducts: () => {
        setLocalStorageItem("products_v5", INITIAL_PRODUCTS);
        setLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES);
        return INITIAL_PRODUCTS;
    },

    exportProductsJson: () => {
        return JSON.stringify(db.getProducts(), null, 2);
    },

    // CATEGORIES
    getCategories: () => {
        const custom = getLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES);
        const products = db.getProducts();
        const fromProds = products.map(p => (p.category || "").toLowerCase().trim()).filter(Boolean);
        const combined = Array.from(new Set([...custom, ...fromProds]));
        return combined.filter(c => c !== "all" && c !== "fragrances" && c !== "grooming");
    },

    addCategory: (categoryName) => {
        if (!categoryName) return false;
        const slug = categoryName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
        if (slug === "fragrances" || slug === "grooming") return false;
        const current = getLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES);
        if (!current.includes(slug)) {
            current.push(slug);
            setLocalStorageItem("custom_categories_v5", current);
        }
        return slug;
    },

    // COUPONS
    getCoupons: () => getLocalStorageItem("coupons", INITIAL_COUPONS),
    
    saveCoupon: (coupon) => {
        const coupons = db.getCoupons();
        const existingIndex = coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
        if (existingIndex !== -1) {
            coupons[existingIndex] = { ...coupons[existingIndex], ...coupon };
        } else {
            coupons.push({ ...coupon, code: coupon.code.toUpperCase(), active: true });
        }
        setLocalStorageItem("coupons", coupons);
        return true;
    },
    
    deleteCoupon: (code) => {
        const coupons = db.getCoupons();
        const filtered = coupons.filter(c => c.code !== code);
        setLocalStorageItem("coupons", filtered);
        return true;
    },

    // REVIEWS
    getReviews: (productId) => {
        const reviews = getLocalStorageItem("reviews", INITIAL_REVIEWS);
        if (productId) {
            return reviews.filter(r => r.productId === productId);
        }
        return reviews;
    },
    
    addReview: (review) => {
        const reviews = getLocalStorageItem("reviews", INITIAL_REVIEWS);
        const newReview = {
            ...review,
            id: "r_" + Date.now(),
            date: new Date().toISOString().split("T")[0]
        };
        reviews.push(newReview);
        setLocalStorageItem("reviews", reviews);

        const products = db.getProducts();
        const productIndex = products.findIndex(p => p.id === review.productId);
        if (productIndex !== -1) {
            const productReviews = reviews.filter(r => r.productId === review.productId);
            const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
            products[productIndex].rating = parseFloat((totalRating / productReviews.length).toFixed(1));
            products[productIndex].numReviews = productReviews.length;
            setLocalStorageItem("products_v5", products);
        }
        return newReview;
    },

    // ORDERS
    getOrders: () => getLocalStorageItem("orders_v2", INITIAL_ORDERS),
    
    createOrder: (orderData) => {
        const orders = db.getOrders();
        const newOrder = {
            ...orderData,
            id: "ACC-" + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toISOString(),
            status: "pending"
        };
        orders.unshift(newOrder);
        setLocalStorageItem("orders_v2", orders);

        const products = db.getProducts();
        if (Array.isArray(newOrder.items)) {
            newOrder.items.forEach(item => {
                const productIndex = products.findIndex(p => p.id === item.id);
                if (productIndex !== -1) {
                    products[productIndex].stock = Math.max(0, (products[productIndex].stock || 20) - (item.quantity || 1));
                }
            });
            setLocalStorageItem("products_v5", products);
        }

        return newOrder;
    },
    
    updateOrderStatus: (orderId, status) => {
        const orders = db.getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders[index].status = status;
            setLocalStorageItem("orders_v2", orders);
            return true;
        }
        return false;
    },

    // CUSTOMERS (Derived from order book and user profiles)
    getCustomers: () => {
        const orders = db.getOrders();
        const map = {};
        orders.forEach(order => {
            const phone = (order.customer && order.customer.phone) ? String(order.customer.phone).trim() : "Unknown";
            if (!map[phone]) {
                map[phone] = {
                    id: "cust_" + phone.replace(/[^0-9]/g, ""),
                    name: (order.customer && order.customer.name) || "Valued Customer",
                    phone: phone,
                    email: (order.customer && order.customer.email) || "N/A",
                    address: (order.customer && order.customer.address) || "N/A",
                    orderCount: 0,
                    totalSpent: 0,
                    lastOrderDate: order.date
                };
            }
            map[phone].orderCount += 1;
            map[phone].totalSpent += (Number(order.total) || 0);
            if (new Date(order.date) > new Date(map[phone].lastOrderDate)) {
                map[phone].lastOrderDate = order.date;
            }
        });
        return Object.values(map);
    },

    // SETTINGS (Store information, WhatsApp numbers, shipping rules)
    getSettings: () => getLocalStorageItem("settings_v1", DEFAULT_SETTINGS),

    updateSettings: (newSettings) => {
        const current = db.getSettings();
        const updated = { ...current, ...newSettings };
        setLocalStorageItem("settings_v1", updated);
        return updated;
    },

    // BANNERS
    getBanners: () => getLocalStorageItem("banners", INITIAL_BANNERS),
    
    updateBanner: (banner) => {
        const banners = db.getBanners();
        banners[0] = { ...banners[0], ...banner };
        setLocalStorageItem("banners", banners);
        return true;
    }
};
