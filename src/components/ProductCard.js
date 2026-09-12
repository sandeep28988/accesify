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
                <a href=${`#/product/${product.id}`} aria-label=${product.name}>
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
                
                <!-- Wishlist Toggle -->
                <button 
                    class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    onClick=${handleWishlistClick}
                    title="Add to Wishlist"
                    aria-label="Add to Wishlist"
                >
                    <i data-lucide="heart" style="width: 16px; height: 16px; fill: ${isWishlisted ? 'currentColor' : 'none'};"></i>
                </button>

                <!-- Quick Add to Cart Panel on Hover -->
                ${!isOutOfStock && html`
                    <div class="product-quick-add">
                        <button class="btn btn-secondary" style="width: 100%; padding: 7px 10px; font-size: 0.75rem;" onClick=${handleQuickAdd}>
                            + Add to Bag
                        </button>
                    </div>
                `}
            </div>

            <div class="product-card-info">
                <div>
                    <div class="product-card-category">${product.category}</div>
                    <a href=${`#/product/${product.id}`}>
                        <h3 class="product-card-title">${product.name}</h3>
                    </a>
                </div>
                
                <div class="product-card-price-container" style="margin-top: 10px; margin-bottom: 14px;">
                    <span class="product-card-price" style="font-weight: 700; font-size: 1.05rem;">₹${product.price}</span>
                    ${hasDiscount && html`<span class="product-card-compare-price" style="margin-left: 8px; text-decoration: line-through; color: var(--text-muted); font-size: 0.85rem;">₹${product.comparePrice}</span>`}
                </div>

                <!-- Primary WhatsApp Order Button -->
                <button 
                    class="btn-whatsapp btn-whatsapp-sm" 
                    style="width: 100%;" 
                    onClick=${handleWhatsAppOrder}
                    title="Order this product via WhatsApp"
                >
                    <${WhatsAppIcon} size=${16} color="#ffffff" />
                    <span>Order through WhatsApp</span>
                </button>
            </div>
        </div>
    `;
};
