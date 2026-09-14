import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useEffect, useState } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { ProductCard } from '../components/ProductCard.js';

const html = htm.bind(h);

export const Home = () => {
    const { products } = useContext(AppContext);
    const [openFaq, setOpenFaq] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [products, openFaq]);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // 8 Categories matching reference mock with authentic jewelry thumbnails
    const categoryCards = [
        {
            title: "CHAINS",
            image: "https://cdn.zepio.io/blyo/product/b424f5d2-95f5-4860-8ff0-0c75ef914e0b.webp",
            link: "#/shop?category=chains"
        },
        {
            title: "RINGS",
            image: "assets/images/category-rings.jpg",
            link: "#/shop?category=rings"
        },
        {
            title: "EARRINGS",
            image: "https://cdn.zepio.io/blyo/product/ea03f2e5-be7b-47ee-9dba-d69fb10c91c3.webp",
            link: "#/shop?category=earrings"
        },
        {
            title: "BRACELET",
            image: "assets/images/category-bracelets.jpg",
            link: "#/shop?category=bracelets"
        },
        {
            title: "Y2K GOTHIC NECKLACES",
            image: "assets/images/category-gothic.jpg",
            link: "#/shop?category=y2k-gothic-necklaces"
        },
        {
            title: "ICED OUT JEWELS",
            image: "https://cdn.zepio.io/blyo/product/fb2eb3f3-d297-4bc4-be11-ed1d24b4ebd7.webp",
            link: "#/shop?category=iced-out-jewels"
        },
        {
            title: "SLEEK CHAINS",
            image: "assets/images/sleek-chains.jpg",
            link: "#/shop?category=sleek-chains"
        },
        {
            title: "LIMITED EDITION COMBOS",
            image: "assets/images/category-combos.jpg",
            link: "#/shop?category=combos"
        }
    ];

    // Select 6 authentic banger products for the Best Sellers row
    const bestSellers = products.length > 0
        ? [
            // Cross Pendant Chain
            products.find(p => p.name.toLowerCase().includes("cross") && p.category === "chains") || products[0],
            // Authentic Gothic Ring
            products.find(p => p.category === "rings" && (p.name.toLowerCase().includes("star") || p.name.toLowerCase().includes("viking") || p.name.toLowerCase().includes("ch"))) || products[1],
            // Gothic Earring
            products.find(p => p.category === "earrings") || products[2],
            // Streetwear Bracelet
            products.find(p => p.category === "bracelets") || products[3],
            // Y2K Gothic Necklace
            products.find(p => p.tags && p.tags.includes("y2k-gothic-necklaces") && p.id !== products[0]?.id) || products[4],
            // Iced Out Jewel
            products.find(p => p.tags && p.tags.includes("iced-out-jewels")) || products[5]
          ].filter(Boolean)
        : [];

    const faqQuestionsLeft = [
        {
            q: "How do I place an order?",
            a: "Browse our catalog, pick your favorite items, and click 'ORDER THROUGH WHATSAPP'. Your cart or product selection will automatically open in WhatsApp chat with our team, where we confirm your delivery address and send your order confirmation immediately."
        },
        {
            q: "What is the delivery time?",
            a: "All orders are securely packaged and dispatched within 24 to 48 hours. Express delivery across India typically takes 2 to 5 business days depending on your location."
        },
        {
            q: "Do you offer returns or exchanges?",
            a: "Yes! If your item arrives damaged, defective, or incorrect, send us a quick unboxing video on WhatsApp within 48 hours of delivery and we will arrange a replacement or refund immediately."
        }
    ];

    const faqQuestionsRight = [
        {
            q: "How can I track my order?",
            a: "As soon as your package is dispatched with our express courier partner (BlueDart, Delhivery, or Xpressbees), we share your live tracking link directly on WhatsApp and SMS."
        },
        {
            q: "Is my payment secure?",
            a: "100% secure. We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, Credit/Debit cards, and Cash on Delivery (COD) on eligible postal codes."
        },
        {
            q: "Do you ship internationally?",
            a: "Currently, Accessify ships across every state and union territory in India with express delivery. Worldwide international shipping is coming soon!"
        }
    ];

    return html`
        <div class="home-page anim-fade-in" style="background: #FFFFFF; min-height: 100vh;">
            
            <!-- 1. HERO BANNER SECTION MATCHING USER BRAND GRAPHIC -->
            <section class="cosmora-hero">
                <div class="container" style="position: relative;">
                    <a href="#/shop" class="cosmora-hero-banner" aria-label="Shop Beyond The Seen Collection">
                        <img 
                            class="cosmora-hero-banner-img" 
                            src="assets/images/hero-banner.jpg" 
                            alt="Accessify - Beyond The Seen | Streetwear & Gothic Jewelry" 
                        />
                    </a>
                </div>
            </section>

            <!-- 2. SHOP BY CATEGORY SECTION -->
            <section style="padding: 48px 0 32px 0;">
                <div class="container">
                    <!-- Section Header Row -->
                    <div class="section-header-row">
                        <h2 class="section-main-heading">SHOP BY CATEGORY</h2>
                        <a href="#/shop" class="section-view-all">
                            <span>View all</span>
                            <span style="font-size: 1rem;">→</span>
                        </a>
                    </div>

                    <!-- 8 Square Category Cards Grid -->
                    <div class="category-card-grid">
                        ${categoryCards.map((cat) => html`
                            <a href=${cat.link} class="category-square-card" key=${cat.title}>
                                <div class="category-img-box">
                                    <img src=${cat.image} alt=${cat.title} loading="lazy" />
                                </div>
                                <span class="category-label">${cat.title}</span>
                            </a>
                        `)}
                    </div>
                </div>
            </section>

            <!-- 3. BEST SELLERS SECTION -->
            <section style="padding: 32px 0 48px 0;">
                <div class="container">
                    <!-- Section Header Row -->
                    <div class="section-header-row">
                        <h2 class="section-main-heading">BEST SELLERS</h2>
                        <a href="#/shop" class="section-view-all">
                            <span>View all</span>
                            <span style="font-size: 1rem;">→</span>
                        </a>
                    </div>

                    <!-- 6-Product Cards Grid Matching Mockup -->
                    <div class="bestsellers-grid">
                        ${bestSellers.map((product) => html`
                            <${ProductCard} product=${product} key=${product.id} />
                        `)}
                    </div>
                </div>
            </section>

            <!-- 4. VALUE PROPOSITION / TRUST STRIP -->
            <section class="trust-strip">
                <div class="container">
                    <div class="trust-grid">
                        <!-- Item 1: Fast & Secure Delivery -->
                        <div class="trust-item">
                            <div class="trust-icon">
                                <i data-lucide="truck" style="width: 20px; height: 20px;"></i>
                            </div>
                            <div>
                                <div class="trust-title">FAST & SECURE DELIVERY</div>
                                <div class="trust-sub">Across India</div>
                            </div>
                        </div>

                        <!-- Item 2: Premium Quality -->
                        <div class="trust-item">
                            <div class="trust-icon">
                                <i data-lucide="shield-check" style="width: 20px; height: 20px;"></i>
                            </div>
                            <div>
                                <div class="trust-title">PREMIUM QUALITY</div>
                                <div class="trust-sub">Built to last</div>
                            </div>
                        </div>

                        <!-- Item 3: 24/7 Support -->
                        <div class="trust-item">
                            <div class="trust-icon">
                                <i data-lucide="headphones" style="width: 20px; height: 20px;"></i>
                            </div>
                            <div>
                                <div class="trust-title">24/7 SUPPORT</div>
                                <div class="trust-sub">We're here to help</div>
                            </div>
                        </div>

                        <!-- Item 4: Trusted by Thousands -->
                        <div class="trust-item">
                            <div class="trust-icon">
                                <i data-lucide="award" style="width: 20px; height: 20px;"></i>
                            </div>
                            <div>
                                <div class="trust-title">TRUSTED BY THOUSANDS</div>
                                <div class="trust-sub">Style. Quality. Always.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 5. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION -->
            <section class="faq-section">
                <div class="container">
                    <!-- Section Header Row -->
                    <div class="section-header-row">
                        <h2 class="section-main-heading">FREQUENTLY ASKED QUESTIONS</h2>
                        <a href="#/shop" class="section-view-all">
                            <span>View all</span>
                            <span style="font-size: 1rem;">→</span>
                        </a>
                    </div>

                    <!-- 2-Column Accordion Layout -->
                    <div class="faq-grid">
                        <!-- Column 1 -->
                        <div>
                            ${faqQuestionsLeft.map((faq, idx) => html`
                                <div class="faq-item" key=${faq.q}>
                                    <div class="faq-question" onClick=${() => toggleFaq(`l-${idx}`)}>
                                        <span>${faq.q}</span>
                                        <span class="faq-toggle-icon">${openFaq === `l-${idx}` ? '−' : '+'}</span>
                                    </div>
                                    ${openFaq === `l-${idx}` && html`
                                        <div class="faq-answer anim-fade-in">${faq.a}</div>
                                    `}
                                </div>
                            `)}
                        </div>

                        <!-- Column 2 -->
                        <div>
                            ${faqQuestionsRight.map((faq, idx) => html`
                                <div class="faq-item" key=${faq.q}>
                                    <div class="faq-question" onClick=${() => toggleFaq(`r-${idx}`)}>
                                        <span>${faq.q}</span>
                                        <span class="faq-toggle-icon">${openFaq === `r-${idx}` ? '−' : '+'}</span>
                                    </div>
                                    ${openFaq === `r-${idx}` && html`
                                        <div class="faq-answer anim-fade-in">${faq.a}</div>
                                    `}
                                </div>
                            `)}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    `;
};
