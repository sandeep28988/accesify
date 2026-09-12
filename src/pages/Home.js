import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { WhatsAppIcon } from '../components/WhatsAppIcon.js';
import { WHATSAPP_DISPLAY, getSupportWhatsAppUrl } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const Home = () => {
    const { products } = useContext(AppContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [products]);

    // Grouping Products from the 205 dataset
    const trendingProducts = products.filter(p => p.featured).slice(0, 8);
    const ringsDrop = products.filter(p => p.category === "rings").slice(0, 4);
    const chainsDrop = products.filter(p => p.category === "chains").slice(0, 4);
    const braceletsDrop = products.filter(p => p.category === "bracelets").slice(0, 4);

    return html`
        <div class="home-page anim-fade-in">
            <!-- Cinematic Hero Banner matching blyo.in / Accessify -->
            <section class="hero" style="position: relative; min-height: 85vh; display: flex; align-items: center;">
                <div class="hero-background">
                    <img 
                        src="https://cdn.zepio.io/blyo/branch_image/50b64328-0aad-46ad-beb2-3df2faf9aca7.webp" 
                        alt="ACCESSIFY Streetwear Banner" 
                        style="filter: brightness(0.4) contrast(1.1); object-fit: cover;"
                    />
                </div>
                <div class="hero-overlay" style="background: linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.85) 100%);"></div>
                <div class="container" style="position: relative; z-index: 2;">
                    <div class="hero-content" style="max-width: 680px;">
                        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                            <span class="whatsapp-badge">
                                <${WhatsAppIcon} size=${14} color="#25D366" />
                                <span>WhatsApp Direct Orders: ${WHATSAPP_DISPLAY}</span>
                            </span>
                        </div>
                        <h1 class="hero-title" style="font-size: clamp(2.5rem, 6vw, 4.2rem); line-height: 1.05; letter-spacing: -0.03em;">
                            GET <br /> <span class="chrome-text">ACCESSIFIED</span>
                        </h1>
                        <p class="hero-description" style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); margin-top: 18px; margin-bottom: 32px;">
                            Explore 205 Gothic and Y2K streetwear accessories: 316L stainless steel rings, heavyweight cross chains, link bracelets, belts, wallets, and lifestyle fragrances.
                        </p>
                        <div class="hero-actions" style="display: flex; gap: 14px; flex-wrap: wrap;">
                            <a href="#/shop" class="btn btn-primary" style="padding: 14px 32px;">
                                EXPLORE 205 PRODUCTS
                            </a>
                            <a 
                                href=${getSupportWhatsAppUrl()} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="btn-whatsapp" 
                                style="padding: 14px 24px;"
                            >
                                <${WhatsAppIcon} size=${20} color="#ffffff" />
                                <span>Order on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Quick Category Pill Selector -->
            <section style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); padding: 24px 0;">
                <div class="container">
                    <div style="display: flex; gap: 12px; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; justify-content: flex-start;">
                        <a href="#/shop" class="btn btn-secondary" style="padding: 8px 18px; font-size: 0.8rem; border-radius: 20px; white-space: nowrap;">
                            🔥 All Products (205)
                        </a>
                        <a href="#/shop?category=rings" class="btn btn-secondary" style="padding: 8px 18px; font-size: 0.8rem; border-radius: 20px; white-space: nowrap;">
                            💍 Rings (88)
                        </a>
                        <a href="#/shop?category=chains" class="btn btn-secondary" style="padding: 8px 18px; font-size: 0.8rem; border-radius: 20px; white-space: nowrap;">
                            ⛓️ Chains & Necklaces (50)
                        </a>
                        <a href="#/shop?category=bracelets" class="btn btn-secondary" style="padding: 8px 18px; font-size: 0.8rem; border-radius: 20px; white-space: nowrap;">
                            📿 Bracelets (21)
                        </a>
                        <a href="#/shop?category=combos" class="btn btn-secondary" style="padding: 8px 18px; font-size: 0.8rem; border-radius: 20px; white-space: nowrap;">
                            ⚡ Combos & Sets (16)
                        </a>
                        <a href="#/shop?category=fragrances" class="btn btn-secondary" style="padding: 8px 18px; font-size: 0.8rem; border-radius: 20px; white-space: nowrap;">
                            💨 Fragrances (13)
                        </a>
                    </div>
                </div>
            </section>

            <!-- Featured Collections Cards -->
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <span class="section-subtitle">GOTHIC & Y2K SELECTION</span>
                        <h2 class="section-title">TOP CATEGORIES</h2>
                    </div>

                    <div class="collections-grid">
                        <div class="collection-card">
                            <img src="https://cdn.zepio.io/blyo/product/ebbe65b3-b81a-448b-a644-09c752b39a3b.webp" alt="Belts & Wallets" />
                            <div class="collection-content">
                                <h3 class="collection-title">Belts & Wallets</h3>
                                <a href="#/shop?category=belts" class="collection-link">DISCOVER DROP</a>
                            </div>
                        </div>

                        <div class="collection-card">
                            <img src="https://cdn.zepio.io/blyo/product/6e22f085-79e1-455b-866a-b2866657c919.webp" alt="Chains Collection" />
                            <div class="collection-content">
                                <h3 class="collection-title">Cross & Curb Chains</h3>
                                <a href="#/shop?category=chains" class="collection-link">DISCOVER DROP</a>
                            </div>
                        </div>

                        <div class="collection-card">
                            <img src="https://cdn.zepio.io/blyo/product/2065ba5c-c2b5-48fa-bb64-c5a4dbb8a07c.webp" alt="Gothic Rings Collection" />
                            <div class="collection-content">
                                <h3 class="collection-title">Stainless Rings</h3>
                                <a href="#/shop?category=rings" class="collection-link">DISCOVER DROP</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Trending 205 Drops -->
            <section class="section" style="background-color: var(--bg-secondary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                <div class="container">
                    <div class="section-header">
                        <span class="section-subtitle">Most Wanted</span>
                        <h2 class="section-title">HOTTEST DROPS</h2>
                    </div>

                    <div class="products-grid">
                        ${trendingProducts.map(p => html`
                            <${ProductCard} key=${p.id} product=${p} />
                        `)}
                    </div>
                    
                    <div style="text-align: center; margin-top: 50px;">
                        <a href="#/shop" class="btn btn-secondary" style="padding: 14px 36px;">
                            VIEW ALL 205 ACCESSORIES
                        </a>
                    </div>
                </div>
            </section>

            <!-- Rings Showcase -->
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <span class="section-subtitle">Stainless Steel Collection</span>
                        <h2 class="section-title">SIGNATURE RINGS</h2>
                    </div>

                    <div class="products-grid">
                        ${ringsDrop.map(p => html`
                            <${ProductCard} key=${p.id} product=${p} />
                        `)}
                    </div>

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="#/shop?category=rings" class="btn btn-secondary">VIEW ALL 88 RINGS</a>
                    </div>
                </div>
            </section>

            <!-- Chains Showcase -->
            <section class="section" style="background-color: var(--bg-secondary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                <div class="container">
                    <div class="section-header">
                        <span class="section-subtitle">Heavyweight Metal</span>
                        <h2 class="section-title">CHAINS & NECKLACES</h2>
                    </div>

                    <div class="products-grid">
                        ${chainsDrop.map(p => html`
                            <${ProductCard} key=${p.id} product=${p} />
                        `)}
                    </div>

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="#/shop?category=chains" class="btn btn-secondary">VIEW ALL 50 CHAINS</a>
                    </div>
                </div>
            </section>

            <!-- WhatsApp Direct Order Banner -->
            <section class="section" style="padding: 100px 0; background: linear-gradient(135deg, rgba(37,211,102,0.15) 0%, rgba(10,10,10,0.95) 100%); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                <div class="container" style="text-align: center; max-width: 720px;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: #25D366; margin-bottom: 20px;">
                        <${WhatsAppIcon} size=${36} color="#ffffff" />
                    </div>
                    <span class="section-subtitle" style="color: #25D366;">EASY & INSTANT SHOPPING</span>
                    <h2 class="section-title" style="margin-bottom: 16px;">ORDER DIRECTLY THROUGH WHATSAPP</h2>
                    <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.8; margin-bottom: 30px;">
                        Found something you like? Click "Order through WhatsApp" on any product or order your full cart at once. We verify availability, confirm delivery, and dispatch your package immediately!
                    </p>
                    <a 
                        href=${getSupportWhatsAppUrl()} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="btn-whatsapp btn-whatsapp-lg" 
                        style="max-width: 320px; margin: 0 auto; display: inline-flex;"
                    >
                        <${WhatsAppIcon} size=${22} color="#ffffff" />
                        <span>Chat on WhatsApp: ${WHATSAPP_DISPLAY}</span>
                    </a>
                </div>
            </section>
        </div>
    `;
};
