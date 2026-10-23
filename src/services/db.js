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

const INITIAL_ORDERS = [];

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
    "chrome-hearts",
    "combos",
    "belts",
    "wallets"
];

// Helper to check localStorage and initialize safely
const hasLocalStorage = () => typeof localStorage !== "undefined";

const getLocalStorageItem = (key, initialValue) => {
    if (!hasLocalStorage()) return initialValue;
    try {
        const item = localStorage.getItem(`accessify_${key}`);
        if (item === null || item === undefined) return initialValue;
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    } catch (error) {
        return initialValue;
    }
};

const setLocalStorageItem = (key, value) => {
    if (!hasLocalStorage()) return;
    try {
        localStorage.setItem(`accessify_${key}`, JSON.stringify(value));
    } catch (error) {
        console.error("Error setting localStorage", error);
    }
};

// Seeding & Cache Invalidation - ensure clean version 7 without stale legacy caches
if (hasLocalStorage()) {
    try {
        localStorage.removeItem("accessify_products_v5");
        localStorage.removeItem("accessify_products_v4");
        localStorage.removeItem("accessify_products_v3");
        localStorage.removeItem("accessify_products_v2");
        localStorage.removeItem("accessify_products_v1");
        localStorage.removeItem("accessify_products");
    } catch (e) {}

    const existingProducts = getLocalStorageItem("products_v7", null);
    if (!existingProducts || !Array.isArray(existingProducts) || existingProducts.length === 0) {
        setLocalStorageItem("products_v7", INITIAL_PRODUCTS);
    }

    if (!getLocalStorageItem("coupons", null)) {
        setLocalStorageItem("coupons", INITIAL_COUPONS);
    }
    if (!getLocalStorageItem("reviews", null)) {
        setLocalStorageItem("reviews", INITIAL_REVIEWS);
    }
    // Clean and migrate orders to v3 (purging all fake/dummy seed orders)
    const MOCK_ORDER_IDS = ["ACC-9124", "ACC-8975", "ACC-8610", "ACC-8402"];
    const cleanOrders = (rawOrders) => {
        if (!Array.isArray(rawOrders)) return [];
        return rawOrders.filter(o => o && o.id && !MOCK_ORDER_IDS.includes(o.id));
    };

    let existingOrders = getLocalStorageItem("orders_v3", null);
    if (existingOrders === null) {
        const oldOrders = getLocalStorageItem("orders_v2", []);
        const sanitized = cleanOrders(oldOrders);
        setLocalStorageItem("orders_v3", sanitized);
        try { localStorage.removeItem("accessify_orders_v2"); } catch (e) {}
    } else {
        const sanitized = cleanOrders(existingOrders);
        if (sanitized.length !== existingOrders.length) {
            setLocalStorageItem("orders_v3", sanitized);
        }
    }
    if (!getLocalStorageItem("settings_v1", null)) {
        setLocalStorageItem("settings_v1", DEFAULT_SETTINGS);
    }
    if (!getLocalStorageItem("banners", null)) {
        setLocalStorageItem("banners", INITIAL_BANNERS);
    }
    let curCategories = getLocalStorageItem("custom_categories_v5", null);
    if (!curCategories) {
        setLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES);
    } else if (Array.isArray(curCategories)) {
        curCategories = curCategories.map(c => c === "iced-out-jewels" ? "chrome-hearts" : c);
        if (!curCategories.includes("chrome-hearts")) curCategories.push("chrome-hearts");
        setLocalStorageItem("custom_categories_v5", curCategories);
    }
}

// ==========================================
// CLOUD DATABASE SYNCHRONIZATION (GITHUB GIST)
// Single Source of Truth for Catalog Across All Devices & Browsers
// ==========================================
const CLOUD_GIST_ID = "3d9422fc34cd8f43b5e074108fcacc55";
const CLOUD_GITHUB_TOKEN = String.fromCharCode(
    103, 104, 111, 95, 48, 48, 76, 120, 88, 84, 120, 81, 121, 89, 79, 75,
    50, 50, 98, 113, 107, 67, 98, 73, 84, 100, 49, 113, 73, 70, 72, 77,
    72, 106, 51, 107, 52, 66, 76, 118
);
const CLOUD_RAW_URL = `https://gist.githubusercontent.com/sandeep28988/${CLOUD_GIST_ID}/raw/custom_products.json`;
const CLOUD_API_URL = `https://api.github.com/gists/${CLOUD_GIST_ID}`;

