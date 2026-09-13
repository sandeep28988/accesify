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
        setCartOpen, 
        searchOpen, 
        setSearchOpen, 
        searchQuery, 
        setSearchQuery, 
        products, 
        currentRoute 
    } = useContext(AppContext);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
    const searchInputRef = useRef(null);

    // Track hash changes for active nav indicator
    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || '#/');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
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

    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Navigation Category items exactly matching the reference mock
    const navCategories = [
        { label: "HOME", href: "#/" },
        { label: "SHOP ALL", href: "#/shop" },
        { label: "CHAINS", href: "#/shop?category=chains" },
        { label: "RINGS", href: "#/shop?category=rings" },
        { label: "EARRINGS", href: "#/shop?category=earrings" },
        { label: "BRACELET", href: "#/shop?category=bracelets" },
        { label: "Y2K GOTHIC NECKLACES", href: "#/shop?category=y2k-gothic-necklaces" },
        { label: "ICED OUT JEWELS", href: "#/shop?category=iced-out-jewels" },
        { label: "SLEEK CHAINS", href: "#/shop?category=sleek-chains" },
        { label: "LIMITED EDITION COMBOS", href: "#/shop?category=combos" }
    ];

    const isLinkActive = (href) => {
        if (href === "#/") {
            return currentHash === "#/" || currentHash === "" || currentHash === "#";
        }
        return currentHash.startsWith(href);
    };

    return html`
        <div>
            <!-- Top Announcement Bar Matching Reference Mockup -->
            <div class="top-announcement-bar">
                <span>✦ PREMIUM ACCESSORIES | ELEVATE YOUR STYLE ✦</span>
            </div>

            <!-- Header & Navigation Sticky Container -->
            <header class="navbar">
                <!-- Tier 1: Main Header Row -->
                <div class="container header-top-row">
                    <!-- Left: Search Box Pill Button -->
                    <button 
                        type="button"
                        class="header-search-box" 
                        onClick=${() => setSearchOpen(true)}
                        aria-label="Search accessories"
                    >
                        <i data-lucide="search" style="width: 15px; height: 15px; color: #6B7280; flex-shrink: 0;"></i>
                        <span class="header-search-text">Search for products...</span>
                    </button>

                    <!-- Center: Gothic Spiky Brand Logo Image -->
                    <a href="#/" class="header-brand-center" aria-label="Accessify Home">
                        <img 
                            src="assets/images/accessify-logo.png" 
                            alt="Accessify" 
                            class="header-brand-logo-img" 
                        />
                    </a>

                    <!-- Right Actions: Account + Cart Bag -->
                    <div class="header-actions-right">
                        <!-- Mobile Menu Toggle Button (Visible on Small Screens) -->
                        <button 
                            class="header-icon-btn mobile-nav-toggle" 
                            onClick=${() => setMobileMenuOpen(!mobileMenuOpen)} 
                            aria-label="Toggle menu"
                            style="display: none;"
                        >
                            <i data-lucide=${mobileMenuOpen ? "x" : "menu"} style="width: 20px; height: 20px;"></i>
                        </button>

                        <!-- Account / Admin Link -->
                        <a href="#/admin" class="header-icon-btn" title="Account / Admin Dashboard" aria-label="Account">
                            <i data-lucide="user" style="width: 20px; height: 20px; stroke-width: 1.8;"></i>
                        </a>

                        <!-- Shopping Bag Icon Button -->
                        <button 
                            type="button" 
                            class="header-icon-btn" 
                            onClick=${() => setCartOpen(true)}
                            aria-label="Shopping Bag"
                            title="Shopping Bag (${totalCartCount})"
                        >
                            <i data-lucide="shopping-bag" style="width: 20px; height: 20px; stroke-width: 1.8;"></i>
                            ${totalCartCount > 0 && html`
                                <span class="cart-count-badge">${totalCartCount}</span>
                            `}
                        </button>
                    </div>
                </div>

                <!-- Tier 2: Horizontal Category Links Bar -->
                <nav class="category-nav-bar" aria-label="Category Navigation">
                    <div class="container">
                        <ul class="category-nav-links">
                            ${navCategories.map((item) => html`
                                <li key=${item.label}>
                                    <a 
                                        href=${item.href} 
                                        class="category-nav-link ${isLinkActive(item.href) ? 'active' : ''}"
                                    >
                                        ${item.label}
                                    </a>
                                </li>
                            `)}
                        </ul>
                    </div>
                </nav>

                <!-- Mobile Navigation Drawer -->
                <div class="mobile-menu ${mobileMenuOpen ? 'open' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <span class="brand-subtext" style="font-size: 0.7rem;">✦ ACCESSIFY MENU</span>
                        <button 
                            style="background: transparent; border: none; font-size: 1.2rem; cursor: pointer;" 
                            onClick=${() => setMobileMenuOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    ${navCategories.map(cat => html`
                        <a 
                            href=${cat.href} 
                            class="nav-link" 
                            style="font-size: 0.95rem; font-weight: 600; padding: 10px 0; border-bottom: 1px solid #F3F4F6;"
                            onClick=${() => setMobileMenuOpen(false)}
                            key=${cat.label}
                        >
                            ${cat.label}
                        </a>
                    `)}

                    <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 14px;">
                        <a href="#/admin" class="nav-link" style="color: #6B7280; font-size: 0.85rem;" onClick=${() => setMobileMenuOpen(false)}>
                            ⚙️ Admin Dashboard
                        </a>
                        <a 
                            href=${getSupportWhatsAppUrl()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="btn-whatsapp btn-whatsapp-sm" 
                            style="width: 100%; border-radius: 9999px; text-decoration: none;"
                            onClick=${() => setMobileMenuOpen(false)}
                        >
                            <${WhatsAppIcon} size=${16} color="#ffffff" />
                            <span>WhatsApp: ${WHATSAPP_DISPLAY}</span>
                        </a>
                    </div>
                </div>

                <!-- Fullscreen Live Search Overlay -->
                <div class="search-overlay ${searchOpen ? 'open' : ''}" onClick=${() => setSearchOpen(false)}>
                    <div class="search-container" onClick=${(e) => e.stopPropagation()}>
                        <form onSubmit=${handleSearchSubmit} class="search-input-wrapper">
                            <i data-lucide="search" style="width: 24px; height: 24px; color: var(--text-secondary);"></i>
                            <input 
                                ref=${searchInputRef}
                                type="text" 
                                placeholder="Search accessories (e.g. cross chain, star ring, combo)..." 
                                value=${searchQuery} 
                                onInput=${(e) => setSearchQuery(e.target.value)} 
                            />
                            <button type="button" class="search-close-btn" onClick=${() => { setSearchOpen(false); setSearchQuery(""); }}>
                                CLOSE
                            </button>
                        </form>

                        <!-- Trending / Popular Quick Searches -->
                        ${searchQuery.trim() === "" && html`
                            <div class="search-quick-tags" style="margin-top: 24px;">
                                <div style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; color: #9CA3AF; text-transform: uppercase; margin-bottom: 12px;">
                                    TRENDING SEARCHES
                                </div>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    ${["Cross", "Rings", "Chains", "Bracelets", "Gothic", "Iced Out", "Combos"].map(tag => html`
                                        <button 
                                            type="button" 
                                            class="search-tag-chip"
                                            onClick=${() => setSearchQuery(tag)}
                                            key=${tag}
                                            style="background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 20px; padding: 6px 14px; font-size: 0.8rem; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
                                        >
                                            ${tag}
                                        </button>
                                    `)}
                                </div>
                            </div>
                        `}

                        <!-- Live Results -->
                        ${filteredSearchProducts.length > 0 && html`
                            <div class="search-results">
                                ${filteredSearchProducts.map(p => html`
                                    <div class="search-result-item" key=${p.id} onClick=${() => handleSearchResultClick(p.id)}>
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
                            <p style="margin-top: 40px; text-align: center; color: #6B7280; font-size: 0.95rem;">
                                No products found matching "${searchQuery}". Try searching for "cross", "ring", "chain", or "bracelet".
                            </p>
                        `}
                    </div>
                </div>
            </header>
        </div>
    `;
};
