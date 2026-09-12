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

    // Categories with dynamic image thumbnails from actual jewelry products
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

    // Cosmora-style curated product drops
    const bangersDrop = products.filter(p => p.featured || p.newArrival).slice(0, 8);
    const ringsDrop = products.filter(p => (p.category || "").toLowerCase() === "rings").slice(0, 4);
    const chainsDrop = products.filter(p => (p.category || "").toLowerCase() === "chains").slice(0, 4);
    const braceletsDrop = products.filter(p => (p.category || "").toLowerCase() === "bracelets").slice(0, 4);
    const combosDrop = products.filter(p => (p.category || "").toLowerCase() === "combos").slice(0, 4);

    return html`
        <div class="home-page anim-fade-in">
            <!-- Continuous Cosmora-Style Scrolling Announcement Marquee Ticker -->
            <div class="marquee-ticker-container">
                <div class="marquee-ticker-track">
                    <span class="marquee-ticker-item">⚡ FREE SHIPPING ON ORDERS OVER ₹1,000</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">💧 100% WATERPROOF 316L SURGICAL STEEL</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">📲 DIRECT WHATSAPP ORDERS: ${WHATSAPP_DISPLAY}</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">🖤 TARNISH-FREE STREETWEAR JEWELRY</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">⚡ FREE SHIPPING ON ORDERS OVER ₹1,000</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">💧 100% WATERPROOF 316L SURGICAL STEEL</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">📲 DIRECT WHATSAPP ORDERS: ${WHATSAPP_DISPLAY}</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">🖤 TARNISH-FREE STREETWEAR JEWELRY</span>
                    <span class="marquee-ticker-dot">•</span>
                </div>
            </div>

            <!-- Cinematic Streetwear Hero Banner -->
            <section class="hero" style="position: relative; min-height: 75vh; display: flex; align-items: center;">
                <div class="hero-background">
                    <img 
                        src="https://cdn.zepio.io/blyo/branch_image/50b64328-0aad-46ad-beb2-3df2faf9aca7.webp" 
                        alt="ACCESSIFY Streetwear Banner" 
                        style="filter: brightness(0.38) contrast(1.15); object-fit: cover;"
                    />
                </div>
                <div class="hero-overlay" style="background: linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.85) 100%);"></div>
                
                <div class="container" style="position: relative; z-index: 2;">
                    <div class="hero-content" style="max-width: 680px;">
                        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                            <span class="whatsapp-badge">
                                <${WhatsAppIcon} size=${14} color="#25D366" />
                                <span>WhatsApp Orders: ${WHATSAPP_DISPLAY}</span>
                            </span>
                        </div>
                        
                        <h1 class="hero-title" style="font-size: clamp(2.4rem, 6vw, 4.2rem); line-height: 1.05; letter-spacing: -0.03em;">
                            GET <br /> <span class="chrome-text">ACCESSIFIED</span>
                        </h1>
                        
                        <p class="hero-description" style="font-size: 1rem; line-height: 1.6; color: var(--text-secondary); margin-top: 14px; margin-bottom: 28px;">
                            ${products.length}+ Heavyweight hardware & gothic streetwear accessories crafted in surgical 316L stainless steel. Waterproof, rust-proof, zero tarnish.
                        </p>
                        
                        <div class="hero-actions" style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <a href="#/shop" class="btn btn-primary" style="padding: 13px 28px;">
                                EXPLORE SHOP (${products.length})
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
                                <i data-lucide="sparkles" style="width: 26px; height: 26px; color: var(--color-whatsapp);"></i>
                            </div>
                            <span class="category-story-label">ALL (${products.length})</span>
                        </a>

                        ${categoryBubbles.map(bubble => html`
                            <a href=${'#/shop?category=' + bubble.name} class="category-story-item">
                                <div class="category-story-circle">
                                    <img src=${bubble.image} alt=${bubble.label} loading="lazy" />
                                </div>
                                <span class="category-story-label">${bubble.label}</span>
                            </a>
                        `)}
                    </div>
                </div>
            </section>

            <!-- 1. CERTIFIED BANGERS (Trending Drops & Bestsellers) -->
            <section class="section" style="padding-top: 48px; padding-bottom: 48px;">
                <div class="container">
                    <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px;">
                        <div>
                            <span style="font-size: 0.72rem; color: var(--color-whatsapp); font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">TRENDING DROPS</span>
                            <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.1rem); margin-top: 4px;">CERTIFIED BANGERS</h2>
                        </div>
                        <a href="#/shop" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px;">View All (${products.length}) →</a>
                    </div>

                    <div class="products-grid">
                        ${bangersDrop.map(product => html`
                            <${ProductCard} key=${product.id} product=${product} />
                        `)}
                    </div>
                </div>
            </section>

            <!-- 2. RINGS THAT HIT DIFFERENT (316L Stainless Steel Rings) -->
            ${ringsDrop.length > 0 && html`
                <section class="section" style="background: var(--bg-secondary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding-top: 48px; padding-bottom: 48px;">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px;">
                            <div>
                                <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">316L SURGICAL STEEL</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.1rem); margin-top: 4px;">RINGS THAT HIT DIFFERENT</h2>
                            </div>
                            <a href="#/shop?category=rings" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px;">Explore Rings →</a>
                        </div>

                        <div class="products-grid">
                            ${ringsDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- 3. HEAVYWEIGHT HARDWARE (Chains & Pendants) -->
            ${chainsDrop.length > 0 && html`
                <section class="section" style="padding-top: 48px; padding-bottom: 48px;">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px;">
                            <div>
                                <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">GOTHIC & INDUSTRIAL HARDWARE</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.1rem); margin-top: 4px;">HEAVYWEIGHT HARDWARE</h2>
                            </div>
                            <a href="#/shop?category=chains" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px;">Explore Chains →</a>
                        </div>

                        <div class="products-grid">
                            ${chainsDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- 4. WRIST DRIP (Bracelets & Cuffs) -->
            ${braceletsDrop.length > 0 && html`
                <section class="section" style="background: var(--bg-secondary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding-top: 48px; padding-bottom: 48px;">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px;">
                            <div>
                                <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">ARM & WRIST ESSENTIALS</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.1rem); margin-top: 4px;">WRIST DRIP</h2>
                            </div>
                            <a href="#/shop?category=bracelets" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px;">Explore Bracelets →</a>
                        </div>

                        <div class="products-grid">
                            ${braceletsDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- 5. STACK & SAVE (Combos & Sets) -->
            ${combosDrop.length > 0 && html`
                <section class="section" style="padding-top: 48px; padding-bottom: 48px;">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px;">
                            <div>
                                <span style="font-size: 0.72rem; color: var(--color-whatsapp); font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">CURATED BUNDLES</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.1rem); margin-top: 4px;">STACK & SAVE</h2>
                            </div>
                            <a href="#/shop?category=combos" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px;">Explore Sets →</a>
                        </div>

                        <div class="products-grid">
                            ${combosDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- 6. WHY ACCESSIFY (Cosmora Value Proposition 4-Grid) -->
            <section class="section" style="padding: 56px 0; background: var(--bg-secondary); border-top: 1px solid var(--border-color);">
                <div class="container">
                    <div style="text-align: center; margin-bottom: 36px;">
                        <span style="font-size: 0.72rem; color: var(--color-whatsapp); font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">THE STANDARD</span>
                        <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.2rem); margin-top: 4px;">WHY ACCESSIFY?</h2>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; text-align: center;">
                        <div class="card" style="padding: 26px 18px; border-radius: 10px;">
                            <div style="color: var(--color-whatsapp); margin-bottom: 14px;">
                                <${WhatsAppIcon} size=${30} color="#25D366" />
                            </div>
                            <h3 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Direct WhatsApp Orders</h3>
                            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.5;">
                                1-click ordering with automated product & pricing details sent straight to our verified team at +91 7012400815.
                            </p>
                        </div>

                        <div class="card" style="padding: 26px 18px; border-radius: 10px;">
                            <div style="color: var(--text-primary); margin-bottom: 14px;">
                                <i data-lucide="shield-check" style="width: 30px; height: 30px;"></i>
                            </div>
                            <h3 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">316L Surgical Steel</h3>
                            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.5;">
                                Corrosion-resistant, hypoallergenic, and nickel-free chrome metal designed to endure daily abuse.
                            </p>
                        </div>

                        <div class="card" style="padding: 26px 18px; border-radius: 10px;">
                            <div style="color: var(--text-primary); margin-bottom: 14px;">
                                <i data-lucide="droplets" style="width: 30px; height: 30px;"></i>
                            </div>
                            <h3 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Water & Sweatproof</h3>
                            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.5;">
                                Zero green skin. Zero rusting. Wear your pieces in the gym, pool, ocean, or shower with total confidence.
                            </p>
                        </div>

                        <div class="card" style="padding: 26px 18px; border-radius: 10px;">
                            <div style="color: var(--text-primary); margin-bottom: 14px;">
                                <i data-lucide="truck" style="width: 30px; height: 30px;"></i>
                            </div>
                            <h3 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Free Express Shipping</h3>
                            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.5;">
                                Free tracked express shipping across all pin codes in India on orders over ₹1,000.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
};
