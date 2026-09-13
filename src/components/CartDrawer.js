import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { WhatsAppIcon } from './WhatsAppIcon.js';
import { getCartWhatsAppUrl, WHATSAPP_DISPLAY } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const CartDrawer = () => {
    const { 
        cart, 
        cartOpen, 
        setCartOpen, 
        updateCartQuantity, 
        removeFromCart, 
        subtotal, 
        finalTotal 
    } = useContext(AppContext);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setCartOpen(false);
        };
        if (cartOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [cartOpen, setCartOpen]);

    const handleOrderCartThroughWhatsApp = () => {
        if (cart.length === 0) return;
        const total = finalTotal || subtotal;
        const url = getCartWhatsAppUrl(cart, total);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleViewCartClick = () => {
        setCartOpen(false);
        window.location.hash = "#/cart";
    };

    const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const displayTotal = finalTotal || subtotal;
    const freeDeliveryThreshold = 1000;
    const diffToFree = freeDeliveryThreshold - subtotal;
    const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

    return html`
        <div class="cart-drawer-overlay ${cartOpen ? 'open' : ''}" onClick=${() => setCartOpen(false)}>
            <div class="cart-drawer" onClick=${(e) => e.stopPropagation()}>
                <div class="cart-drawer-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i data-lucide="shopping-bag" style="width: 20px; height: 20px;"></i>
                        <h3 style="font-size: 1.1rem; font-weight: 700;">YOUR BAG (${totalItemCount})</h3>
                    </div>
                    <button class="cart-drawer-close" onClick=${() => setCartOpen(false)} aria-label="Close Bag">
                        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                    </button>
                </div>

                <!-- Free Shipping Progress Bar -->
                ${cart.length > 0 && html`
                    <div style="padding: 12px 20px; background: rgba(37, 211, 102, 0.08); border-bottom: 1px solid var(--border-color); font-size: 0.8rem;">
                        ${diffToFree > 0 ? html`
                            <p style="color: var(--text-secondary); margin-bottom: 6px;">
                                Add <strong style="color: #25D366;">₹${diffToFree}</strong> more to qualify for <strong>FREE DELIVERY</strong>!
                            </p>
                        ` : html`
                            <p style="color: #25D366; font-weight: 700; margin-bottom: 6px;">
                                🎉 You unlocked FREE Express Delivery!
                            </p>
                        `}
                        <div style="height: 5px; width: 100%; background: var(--bg-primary); border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; width: ${progressPercent}%; background: #25D366; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                `}

                <div class="cart-drawer-items">
                    ${cart.length === 0 ? html`
                        <div style="text-align: center; margin-top: 80px; color: var(--text-secondary); padding: 0 20px;">
                            <i data-lucide="shopping-bag" style="width: 48px; height: 48px; margin-bottom: 20px; color: var(--text-muted);"></i>
                            <h4 style="font-size: 1.1rem; margin-bottom: 8px;">Your bag is empty</h4>
                            <p style="font-size: 0.85rem; margin-bottom: 24px;">Discover 205 gothic & streetwear accessories.</p>
                            <button class="btn btn-primary" style="font-size: 0.8rem;" onClick=${() => { setCartOpen(false); window.location.hash = "#/shop"; }}>
                                EXPLORE ACCESSORIES
                            </button>
                        </div>
                    ` : cart.map(item => html`
                        <div class="cart-item" key=${`${item.id}-${item.variant}`}>
                            <img class="cart-item-img" src=${item.image} alt=${item.name} />
                            <div class="cart-item-details">
                                <div>
                                    <h4 class="cart-item-name">${item.name}</h4>
                                </div>
                                <div class="cart-item-price" style="font-weight: 700;">₹${item.price}</div>
                                <div class="cart-item-controls">
                                    <div class="quantity-selector">
                                        <button class="quantity-btn" onClick=${() => updateCartQuantity(item.id, item.variant, item.quantity - 1)}>-</button>
                                        <div class="quantity-val">${item.quantity}</div>
                                        <button class="quantity-btn" onClick=${() => updateCartQuantity(item.id, item.variant, item.quantity + 1)}>+</button>
                                    </div>
                                    <button class="cart-item-remove" onClick=${() => removeFromCart(item.id, item.variant)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    `)}
                </div>

                ${cart.length > 0 && html`
                    <div class="cart-drawer-footer">
                        <div class="cart-summary-row">
                            <span>Subtotal</span>
                            <span style="font-weight: 600;">₹${subtotal}</span>
                        </div>
                        <div class="cart-summary-row" style="font-size: 0.8rem; color: var(--text-secondary);">
                            <span>Delivery</span>
                            <span style="color: ${subtotal >= 1000 ? '#25D366' : 'var(--text-secondary)'}; font-weight: 600;">
                                ${subtotal >= 1000 ? 'FREE' : '₹30'}
                            </span>
                        </div>
                        <div class="cart-summary-row total">
                            <span>Estimated Total</span>
                            <span style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">₹${displayTotal}</span>
                        </div>

                        <!-- Main WhatsApp Action -->
                        <div class="cart-drawer-actions">
                            <button 
                                class="btn-whatsapp btn-whatsapp-lg" 
                                onClick=${handleOrderCartThroughWhatsApp}
                                title="Send order details directly to WhatsApp"
                            >
                                <${WhatsAppIcon} size=${22} color="#ffffff" />
                                <span>Order Cart through WhatsApp</span>
                            </button>

                            <button class="btn btn-secondary" onClick=${handleViewCartClick} style="width: 100%; font-size: 0.75rem;">
                                VIEW DETAILED BAG
                            </button>
                        </div>
                        
                        <p style="font-size: 0.7rem; color: var(--text-muted); text-align: center; margin-top: 10px;">
                            Chat directly on WhatsApp (${WHATSAPP_DISPLAY}) to finalize order
                        </p>
                    </div>
                `}
            </div>
        </div>
    `;
};
