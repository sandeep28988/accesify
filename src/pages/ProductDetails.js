import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useState, useEffect, useRef } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { WhatsAppIcon } from '../components/WhatsAppIcon.js';
import { getProductWhatsAppUrl, WHATSAPP_DISPLAY } from '../utils/whatsapp.js';
import { db } from '../services/db.js';
import { PRODUCTS_205 } from '../data/products.js';

const html = htm.bind(h);

// Robust extraction of product ID from URL hash or currentRoute
export const extractProductId = (hashStr) => {
    const hash = hashStr || (typeof window !== "undefined" ? window.location.hash : "") || "";
    const cleanHash = hash.replace(/^#\/?/, "");
    const [pathPart, queryPart] = cleanHash.split("?");

    if (queryPart) {
        try {
            const params = new URLSearchParams(queryPart);
            const qId = params.get("id") || params.get("productId");
            if (qId) return decodeURIComponent(qId).trim();
        } catch (e) {}
    }

    const parts = pathPart.split("/").filter(Boolean);
    if ((parts[0] === "product" || parts[0] === "products") && parts[1]) {
        try {
            return decodeURIComponent(parts[1]).trim();
        } catch (e) {
            return parts[1].trim();
        }
    }
    return null;
};

// Robust multi-format product finder (supports id, original_id, slug, or name)
export const findProduct = (targetId, productList) => {
    if (!targetId) return null;
    const cleanId = String(targetId).trim().toLowerCase();
    const withoutAcc = cleanId.replace(/^acc_/, "");
    const list = Array.isArray(productList) && productList.length > 0 ? productList : PRODUCTS_205;

    // 1. Direct match on id (case-insensitive)
    let found = list.find(p => p.id && p.id.toLowerCase() === cleanId);
    if (found) return found;

    // 2. Match with/without acc_ prefix
    found = list.find(p => p.id && p.id.toLowerCase().replace(/^acc_/, "") === withoutAcc);
    if (found) return found;

    // 3. Match on original_id
    found = list.find(p => p.original_id && String(p.original_id).trim() === withoutAcc);
    if (found) return found;

    // 4. Match on slug
    found = list.find(p => p.slug && p.slug.toLowerCase() === cleanId);
    if (found) return found;

    // 5. Normalized name match
    found = list.find(p => {
        const normName = (p.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return normName === cleanId;
    });
    if (found) return found;

    // 6. Fallback into db helper or full catalog
    if (db.getProductById) {
        const fromDb = db.getProductById(targetId);
        if (fromDb) return fromDb;
    }
    if (list !== PRODUCTS_205) {
        return findProduct(targetId, PRODUCTS_205);
    }
    return null;
};

export const ProductDetails = () => {
    const { products, addToCart, toggleWishlist, wishlist, showToast, currentRoute } = useContext(AppContext);
    
    const targetId = extractProductId(currentRoute || (typeof window !== "undefined" ? window.location.hash : ""));
    const initialProduct = findProduct(targetId, products && products.length > 0 ? products : PRODUCTS_205);

    // Component States - synchronously resolved so page never flashes "PRODUCT NOT FOUND"
    const [product, setProduct] = useState(initialProduct);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [reviews, setReviews] = useState(() => {
        return initialProduct ? db.getReviews(initialProduct.id) : [];
    });
    
    // Add Review Form States
    const [reviewAuthor, setReviewAuthor] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");

    const mainImgRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const pId = extractProductId(currentRoute || window.location.hash);
        const found = findProduct(pId, products && products.length > 0 ? products : PRODUCTS_205);
        if (found) {
            setProduct(found);
            setActiveImageIndex(0);
            setReviews(db.getReviews(found.id));
        } else {
            setProduct(null);
        }
    }, [currentRoute, products]);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    if (!product) {
        return html`
            <div class="container" style="padding-top: 160px; padding-bottom: 100px; text-align: center;">
                <i data-lucide="alert-triangle" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h2>PRODUCT NOT FOUND</h2>
                <p style="color: var(--text-secondary); margin-top: 12px; margin-bottom: 30px;">The product details you are trying to view does not exist or has been removed.</p>
                <a href="#/shop" class="btn btn-primary">EXPLORE ALL ACCESSORIES</a>
            </div>
        `;
    }

    // Related Items
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    // Zoom Effect Handlers
    const handleMouseMove = (e) => {
        const img = mainImgRef.current;
        if (!img) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
        img.style.transform = "scale(1.8)";
    };

    const handleMouseLeave = () => {
        const img = mainImgRef.current;
        if (!img) return;
        img.style.transform = "scale(1)";
        img.style.transformOrigin = "center";
    };

    // WhatsApp Direct Order Handler
    const handleWhatsAppOrder = () => {
        const url = getProductWhatsAppUrl(product);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    // Submit Review Handler
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (reviewAuthor.trim() && reviewText.trim()) {
            const newRev = db.addReview({
                productId: product.id,
                author: reviewAuthor,
                rating: parseInt(reviewRating),
                text: reviewText
            });
            if (newRev) {
                setReviews(prev => [...prev, newRev]);
                setReviewAuthor("");
                setReviewText("");
                setReviewRating(5);
                showToast("Thank you for your review! Feedback published.");
            }
        }
    };

    const isWishlisted = wishlist.some(item => item.id === product.id);
    const hasDiscount = product.comparePrice > product.price;
    const discountPercent = hasDiscount 
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    return html`
        <div class="container anim-fade-in" style="padding-top: 36px; padding-bottom: 80px;">
            <!-- Breadcrumbs -->
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 30px; text-transform: uppercase; letter-spacing: 0.05em;">
                <a href="#/">Home</a> <span style="margin: 0 8px;">/</span> 
                <a href=${`#/shop?category=${product.category}`}>${product.category}</a> <span style="margin: 0 8px;">/</span> 
                <span class="chrome-text">${product.name}</span>
            </div>

            <!-- Product Showcase Details Grid -->
            <div class="product-detail-grid">
                <!-- Gallery Panel -->
                <div class="product-gallery">
                    <div 
                        class="product-main-img-container" 
                        onMouseMove=${handleMouseMove} 
                        onMouseLeave=${handleMouseLeave}
                    >
                        <img 
                            ref=${mainImgRef}
                            class="product-main-img" 
                            src=${product.images[activeImageIndex] || product.images[0]} 
                            alt=${product.name} 
                        />
                        ${hasDiscount && html`
                            <span class="product-card-badge sale" style="top: 16px; left: 16px; font-size: 0.75rem;">
                                -${discountPercent}% OFF
                            </span>
                        `}
                    </div>
                    
                    ${product.images.length > 1 && html`
                        <div class="product-thumbnails">
                            ${product.images.map((img, idx) => html`
                                <div 
                                    class="product-thumb ${activeImageIndex === idx ? 'active' : ''}" 
                                    onClick=${() => setActiveImageIndex(idx)}
                                    key=${idx}
                                >
                                    <img src=${img} alt="${product.name} view ${idx + 1}" />
                                </div>
                            `)}
                        </div>
                    `}
                </div>

                <!-- Info Details Panel -->
                <div class="product-info-panel">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px;">
                        <span class="product-card-category" style="margin-bottom: 0;">${product.category}</span>
                        <span class="whatsapp-badge">
                            <${WhatsAppIcon} size=${14} color="#25D366" />
                            <span>Verified WhatsApp Order</span>
                        </span>
                    </div>

                    <h1 class="product-detail-title">${product.name}</h1>
                    
                    <div class="product-detail-meta">
                        <div class="product-detail-rating">
                            ${Array.from({ length: 5 }).map((_, idx) => html`
                                <i 
                                    data-lucide="star" 
                                    style="width: 14px; height: 14px; fill: ${idx < Math.round(product.rating) ? 'currentColor' : 'none'};"
                                ></i>
                            `)}
                        </div>
                        <span>${product.rating.toFixed(1)} / 5.0</span>
                        <span>(${reviews.length} Customer Reviews)</span>
                        <span style="color: var(--text-muted);">•</span>
                        <span style="color: var(--text-muted); font-size: 0.75rem;">SKU: ${product.sku_code || product.id}</span>
                    </div>

                    <div class="product-detail-price-row">
                        <span class="product-detail-price" style="font-size: 2rem; font-weight: 800;">₹${product.price}</span>
                        ${hasDiscount && html`
                            <span class="product-detail-compare-price" style="font-size: 1.25rem; text-decoration: line-through; color: var(--text-muted); margin-left: 12px;">₹${product.comparePrice}</span>
                            <span style="margin-left: 10px; color: #25D366; font-size: 0.85rem; font-weight: 700;">Save ₹${product.comparePrice - product.price}</span>
                        `}
                    </div>

                    <!-- Stock indicator -->
                    <div style="margin-bottom: 24px;">
                        ${product.stock === 0 ? html`
                            <span class="status-badge cancelled" style="font-size: 0.8rem; padding: 6px 12px; font-weight: 700;">OUT OF STOCK</span>
                        ` : product.stock <= 5 ? html`
                            <span class="status-badge pending" style="font-size: 0.8rem; padding: 6px 12px; font-weight: 700;">LOW STOCK — ONLY ${product.stock} LEFT</span>
                        ` : html`
                            <span class="status-badge delivered" style="font-size: 0.8rem; padding: 6px 12px; font-weight: 700; background: rgba(37, 211, 102, 0.15); color: #25D366; border: 1px solid rgba(37, 211, 102, 0.3);">
                                ✓ IN STOCK — READY TO DISPATCH
                            </span>
                        `}
                    </div>

                    <p class="product-description-text">${product.description}</p>


                    <!-- WhatsApp Primary Ordering Action Block -->
                    <div style="margin-top: 32px; display: flex; flex-direction: column; gap: 12px;">
                        ${product.stock === 0 ? html`
                            <button class="btn btn-secondary" style="cursor: not-allowed; opacity: 0.6; width: 100%;" disabled>SOLD OUT</button>
                        ` : html`
                            <!-- Prominent WhatsApp Order Button -->
                            <button 
                                class="btn-whatsapp btn-whatsapp-lg" 
                                onClick=${handleWhatsAppOrder}
                                title="Order this product directly on WhatsApp: ${WHATSAPP_DISPLAY}"
                            >
                                <${WhatsAppIcon} size=${22} color="#ffffff" />
                                <span>Order through WhatsApp</span>
                            </button>

                            <div style="display: flex; gap: 12px;">
                                <button class="btn btn-secondary" style="flex: 1; padding: 14px;" onClick=${handleAddToCart}>
                                    + Add to Cart (Multi-order)
                                </button>
                                
                                <button 
                                    class="btn-icon ${isWishlisted ? 'active' : ''}" 
                                    onClick=${() => toggleWishlist(product)}
                                    style="width: 52px; height: 52px; flex-shrink: 0;"
                                    title="Add to Wishlist"
                                    aria-label="Add to Wishlist"
                                >
                                    <i data-lucide="heart" style="width: 20px; height: 20px; fill: ${isWishlisted ? 'currentColor' : 'none'};"></i>
                                </button>
                            </div>
                        `}
                        
                        <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 4px;">
                            🔒 Direct order processing with ACCESSIFY Team on WhatsApp (${WHATSAPP_DISPLAY})
                        </p>
                    </div>

                    <!-- Extra Features summary -->
                    <div style="border-top: 1px solid var(--border-color); margin-top: 30px; padding-top: 24px; display: flex; flex-direction: column; gap: 12px; font-size: 0.85rem; color: var(--text-secondary);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i data-lucide="truck" style="width: 16px; height: 16px; color: #25D366;"></i>
                            <span>Free shipping on all orders over ₹1,000 across India.</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i data-lucide="shield-check" style="width: 16px; height: 16px; color: #25D366;"></i>
                            <span>Hypoallergenic 316L Surgical Stainless Steel • Rust & Tarnish Resistant.</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i data-lucide="message-circle" style="width: 16px; height: 16px; color: #25D366;"></i>
                            <span>Instant order confirmation and package tracking via WhatsApp.</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer Reviews Section -->
            <section style="margin-top: 80px; border-top: 1px solid var(--border-color); padding-top: 60px;">
                <div class="section-header" style="text-align: left;">
                    <span class="section-subtitle">Verified Feedback</span>
                    <h2 class="section-title">CUSTOMER REVIEWS (${reviews.length})</h2>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
                    <!-- Reviews list -->
                    <div>
                        ${reviews.length === 0 ? html`
                            <p style="color: var(--text-secondary);">No reviews yet for this accessory. Be the first to leave feedback!</p>
                        ` : html`
                            <div style="display: flex; flex-direction: column; gap: 20px;">
                                ${reviews.map(rev => html`
                                    <div style="background: var(--bg-secondary); padding: 20px; border: 1px solid var(--border-color); border-radius: 4px;" key=${rev.id}>
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                            <span style="font-weight: 600; font-size: 0.9rem;">${rev.author}</span>
                                            <span style="color: var(--text-muted); font-size: 0.75rem;">${rev.date}</span>
                                        </div>
                                        <div style="display: flex; gap: 2px; margin-bottom: 10px;">
                                            ${Array.from({ length: 5 }).map((_, idx) => html`
                                                <i 
                                                    data-lucide="star" 
                                                    style="width: 12px; height: 12px; fill: ${idx < rev.rating ? 'currentColor' : 'none'}; color: ${idx < rev.rating ? '#eab308' : 'var(--text-muted)'};"
                                                ></i>
                                            `)}
                                        </div>
                                        <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5;">${rev.text}</p>
                                    </div>
                                `)}
                            </div>
                        `}
                    </div>

                    <!-- Leave a review form -->
                    <div style="background: var(--bg-secondary); padding: 30px; border: 1px solid var(--border-color); border-radius: 4px; height: fit-content;">
                        <h3 style="font-size: 1.1rem; margin-bottom: 20px;">WRITE A REVIEW</h3>
                        <form onSubmit=${handleReviewSubmit} style="display: flex; flex-direction: column; gap: 16px;">
                            <div>
                                <label style="display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">YOUR NAME</label>
                                <input 
                                    type="text" 
                                    required 
                                    class="price-input" 
                                    style="width: 100%;" 
                                    value=${reviewAuthor} 
                                    onInput=${(e) => setReviewAuthor(e.target.value)} 
                                    placeholder="e.g. Rahul S." 
                                />
                            </div>

                            <div>
                                <label style="display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">RATING</label>
                                <select 
                                    class="price-input" 
                                    style="width: 100%;" 
                                    value=${reviewRating} 
                                    onChange=${(e) => setReviewRating(e.target.value)}
                                >
                                    <option value="5">★★★★★ (5/5) Masterpiece</option>
                                    <option value="4">★★★★☆ (4/5) Great Quality</option>
                                    <option value="3">★★★☆☆ (3/5) Average</option>
                                    <option value="2">★★☆☆☆ (2/5) Below Expectation</option>
                                    <option value="1">★☆☆☆☆ (1/5) Poor</option>
                                </select>
                            </div>

                            <div>
                                <label style="display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">YOUR REVIEW</label>
                                <textarea 
                                    required 
                                    class="price-input" 
                                    style="width: 100%; height: 100px; resize: vertical;" 
                                    value=${reviewText} 
                                    onInput=${(e) => setReviewText(e.target.value)} 
                                    placeholder="Share your thoughts on build quality, design, and finish..."
                                ></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary" style="margin-top: 10px;">SUBMIT REVIEW</button>
                        </form>
                    </div>
                </div>
            </section>

            <!-- Related Products -->
            ${relatedProducts.length > 0 && html`
                <section style="margin-top: 80px; border-top: 1px solid var(--border-color); padding-top: 60px;">
                    <div class="section-header" style="text-align: left; margin-bottom: 40px;">
                        <span class="section-subtitle">You May Also Like</span>
                        <h2 class="section-title">MORE IN ${product.category.toUpperCase()}</h2>
                    </div>

                    <div class="products-grid">
                        ${relatedProducts.map(p => html`
                            <${ProductCard} key=${p.id} product=${p} />
                        `)}
                    </div>
                </section>
            `}

            <!-- Sticky Mobile Bottom Bar for 1-Tap WhatsApp Ordering -->
            <div class="mobile-sticky-order-bar">
                <div class="sticky-order-info">
                    <div style="display: flex; align-items: baseline; gap: 6px;">
                        <span class="sticky-order-price">₹${product.price}</span>
                        ${product.comparePrice > product.price && html`
                            <span class="sticky-order-compare">₹${product.comparePrice}</span>
                        `}
                    </div>
                    <span class="sticky-order-variant">${product.name}</span>
                </div>
                <button 
                    type="button" 
                    class="btn-whatsapp sticky-order-btn" 
                    onClick=${handleWhatsAppOrder}
                >
                    <${WhatsAppIcon} size=${18} color="#ffffff" />
                    <span>Order on WhatsApp</span>
                </button>
            </div>
        </div>
    `;
};
