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

    const totalCartAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return html`
        <div>
            <!-- Electric Blue Announcement Bar Matching Screenshot -->
            <div class="top-announcement-bar" style="background: #0052FF; color: #ffffff; font-size: 0.75rem; padding: 6px 16px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; height: 32px; z-index: 101; position: relative;">
                <span style="background: #000000; color: #ffffff; font-size: 0.62rem; font-weight: 800; padding: 2px 8px; border-radius: 9999px; letter-spacing: 0.06em;">LIMITED DROP</span>
                <span style="font-weight: 600; display: flex; align-items: center; gap: 6px; font-size: 0.75rem; letter-spacing: 0.02em;">
                    <span>⚡</span>
                    <span>${products.length} Accessify Streetwear & Gothic Pieces • Express 2-Day Delivery</span>
                </span>
            </div>

            <header class="navbar ${isScrolled ? 'scrolled' : ''}" style="top: ${isScrolled ? '0' : '32px'}; background: #0B0E14; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <div class="container" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 72px;">
                    
                    <!-- Left Section: Mobile Toggle + Brand + Delivery Location -->
                    <div style="display: flex; align-items: center; gap: 16px; flex-shrink: 0;">
                        <!-- Mobile Menu Toggle Button -->
                        <button class="mobile-nav-toggle" onClick=${() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu" style="color: #ffffff;">
                            <i data-lucide=${mobileMenuOpen ? "x" : "menu"}></i>
                        </button>

                        <!-- Brand: BLYO ● ACCESSIFY -->
                        <a href="#/" class="nav-brand" style="display: flex; flex-direction: column; text-decoration: none;">
                            <span style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; letter-spacing: 0.04em; color: #ffffff; line-height: 1;">BLYO</span>
                            <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.62rem; font-weight: 800; color: #10B981; letter-spacing: 0.08em; margin-top: 3px;">
                                <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
                                ACCESSIFY
                            </span>
                        </a>

                        <!-- Delivery to Location Badge (Desktop/Tablet) -->
                        <div class="nav-location" style="display: flex; align-items: center; gap: 8px; padding-left: 14px; border-left: 1px solid rgba(255,255,255,0.08);">
                            <i data-lucide="map-pin" style="width: 16px; height: 16px; color: #10B981; flex-shrink: 0;"></i>
                            <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.2;">
                                <span style="font-size: 0.62rem; color: #94A3B8;">Delivery to</span>
                                <span style="font-size: 0.78rem; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                                    Kerala, Kochi (682001) <span style="font-size: 0.65rem; color: #94A3B8;">▾</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Center Section: Search Bar -->
                    <div class="nav-search-bar" style="flex: 1; max-width: 520px; position: relative;">
                        <form onSubmit=${handleSearchSubmit} style="position: relative; width: 100%; display: flex; align-items: center;">
                            <i data-lucide="search" style="position: absolute; left: 16px; width: 16px; height: 16px; color: #94A3B8; pointer-events: none;"></i>
                            <input 
                                type="text" 
                                placeholder="Search ${products.length} chains, rings, pendants, belts..."
                                value=${searchQuery}
                                onInput=${(e) => setSearchQuery(e.target.value)}
                                onFocus=${() => setSearchOpen(true)}
                                style="width: 100%; padding: 10px 18px 10px 42px; border-radius: 9999px; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12); color: #ffffff; font-size: 0.82rem; outline: none; transition: border-color 0.2s;"
                            />
                        </form>
                    </div>

                    <!-- Right Section: Wishlist + Green Cart Pill Button + WhatsApp -->
                    <div class="nav-actions" style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
                        <!-- Wishlist Link -->
                        <a href="#/wishlist" class="nav-action-link" style="display: flex; align-items: center; gap: 6px; color: #ffffff; text-decoration: none; font-size: 0.82rem; font-weight: 600; padding: 6px 10px; border-radius: 8px;">
                            <i data-lucide="heart" style="width: 17px; height: 17px;"></i>
                            <span class="desktop-text">Wishlist</span>
                            ${wishlist.length > 0 && html`<span class="nav-badge" style="background: #ef4444; color: #fff;">${wishlist.length}</span>`}
                        </a>

                        <!-- Bright Green Cart Pill Button -->
                        <button 
                            type="button" 
                            class="nav-cart-pill-btn" 
                            onClick=${() => setCartOpen(true)}
                            style="display: flex; align-items: center; gap: 8px; background: #10B981; color: #000000; border: none; border-radius: 9999px; padding: 8px 16px; font-weight: 800; font-size: 0.82rem; cursor: pointer; transition: transform 0.15s; white-space: nowrap;"
                        >
                            <i data-lucide="shopping-cart" style="width: 16px; height: 16px; stroke-width: 2.5;"></i>
                            <span>Cart</span>
                            <span style="background: rgba(0,0,0,0.14); padding: 1px 7px; border-radius: 10px; font-size: 0.75rem; font-weight: 800;">
                                ₹${totalCartAmount}
                            </span>
                        </button>

                        <!-- WhatsApp Helpline Icon -->
                        <a 
                            href=${getSupportWhatsAppUrl()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="nav-action-btn desktop-only" 
                            title="Chat with WhatsApp Support"
                            style="color: #25D366;"
                        >
                            <${WhatsAppIcon} size=${18} color="#25D366" />
                        </a>

                        <!-- Admin Panel Key -->
                        <a href="#/admin" class="nav-action-btn" title="Admin Dashboard" style="color: var(--text-muted); opacity: 0.6;">
                            <i data-lucide="sliders" style="width: 16px; height: 16px;"></i>
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
