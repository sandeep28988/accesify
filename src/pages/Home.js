import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { WhatsAppIcon } from '../components/WhatsAppIcon.js';
import { WHATSAPP_DISPLAY, getSupportWhatsAppUrl } from '../utils/whatsapp.js';
import { db } from '../services/db.js';

const html = htm.bind(h);

export const Home = () => {
    const { products } = useContext(AppContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [products]);

    // Categories with dynamic image thumbnails from actual products
    const categoriesList = db.getCategories();
    const categoryBubbles = categoriesList.map(cat => {
        const matchingProd = products.find(p => (p.category || "").toLowerCase() === cat.toLowerCase() && p.images && p.images[0]);
        const img = matchingProd ? matchingProd.images[0] : "https://cdn.zepio.io/blyo/branch_image/50b64328-0aad-46ad-beb2-3df2faf9aca7.webp";
        const count = products.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase()).length;
        return {
            name: cat,
            label: cat.replace(/-/g, " ").toUpperCase(),
            image: img,
            count
        };
    });

    // Grouping Products from the dataset
    const trendingProducts = products.filter(p => p.featured || p.newArrival).slice(0, 8);
    const ringsDrop = products.filter(p => (p.category || "").toLowerCase() === "rings").slice(0, 4);
    const chainsDrop = products.filter(p => (p.category || "").toLowerCase() === "chains").slice(0, 4);
    const braceletsDrop = products.filter(p => (p.category || "").toLowerCase() === "bracelets").slice(0, 4);

    return html`
        <div class="home-page anim-fade-in">
            <!-- Cinematic Hero Banner matching blyo.in / Accessify -->
            <section class="hero" style="position: relative; min-height: 75vh; display: flex; align-items: center;">
                <div class="hero-background">
                    <img 
                        src="https://cdn.zepio.io/blyo/branch_image/50b64328-0aad-46ad-beb2-3df2faf9aca7.webp" 
                        alt="ACCESSIFY Streetwear Banner" 
                        style="filter: brightness(0.4) contrast(1.1); object-fit: cover;"
                    />
                </div>
                <div class="hero-overlay" style="background: linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.85) 100%);"></div>
                <div class="container" style="position: relative; z-index: 2;">
                    <div class="hero-content" style="max-width: 680px;">
                        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                            <span class="whatsapp-badge">
                                <${WhatsAppIcon} size=${14} color="#25D366" />
                                <span>WhatsApp Orders: ${WHATSAPP_DISPLAY}</span>
                            </span>
                        </div>
                        <h1 class="hero-title" style="font-size: clamp(2.2rem, 5.5vw, 4rem); line-height: 1.05; letter-spacing: -0.03em;">
                            GET <br /> <span class="chrome-text">ACCESSIFIED</span>
                        </h1>
                        <p class="hero-description" style="font-size: 1rem; line-height: 1.6; color: var(--text-secondary); margin-top: 14px; margin-bottom: 28px;">
                            ${products.length}+ Streetwear & Gothic Y2K accessories: stainless steel rings, heavyweight cross chains, link bracelets, belts, wallets, and combos.
                        </p>
                        <div class="hero-actions" style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <a href="#/shop" class="btn btn-primary" style="padding: 13px 28px;">
                                EXPLORE SHOP
                            </a>
                            <a 
                                href=${getSupportWhatsAppUrl()} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="btn-whatsapp" 
                                style="padding: 13px 22px;"
                            >
                                <${WhatsAppIcon} size=${18} color="#ffffff" />
                                <span>Order on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Cosmora-Style Visual Circular Category Story Bubbles -->
            <section class="category-stories-section">
                <div class="container">
                    <div class="category-stories-wrapper">
                        <!-- All Products Bubble -->
                        <a href="#/shop" class="category-story-item">
                            <div class="category-story-circle all-circle">
                                <i data-lucide="sparkles" style="width: 24px; height: 24px; color: var(--color-whatsapp);"></i>
                            </div>
                            <span class="category-story-label">ALL (${products.length})</span>
                        </a>

                        ${categoryBubbles.map(bubble => html`
                            <a href=${`#/shop?category=${bubble.name}`} class="category-story-item">
                                <div class="category-story-circle">
                                    <img src=${bubble.image} alt=${bubble.label} loading="lazy" />
                                </div>
                                <span class="category-story-label">${bubble.label}</span>
                            </a>
                        `)}
                    </div>
                </div>
            </section>

            <!-- Trending / Best Sellers Grid -->
            <section class="section" style="padding-top: 40px;">
                <div class="container">
                    <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
                        <div>
                            <span style="font-size: 0.75rem; color: var(--color-whatsapp); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">TRENDING DROPS</span>
                            <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2rem); margin-top: 4px;">HOTTEST PICKS</h2>
                        </div>
                        <a href="#/shop" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px;">View All (${products.length}) →</a>
                    </div>

                    <div class="products-grid">
                        ${trendingProducts.map(product => html`
                            <${ProductCard} key=${product.id} product=${product} />
                        `)}
                    </div>
                </div>
            </section>

            <!-- Rings Section -->
            ${ringsDrop.length > 0 && html`
                <section class="section" style="background: var(--bg-secondary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
                            <div>
                                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">316L STAINLESS STEEL</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2rem); margin-top: 4px;">GOTHIC & Y2K RINGS</h2>
                            </div>
                            <a href="#/shop?category=rings" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px;">View All Rings →</a>
                        </div>

                        <div class="products-grid">
                            ${ringsDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- Chains Section -->
            ${chainsDrop.length > 0 && html`
                <section class="section">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
                            <div>
                                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">HEAVYWEIGHT INDUSTRIAL</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2rem); margin-top: 4px;">CHAINS & NECKLACES</h2>
                            </div>
                            <a href="#/shop?category=chains" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px;">View All Chains →</a>
                        </div>

                        <div class="products-grid">
                            ${chainsDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- Bracelets Section -->
            ${braceletsDrop.length > 0 && html`
                <section class="section" style="background: var(--bg-secondary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
                            <div>
                                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">ARM HARDWARE</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2rem); margin-top: 4px;">BRACELETS & CUFFS</h2>
                            </div>
                            <a href="#/shop?category=bracelets" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px;">View All Bracelets →</a>
                        </div>

                        <div class="products-grid">
                            ${braceletsDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- Features Trust Badges -->
            <section class="section" style="padding: 50px 0;">
                <div class="container">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; text-align: center;">
                        <div class="card" style="padding: 24px 16px;">
                            <div style="color: var(--color-whatsapp); margin-bottom: 12px;">
                                <${WhatsAppIcon} size=${28} color="#25D366" />
                            </div>
                            <h3 style="font-size: 0.95rem; text-transform: uppercase;">Direct WhatsApp Orders</h3>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px;">Order in 1 click with pre-filled product details to +91 7012400815.</p>
                        </div>

                        <div class="card" style="padding: 24px 16px;">
                            <i data-lucide="shield-check" style="width: 28px; height: 28px; color: var(--text-primary); margin-bottom: 12px;"></i>
                            <h3 style="font-size: 0.95rem; text-transform: uppercase;">316L Stainless Steel</h3>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px;">Waterproof, rust-resistant, hypoallergenic chrome jewelry.</p>
                        </div>

                        <div class="card" style="padding: 24px 16px;">
                            <i data-lucide="truck" style="width: 28px; height: 28px; color: var(--text-primary); margin-bottom: 12px;"></i>
                            <h3 style="font-size: 0.95rem; text-transform: uppercase;">Free Express Shipping</h3>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px;">Free delivery across India on all orders over ₹1,000.</p>
                        </div>

                        <div class="card" style="padding: 24px 16px;">
                            <i data-lucide="package" style="width: 28px; height: 28px; color: var(--text-primary); margin-bottom: 12px;"></i>
                            <h3 style="font-size: 0.95rem; text-transform: uppercase;">Tactical Packaging</h3>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px;">Signature matte black protective unboxing experience.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
};