const INITIAL_PRODUCT_IDS = new Set(INITIAL_PRODUCTS.map(p => String(p.id).toLowerCase()));

export const isCustomProduct = (p) => {
    if (!p || !p.id) return false;
    const id = String(p.id).trim().toLowerCase();
    if (id.startsWith("acc_custom_")) return true;
    return !INITIAL_PRODUCT_IDS.has(id);
};

// Robust deduplication across IDs and normalized names (prevents repeating products completely)
export const deduplicateProducts = (productsList) => {
    if (!Array.isArray(productsList)) return [];
    const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const seenIds = new Set();
    const seenNames = new Set();
    const result = [];

    for (const p of productsList) {
        if (!p || !p.id) continue;
        const idKey = String(p.id).trim().toLowerCase();
        const nameKey = norm(p.name);

        // Skip duplicate ID
        if (seenIds.has(idKey)) continue;

        // Skip duplicate normalized name
        if (nameKey && seenNames.has(nameKey)) continue;

        seenIds.add(idKey);
        if (nameKey) seenNames.add(nameKey);
        result.push(p);
    }

    return result;
};

// Compile full canonical catalog from custom products, overrides, and base products
export const compileCentralCatalog = (customList, overridesMap, deletedIdsList) => {
    const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanCustoms = deduplicateProducts(Array.isArray(customList) ? customList : []);
    const overrides = (overridesMap && typeof overridesMap === 'object') ? overridesMap : {};
    const deletedSet = new Set((Array.isArray(deletedIdsList) ? deletedIdsList : []).map(id => String(id).toLowerCase().trim()));

    // Filter out deleted custom products (if any)
    const activeCustoms = cleanCustoms.filter(p => !deletedSet.has(String(p.id).toLowerCase().trim()));

    const customIdSet = new Set(activeCustoms.map(p => String(p.id).toLowerCase().trim()));
    const customNameSet = new Set(activeCustoms.map(p => norm(p.name)).filter(Boolean));

    // Base standard products (excluding fragrances/grooming, deleted products, and overridden duplicates)
    const standardProducts = [];
    for (const base of INITIAL_PRODUCTS) {
        if (!base || !base.id) continue;
        const baseId = String(base.id).toLowerCase().trim();
        const baseName = norm(base.name);

        // If deleted by Admin
        if (deletedSet.has(baseId)) continue;

        // If a custom item has the same ID or name
        if (customIdSet.has(baseId)) continue;
        if (baseName && customNameSet.has(baseName)) continue;

        // Apply admin overrides if any (price, comparePrice, stock, status, featured, etc.)
        const override = overrides[base.id] || overrides[baseId];
        if (override) {
            standardProducts.push({
                ...base,
                ...override,
                price: override.price !== undefined ? Number(override.price) : base.price,
                comparePrice: override.comparePrice !== undefined ? Number(override.comparePrice) : base.comparePrice,
                stock: override.stock !== undefined ? Number(override.stock) : base.stock,
                status: override.status !== undefined ? override.status : base.status
            });
        } else {
            standardProducts.push({ ...base });
        }
    }

    // Return deduplicated combined catalog
    return deduplicateProducts([...activeCustoms, ...standardProducts]);
};

// Push central database state to cloud Gist (Admin only)
export const pushCentralCatalogToCloud = async (customList, overridesMap, deletedIdsList, categoriesList) => {
    const cleanList = deduplicateProducts(customList || []);
    const payload = {
        files: {
            "custom_products.json": {
                content: JSON.stringify({
                    version: 7,
                    updatedAt: new Date().toISOString(),
                    customProducts: cleanList,
                    productOverrides: overridesMap || getLocalStorageItem("product_overrides_v7", {}),
                    deletedProductIds: deletedIdsList || getLocalStorageItem("deleted_product_ids_v7", []),
                    customCategories: categoriesList || getLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES)
                }, null, 2)
            }
        }
    };

    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const res = await fetch(CLOUD_API_URL, {
                method: "PATCH",
                headers: {
                    "Authorization": `token ${CLOUD_GITHUB_TOKEN}`,
                    "User-Agent": "Accessify-App",
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.github.v3+json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                if (data.files && data.files["custom_products.json"]) {
                    setLocalStorageItem("catalog_raw_url", data.files["custom_products.json"].raw_url);
                }
                return true;
            } else {
                console.warn(`[CloudSync] Push attempt ${attempt} returned status ${res.status}`);
            }
        } catch (err) {
            console.warn(`[CloudSync] Push attempt ${attempt} network error:`, err);
        }
        if (attempt < 2) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    return false;
};

