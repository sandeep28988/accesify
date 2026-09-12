import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useState, useEffect, useRef } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { WhatsAppIcon } from './WhatsAppIcon.js';
import { WHATSAPP_DISPLAY, getSupportWhatsAppUrl } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const Navbar = () => {
    const { 
        cart, 
        wishlist, 
        user, 
        setCartOpen, 
        searchOpen, 
        setSearchOpen, 
        searchQuery, 
        setSearchQuery, 
        products, 
        currentRoute 
    } = useContext(AppContext);

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const searchInputRef = useRef(null);

    // Dynamic scroll tracking
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    // Handle search input focus
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [searchOpen]);

    // Live search results
    const filteredSearchProducts = searchQuery.trim() === ""
        ? []
        : products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 8);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchOpen(false);
            window.location.hash = `#/shop?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleSearchResultClick = (productId) => {
        setSearchOpen(false);
        setSearchQuery("");
        window.location.hash = `#/product/${productId}`;
    };

    return html`
        <div>
            <!-- Cosmora Continuous Announcement Ticker Bar -->
            <div class="marquee-ticker-container" style="background: #0d0d0d; border-bottom: 1px solid var(--border-color); font-size: 0.72rem; padding: 7px 0; height: 32px;">
                <div class="marquee-ticker-track">
                    <span class="marquee-ticker-item">⚡ FREE EXPRESS SHIPPING ON ORDERS OVER ₹1,000</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">💧 100% WATERPROOF 316L SURGICAL STEEL</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item" style="color: #25D366; font-weight: 700;">📲 WHATSAPP ORDERS: ${WHATSAPP_DISPLAY}</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">🖤 TARNISH-FREE STREETWEAR JEWELRY</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">⚡ FREE EXPRESS SHIPPING ON ORDERS OVER ₹1,000</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">💧 100% WATERPROOF 316L SURGICAL STEEL</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item" style="color: #25D366; font-weight: 700;">📲 WHATSAPP ORDERS: ${WHATSAPP_DISPLAY}</span>
                    <span class="marquee-ticker-dot">•</span>
                    <span class="marquee-ticker-item">🖤 TARNISH-FREE STREETWEAR JEWELRY</span>
                    <span class="marquee-ticker-dot">•</span>
                </div>
            </div>

            <header class="navbar ${isScrolled ? 'scrolled' : ''}" style="top: ${isScrolled ? '0' : '32px'};">
                <div class="container">
                    <!-- Mobile Menu Button -->
                    <button class="mobile-nav-toggle" onClick=${() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                        <i data-lucide=${mobileMenuOpen ? "x" : "menu"}></i>
                    </button>

                    <!-- Brand Logo -->
                    <a href="#/" class="nav-brand" style="display: flex; align-items: center; gap: 8px;">
                        <span>ACCESSIFY</span>
                        <span style="font-size: 0.65rem; background: #25D366; color: #000; font-weight: 800; padding: 2px 6px; border-radius: 3px; letter-spacing: 0.05em;">${products.length} DROPS</span>
                    </a>

                    <!-- Nav Links -->
                    <nav class="nav-links">
                        <a href="#/" class="nav-link ${currentRoute === '#/' ? 'active' : ''}">Home</a>
                        <a href="#/shop" class="nav-link ${currentRoute === '#/shop' || currentRoute.startsWith('#/shop?') ? 'active' : ''}">All Products (${products.length})</a>
                        <a href="#/shop?category=rings" class="nav-link ${currentRoute.includes('category=rings') ? 'active' : ''}">Rings</a>
                        <a href="#/shop?category=chains" class="nav-link ${currentRoute.includes('category=chains') ? 'active' : ''}">Chains</a>
                        <a href="#/shop?category=bracelets" class="nav-link ${currentRoute.includes('category=bracelets') ? 'active' : ''}">Bracelets</a>
                        <a href="#/shop?category=combos" class="nav-link ${currentRoute.includes('category=combos') ? 'active' : ''}">Combos</a>
                    </nav>

                    <!-- Nav Actions -->
                    <div class="nav-actions">
                        <button class="nav-action-btn" onClick=${() => setSearchOpen(true)} title="Search Products" aria-label="Search">
                            <i data-lucide="search" style="width: 18px; height: 18px;"></i>
                        </button>

                        <a 
                            href=${getSupportWhatsAppUrl()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="nav-action-btn" 
                            title="Chat with WhatsApp Support"
                            aria-label="WhatsApp Support"
                            style="color: #25D366;"
                        >
                            <${WhatsAppIcon} size=${18} color="#25D366" />
                        </a>
                        
                        <a href="#/wishlist" class="nav-action-btn" title="Wishlist" aria-label="Wishlist">
                            <i data-lucide="heart" style="width: 18px; height: 18px;"></i>
                            ${wishlist.length > 0 && html`<span class="nav-badge">${wishlist.length}</span>`}
                        </a>
                        
                        <button class="nav-action-btn" onClick=${() => setCartOpen(true)} title="Bag" aria-label="Shopping Bag">
                            <i data-lucide="shopping-bag" style="width: 18px; height: 18px;"></i>
                            ${cart.length > 0 && html`<span class="nav-badge">${cart.reduce((sum, item) => sum + item.quantity, 0)}</span>`}
                        </button>

                        <a href="#/admin" class="nav-action-btn" title="Admin Dashboard" aria-label="Admin Dashboard" style="color: var(--text-muted);">
                            <i data-lucide="sliders" style="width: 17px; height: 17px;"></i>
                        </a>
                    </div>
                </div>

                <!-- Mobile Navigation Drawer -->
                <div class="mobile-menu ${mobileMenuOpen ? 'open' : ''}">
                    <a href="#/" class="nav-link" onClick=${() => setMobileMenuOpen(false)}>Home</a>
                    <a href="#/shop" class="nav-link" onClick=${() => setMobileMenuOpen(false)}>All Products (${products.length})</a>
                    <a href="#/shop?category=rings" class="nav-link" onClick=${() => setMobileMenuOpen(false)}>Rings</a>
                    <a href="#/shop?category=chains" class="nav-link" onClick=${() => setMobileMenuOpen(false)}>Chains & Necklaces</a>
                    <a href="#/shop?category=bracelets" class="nav-link" onClick=${() => setMobileMenuOpen(false)}>Bracelets & Cuffs</a>
                    <a href="#/shop?category=combos" class="nav-link" onClick=${() => setMobileMenuOpen(false)}>Combos & Sets</a>
                    <a href="#/cart" class="nav-link" onClick=${() => setMobileMenuOpen(false)}>Shopping Bag (${cart.length})</a>
                    <a href="#/admin" class="nav-link" style="color: var(--text-muted); font-size: 0.8rem; margin-top: 10px;" onClick=${() => setMobileMenuOpen(false)}>⚙️ Admin Dashboard</a>
                    <a 
                        href=${getSupportWhatsAppUrl()} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="nav-link" 
                        style="color: #25D366; display: flex; align-items: center; gap: 8px; margin-top: 15px;"
                        onClick=${() => setMobileMenuOpen(false)}
                    >
                        <${WhatsAppIcon} size=${18} color="#25D366" />
                        <span>Order on WhatsApp: ${WHATSAPP_DISPLAY}</span>
                    </a>
                </div>

                <!-- Fullscreen Live Search Overlay -->
                <div class="search-overlay ${searchOpen ? 'open' : ''}" onClick=${() => setSearchOpen(false)}>
                    <div class="search-container" onClick=${(e) => e.stopPropagation()}>
                        <form onSubmit=${handleSearchSubmit} class="search-input-wrapper">
                            <i data-lucide="search" style="width: 24px; height: 24px; color: var(--text-secondary);"></i>
                            <input 
                                ref=${searchInputRef}
                                type="text" 
                                placeholder="Search across all 205 accessories (e.g. ring, chain, belt, combo)..." 
                                value=${searchQuery} 
                                onInput=${(e) => setSearchQuery(e.target.value)} 
                            />
                            <button type="button" class="search-close-btn" onClick=${() => { setSearchOpen(false); setSearchQuery(""); }}>
                                CLOSE
                            </button>
                        </form>

                        <!-- Live Results -->
                        ${filteredSearchProducts.length > 0 && html`
                            <div class="search-results">
                                ${filteredSearchProducts.map(p => html`
                                    <div class="search-result-item" key=${p.id} onClick=${() => handleSearchResultClick(p.id)} style="cursor: pointer;">
                                        <img class="search-result-img" src=${p.images[0]} alt=${p.name} />
                                        <div class="search-result-info">
                                            <h4>${p.name}</h4>
                                            <p>₹${p.price} — in ${p.category}</p>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        `}
                        
                        ${searchQuery.trim() !== "" && filteredSearchProducts.length === 0 && html`
                            <p style="margin-top: 40px; text-align: center; color: var(--text-secondary);">
                                No products found matching "${searchQuery}". Try searching for "cross", "skull", "chain", or "ring".
                            </p>
                        `}
                    </div>
                </div>
            </header>
        </div>
    `;
};
