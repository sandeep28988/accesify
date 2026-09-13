import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { WhatsAppIcon } from './WhatsAppIcon.js';
import { getProductWhatsAppUrl } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const ProductCard = ({ product }) => {
    const { addToCart, toggleWishlist, wishlist } = useContext(AppContext);
    
    const isWishlisted = wishlist.some(item => item.id === product.id);
    const isOutOfStock = product.stock === 0;
    const hasDiscount = product.comparePrice > product.price;
    const discountPercent = hasDiscount 
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handleWhatsAppOrder = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = getProductWhatsAppUrl(product);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return html`
        <div class="product-card">
            <div class="product-image-container">
                <a href=${`#/product/${product.id}`} aria-label=${product.name} style="display: block; width: 100%; height: 100%;">
                    <img class="product-card-img" src=${product.images[0]} alt=${product.name} loading="lazy" />
                </a>
                
                <!-- Badges -->
                ${isOutOfStock 
                    ? html`<span class="product-card-badge out-of-stock">Sold Out</span>` 
                    : hasDiscount 
                        ? html`<span class="product-card-badge sale">-${discountPercent}%</span>` 
                        : product.newArrival 
                            ? html`<span class="product-card-badge">New</span>` 
                            : null
                }
                
                <!-- Wishlist Heart Toggle in Top-Right -->
                <button 
                    class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    onClick=${handleWishlistClick}
                    title="Add to Wishlist"
                    aria-label="Add to Wishlist"
                >
                    <i data-lucide="heart" style="width: 15px; height: 15px; fill: ${isWishlisted ? '#EF4444' : 'none'}; stroke: ${isWishlisted ? '#EF4444' : 'currentColor'};"></i>
                </button>
            </div>

            <div class="product-card-info">
                <div>
                    <a href=${`#/product/${product.id}`} style="text-decoration: none;">
                        <h3 class="product-card-title">${product.name}</h3>
                    </a>
                    <div class="product-card-category">${(product.category || "").toUpperCase()}</div>
                </div>
                
                <div class="product-card-price-container">
                    <span class="product-card-price">₹${product.price ? product.price.toLocaleString('en-IN') : product.price}</span>
                    ${product.comparePrice > product.price && html`
                        <span class="product-card-compare-price">MRP ₹${product.comparePrice.toLocaleString('en-IN')}</span>
                    `}
                </div>

                <!-- WhatsApp Order Button Matching Reference Mockup -->
                <button 
                    class="btn-whatsapp-outline" 
                    onClick=${handleWhatsAppOrder}
                    title="Order this product via WhatsApp"
                    aria-label="Order through WhatsApp"
                >
                    <${WhatsAppIcon} size=${15} color="#25D366" />
                    <span>ORDER THROUGH WHATSAPP</span>
                </button>
            </div>
        </div>
    `;
};
