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

    // Categories definition
    const categoriesList = db.getCategories();

    // Grouping Products for curated sections
    const trendingProducts = products.filter(p => p.featured || p.newArrival).slice(0, 8);
    const ringsDrop = products.filter(p => (p.category || "").toLowerCase() === "rings").slice(0, 4);
    const chainsDrop = products.filter(p => (p.category || "").toLowerCase() === "chains").slice(0, 4);
    const braceletsDrop = products.filter(p => (p.category || "").toLowerCase() === "bracelets").slice(0, 4);
    const combosDrop = products.filter(p => (p.category || "").toLowerCase() === "combos").slice(0, 4);

    return html`
        <div class="home-page anim-fade-in" style="background: #0B0E14; min-height: 100vh;">
            <!-- Hero Banner Matching Uploaded Screenshot -->
            <section class="hero" style="position: relative; min-height: 84vh; display: flex; align-items: center; overflow: hidden; background: #0B0E14;">
                <div class="hero-background" style="position: absolute; inset: 0; z-index: 1;">
                    <img 
                        src="https://cdn.zepio.io/blyo/branch_image/50b64328-0aad-46ad-beb2-3df2faf9aca7.webp" 
                        alt="ACCESSIFY Chrome Gothic Banner" 
                        style="width: 100%; height: 100%; object-fit: cover; object-position: center right; filter: brightness(0.68) contrast(1.15);"
                    />
                </div>
                
                <!-- Vignette and Dark Fade on Left Side -->
                <div class="hero-overlay" style="position: absolute; inset: 0; z-index: 2; background: linear-gradient(to right, rgba(11,14,20,0.95) 0%, rgba(11,14,20,0.72) 42%, rgba(11,14,20,0.2) 100%);"></div>
                
                <div class="container" style="position: relative; z-index: 3; width: 100%; padding-top: 30px; padding-bottom: 50px;">
                    <div class="hero-content" style="max-width: 580px;">
                        <!-- Glowing Badge: Y2K GOTHIC DROP -->
                        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 9999px; background: rgba(30, 58, 138, 0.35); border: 1px solid rgba(59, 130, 246, 0.55); color: #93c5fd; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 20px; backdrop-filter: blur(8px);">
                            <span>⚡ Y2K GOTHIC DROP</span>
                        </div>
                        
                        <!-- Heading: GET ACCESSIFIED -->
                        <h1 class="hero-title" style="font-family: var(--font-display); font-size: clamp(2.4rem, 5.5vw, 4.2rem); font-weight: 900; letter-spacing: -0.02em; line-height: 1.05; color: #ffffff; margin-bottom: 18px;">
                            GET ACCESSIFIED
                        </h1>
                        
                        <!-- Subtitle -->
                        <p class="hero-description" style="font-size: 1rem; line-height: 1.65; color: #94A3B8; max-width: 500px; margin-bottom: 30px;">
                            Budget-friendly, Gothic- and Y2K-inspired streetwear jewelry, 316L stainless steel chains, rings, belts, and pendants.
                        </p>
                        
                        <!-- CTA Button: Explore 205 Products -->
                        <div class="hero-actions" style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
                            <a 
                                href="#/shop" 
                                class="btn" 
                                style="background: #FFFDF5; color: #0F172A; border-radius: 9999px; padding: 13px 28px; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; box-shadow: 0 10px 28px rgba(0,0,0,0.5); transition: transform 0.15s, box-shadow 0.15s;"
                            >
                                <span>Explore ${products.length} Products</span>
                                <span style="font-size: 1rem;">→</span>
                            </a>

                            <a 
                                href=${getSupportWhatsAppUrl()} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="btn-whatsapp" 
                                style="border-radius: 9999px; padding: 12px 22px; font-size: 0.85rem;"
                            >
                                <${WhatsAppIcon} size=${18} color="#ffffff" />
                                <span>Order on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- MATCH STYLES WITH ACCESSIFY (Floating Promo Card Matching Screenshot) -->
            <section class="container" style="margin-top: 24px; margin-bottom: 40px; position: relative; z-index: 5;">
                <div style="background: #111622; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 280px;">
                        <div style="width: 64px; height: 64px; border-radius: 10px; overflow: hidden; background: #1c2436; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            <img 
                                src="https://cdn.zepio.io/blyo/product/2065ba5c-c2b5-48fa-bb64-c5a4dbb8a07c.webp" 
                                alt="Match Styles Spike Ring" 
                                style="width: 100%; height: 100%; object-fit: cover;" 
                            />
                        </div>
                        <div>
                            <h3 style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 800; letter-spacing: 0.04em; color: #ffffff; text-transform: uppercase;">
                                MATCH STYLES WITH ACCESSIFY
                            </h3>
                            <p style="font-size: 0.82rem; color: #94A3B8; margin-top: 4px; line-height: 1.4;">
                                Layered Cuban chains, barbed wire bracelets, cross pendants, and heavy-metal lifestyle rings engineered for everyday durability.
                            </p>
                        </div>
                    </div>
                    <div>
                        <a 
                            href="#/shop?category=combos" 
                            class="btn" 
                            style="background: #1c2436; color: #ffffff; border: 1px solid rgba(255,255,255,0.14); border-radius: 9999px; padding: 10px 22px; font-weight: 700; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; white-space: nowrap; transition: background 0.2s;"
                        >
                            <span>🔥</span> View Combos
                        </a>
                    </div>
                </div>
            </section>

            <!-- Quick Category Pill Filter Row -->
            <section class="container" style="margin-bottom: 36px;">
                <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; -webkit-overflow-scrolling: touch; scrollbar-width: none;">
                    <a href="#/shop" class="btn btn-primary" style="border-radius: 9999px; padding: 8px 18px; font-size: 0.78rem; font-weight: 700; white-space: nowrap;">
                        🔥 All Drops (${products.length})
                    </a>
                    <a href="#/shop?category=rings" class="btn btn-secondary" style="border-radius: 9999px; padding: 8px 18px; font-size: 0.78rem; font-weight: 600; white-space: nowrap;">
                        💍 Rings (${products.filter(p => (p.category || '').toLowerCase() === 'rings').length})
                    </a>
                    <a href="#/shop?category=chains" class="btn btn-secondary" style="border-radius: 9999px; padding: 8px 18px; font-size: 0.78rem; font-weight: 600; white-space: nowrap;">
                        ⛓️ Chains & Necklaces (${products.filter(p => (p.category || '').toLowerCase() === 'chains').length})
                    </a>
                    <a href="#/shop?category=bracelets" class="btn btn-secondary" style="border-radius: 9999px; padding: 8px 18px; font-size: 0.78rem; font-weight: 600; white-space: nowrap;">
                        📿 Bracelets & Cuffs (${products.filter(p => (p.category || '').toLowerCase() === 'bracelets').length})
                    </a>
                    <a href="#/shop?category=combos" class="btn btn-secondary" style="border-radius: 9999px; padding: 8px 18px; font-size: 0.78rem; font-weight: 600; white-space: nowrap;">
                        ⚡ Combos & Sets (${products.filter(p => (p.category || '').toLowerCase() === 'combos').length})
                    </a>
                    <a href="#/shop?category=limited-edition" class="btn btn-secondary" style="border-radius: 9999px; padding: 8px 18px; font-size: 0.78rem; font-weight: 600; white-space: nowrap;">
                        ✨ Limited Edition
                    </a>
                    <a href="#/shop?category=belts" class="btn btn-secondary" style="border-radius: 9999px; padding: 8px 18px; font-size: 0.78rem; font-weight: 600; white-space: nowrap;">
                        👜 Belts & Wallets
                    </a>
                </div>
            </section>

            <!-- Section 1: HOTTEST DROPS (Trending Best Sellers) -->
            <section class="section" style="padding-top: 20px; padding-bottom: 48px;">
                <div class="container">
                    <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px;">
                        <div>
                            <span style="font-size: 0.72rem; color: var(--color-whatsapp); font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">MOST WANTED</span>
                            <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.1rem); margin-top: 4px; color: #ffffff;">HOTTEST DROPS</h2>
                        </div>
                        <a href="#/shop" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px; border-radius: 9999px;">View All (${products.length}) →</a>
                    </div>

                    <div class="products-grid">
                        ${trendingProducts.map(product => html`
                            <${ProductCard} key=${product.id} product=${product} />
                        `)}
                    </div>
                </div>
            </section>

            <!-- Section 2: SIGNATURE RINGS -->
            ${ringsDrop.length > 0 && html`
                <section class="section" style="background: #0E131E; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); padding-top: 48px; padding-bottom: 48px;">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px;">
                            <div>
                                <span style="font-size: 0.72rem; color: #94A3B8; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">316L SURGICAL STEEL</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.1rem); margin-top: 4px; color: #ffffff;">SIGNATURE RINGS</h2>
                            </div>
                            <a href="#/shop?category=rings" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px; border-radius: 9999px;">Explore Rings →</a>
                        </div>

                        <div class="products-grid">
                            ${ringsDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- Section 3: CHAINS & NECKLACES -->
            ${chainsDrop.length > 0 && html`
                <section class="section" style="padding-top: 48px; padding-bottom: 48px;">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px;">
                            <div>
                                <span style="font-size: 0.72rem; color: #94A3B8; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">HEAVYWEIGHT HARDWARE</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.1rem); margin-top: 4px; color: #ffffff;">CHAINS & NECKLACES</h2>
                            </div>
                            <a href="#/shop?category=chains" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px; border-radius: 9999px;">Explore Chains →</a>
                        </div>

                        <div class="products-grid">
                            ${chainsDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- Section 4: BRACELETS & CUFFS -->
            ${braceletsDrop.length > 0 && html`
                <section class="section" style="background: #0E131E; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); padding-top: 48px; padding-bottom: 48px;">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px;">
                            <div>
                                <span style="font-size: 0.72rem; color: #94A3B8; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;">ARM HARDWARE</span>
                                <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 3.5vw, 2.1rem); margin-top: 4px; color: #ffffff;">BRACELETS & CUFFS</h2>
                            </div>
                            <a href="#/shop?category=bracelets" class="btn btn-secondary" style="font-size: 0.8rem; padding: 7px 16px; border-radius: 9999px;">Explore Bracelets →</a>
                        </div>

                        <div class="products-grid">
                            ${braceletsDrop.map(product => html`
                                <${ProductCard} key=${product.id} product=${product} />
                            `)}
                        </div>
                    </div>
                </section>
            `}

            <!-- WhatsApp Direct Ordering Banner -->
            <section class="section" style="padding: 70px 0; background: linear-gradient(135deg, rgba(37,211,102,0.12) 0%, rgba(11,14,20,0.98) 100%); border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08);">
                <div class="container" style="text-align: center; max-width: 680px;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 50%; background: #25D366; margin-bottom: 18px; box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);">
                        <${WhatsAppIcon} size=${32} color="#ffffff" />
                    </div>
                    <span style="font-size: 0.72rem; color: #25D366; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; display: block; margin-bottom: 6px;">EASY & INSTANT SHOPPING</span>
                    <h2 style="font-family: var(--font-display); font-size: clamp(1.5rem, 3.5vw, 2.2rem); margin-bottom: 14px; color: #ffffff;">ORDER DIRECTLY THROUGH WHATSAPP</h2>
                    <p style="color: #94A3B8; font-size: 0.95rem; line-height: 1.65; margin-bottom: 26px;">
                        Found something you like? Click "Order through WhatsApp" on any product or order your full cart at once. We verify availability, confirm delivery, and dispatch your package immediately!
                    </p>
                    <a 
                        href=${getSupportWhatsAppUrl()} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="btn-whatsapp btn-whatsapp-lg" 
                        style="max-width: 320px; margin: 0 auto; display: inline-flex; border-radius: 9999px; padding: 13px 26px;"
                    >
                        <${WhatsAppIcon} size=${20} color="#ffffff" />
                        <span>Chat on WhatsApp: ${WHATSAPP_DISPLAY}</span>
                    </a>
                </div>
            </section>

            <!-- WHY ACCESSIFY Trust 4-Grid -->
            <section class="section" style="padding: 50px 0;">
                <div class="container">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; text-align: center;">
                        <div class="card" style="padding: 24px 18px; border-radius: 12px; background: #111622; border: 1px solid rgba(255,255,255,0.06);">
                            <div style="color: #25D366; margin-bottom: 12px;">
                                <${WhatsAppIcon} size=${28} color="#25D366" />
                            </div>
                            <h3 style="font-size: 0.92rem; font-weight: 700; text-transform: uppercase; color: #fff;">Direct WhatsApp Orders</h3>
                            <p style="font-size: 0.8rem; color: #94A3B8; margin-top: 6px; line-height: 1.45;">
                                1-click ordering with automated details sent straight to our verified line at ${WHATSAPP_DISPLAY}.
                            </p>
                        </div>

                        <div class="card" style="padding: 24px 18px; border-radius: 12px; background: #111622; border: 1px solid rgba(255,255,255,0.06);">
                            <div style="color: #ffffff; margin-bottom: 12px;">
                                <i data-lucide="shield-check" style="width: 28px; height: 28px;"></i>
                            </div>
                            <h3 style="font-size: 0.92rem; font-weight: 700; text-transform: uppercase; color: #fff;">316L Stainless Steel</h3>
                            <p style="font-size: 0.8rem; color: #94A3B8; margin-top: 6px; line-height: 1.45;">
                                Waterproof, rust-resistant, hypoallergenic chrome jewelry that never fades or turns green.
                            </p>
                        </div>

                        <div class="card" style="padding: 24px 18px; border-radius: 12px; background: #111622; border: 1px solid rgba(255,255,255,0.06);">
                            <div style="color: #ffffff; margin-bottom: 12px;">
                                <i data-lucide="truck" style="width: 28px; height: 28px;"></i>
                            </div>
                            <h3 style="font-size: 0.92rem; font-weight: 700; text-transform: uppercase; color: #fff;">Free Express Shipping</h3>
                            <p style="font-size: 0.8rem; color: #94A3B8; margin-top: 6px; line-height: 1.45;">
                                Fast tracked delivery across Kerala, Kochi, and all pin codes in India on orders over ₹1,000.
                            </p>
                        </div>

                        <div class="card" style="padding: 24px 18px; border-radius: 12px; background: #111622; border: 1px solid rgba(255,255,255,0.06);">
                            <div style="color: #ffffff; margin-bottom: 12px;">
                                <i data-lucide="package" style="width: 28px; height: 28px;"></i>
                            </div>
                            <h3 style="font-size: 0.92rem; font-weight: 700; text-transform: uppercase; color: #fff;">Tactical Packaging</h3>
                            <p style="font-size: 0.8rem; color: #94A3B8; margin-top: 6px; line-height: 1.45;">
                                Signature matte black protective packaging and unboxing experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
};
