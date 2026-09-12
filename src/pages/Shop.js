import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { WhatsAppIcon } from '../components/WhatsAppIcon.js';
import { WHATSAPP_DISPLAY, getSupportWhatsAppUrl } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const Shop = () => {
    const { products } = useContext(AppContext);
    
    // Filter & Sort States
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [priceTrigger, setPriceTrigger] = useState({ min: 0, max: 99999 });
    const [sortBy, setSortBy] = useState("default");
    const [searchVal, setSearchVal] = useState("");
    const [visibleCount, setVisibleCount] = useState(24);

    // Listen to changes in url parameters (for navbar categories & search redirects)
    useEffect(() => {
        window.scrollTo(0, 0);
        setVisibleCount(24);
        
        const parseUrlParams = () => {
            const hash = window.location.hash || "";
            const paramString = hash.includes("?") ? hash.split("?")[1] : "";
            const urlParams = new URLSearchParams(paramString);
            
            const cat = urlParams.get("category");
            if (cat) {
                setSelectedCategory(cat.toLowerCase());
            } else {
                setSelectedCategory("all");
            }

            const search = urlParams.get("search");
            if (search) {
                setSearchVal(search);
            } else {
                setSearchVal("");
            }
        };

        parseUrlParams();
        window.addEventListener("hashchange", parseUrlParams);
        return () => window.removeEventListener("hashchange", parseUrlParams);
    }, []);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    // Reset all filters helper
    const handleClearAll = () => {
        setSelectedCategory("all");
        setMinPrice("");
        setMaxPrice("");
        setPriceTrigger({ min: 0, max: 99999 });
        setSortBy("default");
        setSearchVal("");
        setVisibleCount(24);
        window.location.hash = "#/shop";
    };

    // Trigger price filter update
    const handlePriceFilterSubmit = (e) => {
        e.preventDefault();
        const min = minPrice === "" ? 0 : parseFloat(minPrice);
        const max = maxPrice === "" ? 99999 : parseFloat(maxPrice);
        setPriceTrigger({ min, max });
        setVisibleCount(24);
    };

    // Filter Logic
    let filteredProducts = products.filter(product => {
        // Category Filter
        if (selectedCategory !== "all" && product.category !== selectedCategory) {
            return false;
        }
        
        // Price Filter
        if (product.price < priceTrigger.min || product.price > priceTrigger.max) {
            return false;
        }

        // Live Search Filter
        if (searchVal.trim() !== "") {
            const query = searchVal.toLowerCase();
            const matchesName = product.name.toLowerCase().includes(query);
            const matchesDesc = (product.description || "").toLowerCase().includes(query);
            const matchesCat = product.category.toLowerCase().includes(query);
            if (!matchesName && !matchesDesc && !matchesCat) {
                return false;
            }
        }

        return true;
    });

    // Sort Logic
    if (sortBy === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "discount") {
        filteredProducts.sort((a, b) => {
            const discA = a.comparePrice - a.price;
            const discB = b.comparePrice - b.price;
            return discB - discA;
        });
    }

    const displayedProducts = filteredProducts.slice(0, visibleCount);

    // Category labels definition - 100% jewelry & streetwear accessories
    const categoryDefs = [
        { id: "all", label: "All Drops" },
        { id: "rings", label: "Rings" },
        { id: "chains", label: "Chains & Necklaces" },
        { id: "bracelets", label: "Bracelets & Cuffs" },
        { id: "combos", label: "Combos & Sets" },
        { id: "limited-edition", label: "Limited Edition" },
        { id: "belts", label: "Belts" },
        { id: "wallets", label: "Wallets" }
    ];

    const getCategoryCount = (catId) => {
        if (catId === "all") return products.length;
        return products.filter(p => (p.category || "").toLowerCase() === catId.toLowerCase()).length;
    };

    return html`
        <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px;">
            <div class="section-header" style="margin-bottom: 30px; text-align: left;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span class="section-subtitle" style="margin-bottom: 0;">ACCESSIFY OFFICIAL CATALOGUE</span>
                    <span class="whatsapp-badge" style="font-size: 0.7rem; padding: 2px 8px;">
                        <${WhatsAppIcon} size=${12} color="#25D366" />
                        <span>Instant WhatsApp Orders</span>
                    </span>
                </div>
                <h1 class="section-title">${products.length}+ STREETWEAR ACCESSORIES</h1>
                ${searchVal && html`
                    <p style="color: var(--text-secondary); margin-top: 10px; font-size: 0.9rem;">
                        Showing search matches for: <strong class="chrome-text">"${searchVal}"</strong> 
                        <span style="cursor: pointer; margin-left: 10px; text-decoration: underline; color: #25D366;" onClick=${handleClearAll}>Clear Search</span>
                    </p>
                `}
            </div>

            <!-- Horizontal Category Chips (Quick Select) -->
            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 16px; margin-bottom: 24px; -webkit-overflow-scrolling: touch;">
                ${categoryDefs.map(cat => html`
                    <button 
                        class="btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}"
                        style="padding: 8px 16px; font-size: 0.75rem; white-space: nowrap; border-radius: 20px; text-transform: none; font-weight: 600;"
                        onClick=${() => { 
                            setSelectedCategory(cat.id); 
                            setVisibleCount(24);
                            window.location.hash = cat.id === 'all' ? '#/shop' : `#/shop?category=${cat.id}`; 
                        }}
                        key=${cat.id}
                    >
                        ${cat.label} (${getCategoryCount(cat.id)})
                    </button>
                `)}
            </div>

            <!-- Sorting & Result Counters Header -->
            <div class="shop-main-controls" style="margin-bottom: 24px;">
                <div class="shop-results-count" style="font-weight: 600; font-size: 0.85rem;">
                    SHOWING ${Math.min(visibleCount, filteredProducts.length)} OF ${filteredProducts.length} ACCESSORIES
                </div>
                
                <div class="shop-sorting">
                    <select value=${sortBy} onChange=${(e) => setSortBy(e.target.value)} aria-label="Sort products">
                        <option value="default">RECOMMENDED DROPS</option>
                        <option value="price-low">PRICE: LOW TO HIGH</option>
                        <option value="price-high">PRICE: HIGH TO LOW</option>
                        <option value="discount">BIGGEST SAVINGS</option>
                        <option value="rating">HIGHEST RATED</option>
                    </select>
                </div>
            </div>

            <div class="shop-layout">
                <!-- Sidebar Filters -->
                <aside class="shop-sidebar">
                    <!-- Categories -->
                    <div class="filter-group">
                        <h3 class="filter-title">COLLECTIONS</h3>
                        <ul class="filter-list">
                            ${categoryDefs.map(cat => html`
                                <li 
                                    class="filter-item ${selectedCategory === cat.id ? 'active' : ''}" 
                                    onClick=${() => { 
                                        setSelectedCategory(cat.id); 
                                        setVisibleCount(24);
                                        window.location.hash = cat.id === 'all' ? '#/shop' : `#/shop?category=${cat.id}`; 
                                    }}
                                    key=${cat.id}
                                >
                                    <span style="font-size: 0.8rem; letter-spacing: 0.02em;">${cat.label}</span>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">(${getCategoryCount(cat.id)})</span>
                                </li>
                            `)}
                        </ul>
                    </div>

                    <!-- Price Filter -->
                    <div class="filter-group">
                        <h3 class="filter-title">PRICE RANGE (₹)</h3>
                        <form onSubmit=${handlePriceFilterSubmit}>
                            <div class="price-range-inputs">
                                <input 
                                    type="number" 
                                    class="price-input" 
                                    placeholder="MIN ₹" 
                                    value=${minPrice} 
                                    onInput=${(e) => setMinPrice(e.target.value)} 
                                />
                                <span style="color: var(--text-muted);">—</span>
                                <input 
                                    type="number" 
                                    class="price-input" 
                                    placeholder="MAX ₹" 
                                    value=${maxPrice} 
                                    onInput=${(e) => setMaxPrice(e.target.value)} 
                                />
                            </div>
                            <button type="submit" class="btn btn-secondary" style="width: 100%; margin-top: 16px; padding: 8px; font-size: 0.7rem;">
                                APPLY FILTER
                            </button>
                        </form>
                    </div>

                    <!-- WhatsApp Helpline Box -->
                    <div style="background: rgba(37, 211, 102, 0.08); border: 1px solid rgba(37, 211, 102, 0.25); border-radius: 6px; padding: 16px; margin-bottom: 24px; text-align: center;">
                        <div style="display: inline-flex; align-items: center; gap: 6px; color: #25D366; font-weight: 700; font-size: 0.85rem; margin-bottom: 8px;">
                            <${WhatsAppIcon} size=${18} color="#25D366" />
                            <span>Direct WhatsApp Shop</span>
                        </div>
                        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
                            Need help sizing or want to place custom bulk order?
                        </p>
                        <a 
                            href=${getSupportWhatsAppUrl()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="btn-whatsapp btn-whatsapp-sm" 
                            style="width: 100%;"
                        >
                            Chat on WhatsApp
                        </a>
                    </div>

                    <!-- Reset Options -->
                    <button class="btn btn-secondary" onClick=${handleClearAll} style="width: 100%; font-size: 0.75rem;">
                        RESET ALL FILTERS
                    </button>
                </aside>

                <!-- Grid Catalog -->
                <main>
                    ${filteredProducts.length === 0 ? html`
                        <div style="text-align: center; padding: 100px 0; border: 1px solid var(--border-color); background: var(--bg-secondary);">
                            <i data-lucide="help-circle" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 20px;"></i>
                            <h3 style="font-size: 1.2rem; margin-bottom: 12px;">NO ACCESSORIES MATCH</h3>
                            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px;">Try resetting your filters or price range to explore all accessories.</p>
                            <button class="btn btn-primary" onClick=${handleClearAll}>SHOW ALL ${products.length} PRODUCTS</button>
                        </div>
                    ` : html`
                        <div>
                            <div class="products-grid">
                                ${displayedProducts.map(product => html`
                                    <${ProductCard} key=${product.id} product=${product} />
                                `)}
                            </div>

                            <!-- Load More Button -->
                            ${visibleCount < filteredProducts.length && html`
                                <div style="text-align: center; margin-top: 50px;">
                                    <button 
                                        class="btn btn-secondary" 
                                        style="padding: 14px 36px; font-size: 0.85rem;"
                                        onClick=${() => setVisibleCount(prev => prev + 24)}
                                    >
                                        LOAD MORE PRODUCTS (${displayedProducts.length} of ${filteredProducts.length})
                                    </button>
                                </div>
                            `}
                        </div>
                    `}
                </main>
            </div>
        </div>
    `;
};