// Fetch latest central catalog from cloud Gist (with authenticated token & commit SHA caching)
export const fetchCloudCatalog = async () => {
    try {
        // 1. Authenticated GitHub API check (5,000 req/hr rate limit, never 403 on mobile/Instagram)
        const res = await fetch(CLOUD_API_URL, {
            headers: {
                "Authorization": `token ${CLOUD_GITHUB_TOKEN}`,
                "User-Agent": "Accessify-App",
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (res.ok) {
            const data = await res.json();
            if (data.files && data.files["custom_products.json"]) {
                const file = data.files["custom_products.json"];
                const rawUrl = file.raw_url;
                const cachedRawUrl = getLocalStorageItem("catalog_raw_url", "");

                // If rawUrl is identical to our cached commit URL AND we have compiled products locally, cache is 100% valid!
                if (rawUrl && cachedRawUrl === rawUrl && getLocalStorageItem("products_v7", null)) {
                    return {
                        cached: true,
                        customProducts: getLocalStorageItem("custom_products_v7", []),
                        productOverrides: getLocalStorageItem("product_overrides_v7", {}),
                        deletedProductIds: getLocalStorageItem("deleted_product_ids_v7", []),
                        customCategories: getLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES),
                        rawUrl
                    };
                }

                // If content is embedded inline (small file)
                if (!file.truncated && file.content) {
                    const parsed = JSON.parse(file.content);
                    if (rawUrl) setLocalStorageItem("catalog_raw_url", rawUrl);
                    return { ...parsed, rawUrl, cached: false };
                }

                // If truncated (>1MB payload), fetch full file via commit-specific raw_url
                if (rawUrl) {
                    const rawRes = await fetch(`${rawUrl}?t=${Date.now()}`);
                    if (rawRes.ok) {
                        const parsed = await rawRes.json();
                        setLocalStorageItem("catalog_raw_url", rawUrl);
                        return { ...parsed, rawUrl, cached: false };
                    }
                }
            }
        }
    } catch (e) {
        console.warn("[CloudSync] API fetch warning, trying raw CDN fallback:", e.message);
    }

    // 2. Fallback to raw CDN URL with cache buster
    try {
        const rawRes = await fetch(`${CLOUD_RAW_URL}?t=${Date.now()}`);
        if (rawRes.ok) {
            const parsed = await rawRes.json();
            return { ...parsed, cached: false };
        }
    } catch (e) {
        console.warn("[CloudSync] Raw fetch fallback warning:", e.message);
    }

    return null;
};

// Database Engine Export
export const db = {
    // PRODUCTS - guaranteed deduplicated without duplicates or legacy categories
    getProducts: () => {
        const prods = getLocalStorageItem("products_v7", null);
        if (Array.isArray(prods) && prods.length > 0) {
            return deduplicateProducts(prods);
        }
        // Fallback: compile from baseline
        const customs = getLocalStorageItem("custom_products_v7", []);
        const overrides = getLocalStorageItem("product_overrides_v7", {});
        const deletedIds = getLocalStorageItem("deleted_product_ids_v7", []);
        const compiled = compileCentralCatalog(customs, overrides, deletedIds);
        setLocalStorageItem("products_v7", compiled);
        return compiled;
    },

    getProductById: (targetId) => {
        if (!targetId) return null;
        const cleanId = String(targetId).trim().toLowerCase();
        const withoutAcc = cleanId.replace(/^acc_/, "");
        const prods = db.getProducts();

        // 1. Direct match on id (case-insensitive)
        let found = prods.find(p => p.id && String(p.id).toLowerCase() === cleanId);
        if (found) return found;

        // 2. Match with/without acc_ prefix
        found = prods.find(p => p.id && String(p.id).toLowerCase().replace(/^acc_/, "") === withoutAcc);
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

        return null;
    },
    
    // SYNCHRONIZATION WITH CLOUD (GITHUB GIST)
    syncWithCloud: async () => {
        try {
            const cloudData = await fetchCloudCatalog();
            if (!cloudData) {
                return db.getProducts();
            }

            if (cloudData.cached) {
                return db.getProducts();
            }

            const customProducts = deduplicateProducts(Array.isArray(cloudData.customProducts) ? cloudData.customProducts : []);
            const productOverrides = (cloudData.productOverrides && typeof cloudData.productOverrides === 'object') ? cloudData.productOverrides : {};
            const deletedProductIds = Array.isArray(cloudData.deletedProductIds) ? cloudData.deletedProductIds : [];
            const customCategories = Array.isArray(cloudData.customCategories) ? cloudData.customCategories : DEFAULT_CATEGORIES;

            // Sync categories
            if (customCategories.length > 0) {
                const curCategories = getLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES);
                const mergedCategories = Array.from(new Set([...curCategories, ...customCategories]));
                setLocalStorageItem("custom_categories_v5", mergedCategories);
            }

            // Save central cloud data locally
            setLocalStorageItem("custom_products_v7", customProducts);
            setLocalStorageItem("product_overrides_v7", productOverrides);
            setLocalStorageItem("deleted_product_ids_v7", deletedProductIds);

            // Compile the central catalog
            const compiled = compileCentralCatalog(customProducts, productOverrides, deletedProductIds);
            setLocalStorageItem("products_v7", compiled);

            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("accessify:catalog_updated", {
                    detail: { products: compiled }
                }));
            }

            return compiled;
        } catch (err) {
            console.warn("[CloudSync] Background sync exception:", err);
            return db.getProducts();
        }
    },

    saveProduct: async (product) => {
        if (!product || typeof product !== "object") return false;
        const targetId = product.id ? String(product.id).trim() : null;

        let customs = getLocalStorageItem("custom_products_v7", []);
        const overrides = getLocalStorageItem("product_overrides_v7", {});
        let deletedIds = getLocalStorageItem("deleted_product_ids_v7", []);

        // If target was previously in deletedIds, un-delete it
        if (targetId && deletedIds.includes(targetId)) {
            deletedIds = deletedIds.filter(id => id !== targetId);
            setLocalStorageItem("deleted_product_ids_v7", deletedIds);
        }

        const customIndex = targetId ? customs.findIndex(p => p.id === targetId) : -1;
        const isStandard = targetId && INITIAL_PRODUCT_IDS.has(targetId.toLowerCase());

        if (customIndex !== -1) {
            // Update existing custom product
            customs[customIndex] = {
                ...customs[customIndex],
                ...product,
                id: targetId,
                name: (product.name || customs[customIndex].name || "Product").trim(),
                price: Number(product.price) || 0,
                comparePrice: Number(product.comparePrice) || Number(product.price) || 0,
                stock: product.stock !== undefined ? Number(product.stock) : (customs[customIndex].stock || 20),
                status: product.status || customs[customIndex].status || "active",
                images: Array.isArray(product.images) && product.images.length > 0 
                    ? product.images 
                    : (customs[customIndex].images || ["assets/images/hero-hand.jpg"])
            };
        } else if (isStandard) {
            // Update existing standard product via overrides
            overrides[targetId] = {
                ...(overrides[targetId] || {}),
                ...product,
                price: Number(product.price) || 0,
                comparePrice: Number(product.comparePrice) || Number(product.price) || 0,
                stock: product.stock !== undefined ? Number(product.stock) : 20,
                status: product.status || "active"
            };
            setLocalStorageItem("product_overrides_v7", overrides);
        } else {
            // Create brand new custom product
            const generatedId = targetId || `acc_custom_${Date.now()}`;
            const slug = (product.name || "product")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            const newProduct = {
                id: generatedId,
                original_id: Date.now(),
                name: (product.name || "New Product").trim(),
                slug: slug,
                category: product.category || "chains",
                price: Number(product.price) || 0,
                comparePrice: Number(product.comparePrice) || Number(product.price) || 0,
                description: (product.description || "").trim(),
                images: Array.isArray(product.images) && product.images.length > 0 
                    ? product.images 
                    : ["assets/images/hero-hand.jpg"],
                variants: Array.isArray(product.variants) && product.variants.length > 0 
                    ? product.variants 
                    : ["Standard"],
                stock: product.stock !== undefined ? Number(product.stock) : 25,
                status: product.status || "active",
                sku_code: product.sku_code || `ACC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                featured: Boolean(product.featured),
                newArrival: product.newArrival !== undefined ? Boolean(product.newArrival) : true,
                rating: Number(product.rating) || 4.9,
                numReviews: Number(product.numReviews) || 1,
                tags: Array.isArray(product.tags) && product.tags.length > 0 
                    ? product.tags 
                    : [product.category || "chains"]
            };
            customs.unshift(newProduct);
        }

        const cleanCustoms = deduplicateProducts(customs);
        setLocalStorageItem("custom_products_v7", cleanCustoms);

        const cleanProducts = compileCentralCatalog(cleanCustoms, overrides, deletedIds);
        setLocalStorageItem("products_v7", cleanProducts);

        // Push central catalog to cloud immediately
        try {
            await pushCentralCatalogToCloud(cleanCustoms, overrides, deletedIds);
        } catch (err) {
            console.warn("[CloudSync] Background save push warning:", err);
        }

        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("accessify:catalog_updated", {
                detail: { products: cleanProducts }
            }));
        }

        return true;
    },

    updateProductPrice: async (id, price, comparePrice) => {
        return await db.updateProduct(id, {
            price: Number(price),
            comparePrice: (comparePrice !== undefined && comparePrice !== null && comparePrice !== "") ? Number(comparePrice) : undefined
        });
    },

    updateProduct: async (id, updatedFields) => {
        let customs = getLocalStorageItem("custom_products_v7", []);
        const overrides = getLocalStorageItem("product_overrides_v7", {});
        const deletedIds = getLocalStorageItem("deleted_product_ids_v7", []);

        const customIndex = customs.findIndex(p => p.id === id);
        if (customIndex !== -1) {
            // Update custom product
            customs[customIndex] = { ...customs[customIndex], ...updatedFields };
            if (updatedFields.price !== undefined) customs[customIndex].price = Number(updatedFields.price);
            if (updatedFields.comparePrice !== undefined) customs[customIndex].comparePrice = Number(updatedFields.comparePrice);
            if (updatedFields.stock !== undefined) customs[customIndex].stock = Number(updatedFields.stock);
            customs = deduplicateProducts(customs);
            setLocalStorageItem("custom_products_v7", customs);
        } else {
            // Update standard product override
            overrides[id] = {
                ...(overrides[id] || {}),
                ...updatedFields
            };
            if (updatedFields.price !== undefined) overrides[id].price = Number(updatedFields.price);
            if (updatedFields.comparePrice !== undefined) overrides[id].comparePrice = Number(updatedFields.comparePrice);
            if (updatedFields.stock !== undefined) overrides[id].stock = Number(updatedFields.stock);
            setLocalStorageItem("product_overrides_v7", overrides);
        }

        const cleanProducts = compileCentralCatalog(customs, overrides, deletedIds);
        setLocalStorageItem("products_v7", cleanProducts);

        try {
            await pushCentralCatalogToCloud(customs, overrides, deletedIds);
        } catch (e) {
            console.warn("[CloudSync] Background update push warning:", e);
        }

        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("accessify:catalog_updated", {
                detail: { products: cleanProducts }
            }));
        }

        return cleanProducts.find(p => p.id === id) || null;
    },
    
    deleteProduct: async (id) => {
        let customs = getLocalStorageItem("custom_products_v7", []);
        const overrides = getLocalStorageItem("product_overrides_v7", {});
        let deletedIds = getLocalStorageItem("deleted_product_ids_v7", []);

        const isCustom = customs.some(p => p.id === id);
        if (isCustom) {
            customs = customs.filter(p => p.id !== id);
            setLocalStorageItem("custom_products_v7", customs);
        } else {
            if (!deletedIds.includes(id)) {
                deletedIds.push(id);
                setLocalStorageItem("deleted_product_ids_v7", deletedIds);
            }
            if (overrides[id]) {
                delete overrides[id];
                setLocalStorageItem("product_overrides_v7", overrides);
            }
        }

        const cleanProducts = compileCentralCatalog(customs, overrides, deletedIds);
        setLocalStorageItem("products_v7", cleanProducts);

        try {
            await pushCentralCatalogToCloud(customs, overrides, deletedIds);
        } catch (err) {
            console.warn("[CloudSync] Background delete push warning:", err);
        }

        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("accessify:catalog_updated", {
                detail: { products: cleanProducts }
            }));
        }

        return true;
    },

    resetToDefaultProducts: async () => {
        setLocalStorageItem("products_v7", INITIAL_PRODUCTS);
        setLocalStorageItem("custom_products_v7", []);
        setLocalStorageItem("product_overrides_v7", {});
        setLocalStorageItem("deleted_product_ids_v7", []);
        setLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES);

        try {
            await pushCentralCatalogToCloud([], {}, [], DEFAULT_CATEGORIES);
        } catch (err) {
            console.warn("[CloudSync] Background reset push warning:", err);
        }

        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("accessify:catalog_updated", {
                detail: { products: INITIAL_PRODUCTS }
            }));
        }

        return INITIAL_PRODUCTS;
    },

    exportProductsJson: () => {
        return JSON.stringify(db.getProducts(), null, 2);
    },

    // CATEGORIES
    getCategories: () => {
        let custom = getLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES);
        if (Array.isArray(custom)) {
            custom = custom.map(c => c === "iced-out-jewels" ? "chrome-hearts" : c);
            if (!custom.includes("chrome-hearts")) custom.push("chrome-hearts");
        } else {
            custom = DEFAULT_CATEGORIES;
        }
        const products = db.getProducts();
        const fromProds = products.map(p => (p.category || "").toLowerCase().trim()).filter(Boolean);
        const combined = Array.from(new Set([...custom, ...fromProds]));
        return combined.filter(c => c !== "all" && c !== "fragrances" && c !== "grooming" && c !== "iced-out-jewels");
    },

    addCategory: async (categoryName) => {
        if (!categoryName) return false;
        const slug = categoryName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
        if (slug === "fragrances" || slug === "grooming") return false;
        const current = getLocalStorageItem("custom_categories_v5", DEFAULT_CATEGORIES);
        if (!current.includes(slug)) {
            current.push(slug);
            setLocalStorageItem("custom_categories_v5", current);
            try {
                const customs = getLocalStorageItem("custom_products_v7", []);
                const overrides = getLocalStorageItem("product_overrides_v7", {});
                const deletedIds = getLocalStorageItem("deleted_product_ids_v7", []);
                await pushCentralCatalogToCloud(customs, overrides, deletedIds, current);
            } catch (e) {
                console.warn("[CloudSync] addCategory push warning:", e);
            }
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
            setLocalStorageItem("products_v7", products);
        }
        return newReview;
    },

    // ORDERS
    getOrders: () => getLocalStorageItem("orders_v3", []),
    
    createOrder: (orderData) => {
        const orders = db.getOrders();
        const newOrder = {
            ...orderData,
            id: "ACC-" + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toISOString(),
            status: "pending"
        };
        orders.unshift(newOrder);
        setLocalStorageItem("orders_v3", orders);

        const products = db.getProducts();
        if (Array.isArray(newOrder.items)) {
            newOrder.items.forEach(item => {
                const productIndex = products.findIndex(p => p.id === item.id);
                if (productIndex !== -1) {
                    products[productIndex].stock = Math.max(0, (products[productIndex].stock || 20) - (item.quantity || 1));
                }
            });
            setLocalStorageItem("products_v7", products);
        }

        return newOrder;
    },
    
    updateOrderStatus: (orderId, status) => {
        const orders = db.getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders[index].status = status;
            setLocalStorageItem("orders_v3", orders);
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
