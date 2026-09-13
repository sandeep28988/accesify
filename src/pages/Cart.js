import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { WhatsAppIcon } from '../components/WhatsAppIcon.js';
import { getCartWhatsAppUrl, WHATSAPP_DISPLAY } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const Cart = () => {
    const { 
        cart, 
        updateCartQuantity, 
        removeFromCart, 
        subtotal, 
        discountAmount, 
        shippingCharge, 
        finalTotal,
        activeCoupon,
        applyCoupon,
        removeCoupon
    } = useContext(AppContext);

    const [couponInput, setCouponInput] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [cart]);

    const handleCouponSubmit = (e) => {
        e.preventDefault();
        if (couponInput.trim()) {
            const success = applyCoupon(couponInput.trim());
            if (success) {
                setCouponInput("");
            }
        }
    };

    const handleOrderCartThroughWhatsApp = () => {
        if (cart.length === 0) return;
        const total = finalTotal || subtotal;
        const url = getCartWhatsAppUrl(cart, total);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (cart.length === 0) {
        return html`
            <div class="container" style="padding-top: 160px; padding-bottom: 100px; text-align: center;">
                <i data-lucide="shopping-bag" style="width: 56px; height: 56px; color: var(--text-muted); margin-bottom: 24px;"></i>
                <h2>YOUR SHOPPING BAG IS EMPTY</h2>
                <p style="color: var(--text-secondary); margin-top: 12px; margin-bottom: 30px;">
                    Looks like you haven't added any accessories to your bag yet.
                </p>
                <a href="#/shop" class="btn btn-primary">EXPLORE 205 PRODUCTS</a>
            </div>
        `;
    }

    const freeThreshold = 1000;
    const diffToFree = freeThreshold - subtotal;

    return html`
        <div class="container anim-fade-in" style="padding-top: 36px; padding-bottom: 80px;">
            <div class="section-header" style="text-align: left; margin-bottom: 40px;">
                <span class="section-subtitle">YOUR SELECTION</span>
                <h1 class="section-title">SHOPPING BAG</h1>
            </div>

            <div class="cart-layout">
                <!-- Cart Items Table -->
                <div class="cart-table-container">
                    <table class="cart-table">
                        <thead>
                            <tr>
                                <th>Product Details</th>
                                <th style="text-align: center;">Quantity</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart.map(item => html`
                                <tr key=${`${item.id}-${item.variant}`}>
                                    <td>
                                        <div class="cart-page-item">
                                            <img class="cart-page-item-img" src=${item.image} alt=${item.name} />
                                            <div class="cart-page-item-info">
                                                <h4><a href=${`#/product/${item.id}`}>${item.name}</a></h4>
                                                <p style="margin-top: 8px; font-weight: 700; font-size: 1rem;">₹${item.price}</p>
                                                <button 
                                                    style="background: transparent; border: none; color: #ef4444; font-size: 0.75rem; text-decoration: underline; margin-top: 12px; cursor: pointer;"
                                                    onClick=${() => removeFromCart(item.id, item.variant)}
                                                >
                                                    Remove Item
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td style="text-align: center; vertical-align: middle;">
                                        <div class="quantity-selector" style="display: inline-flex;">
                                            <button class="quantity-btn" onClick=${() => updateCartQuantity(item.id, item.variant, item.quantity - 1)}>-</button>
                                            <div class="quantity-val">${item.quantity}</div>
                                            <button class="quantity-btn" onClick=${() => updateCartQuantity(item.id, item.variant, item.quantity + 1)}>+</button>
                                        </div>
                                    </td>
                                    
                                    <td style="text-align: right; font-weight: 700; vertical-align: middle; font-size: 1.05rem;">
                                        ₹${item.price * item.quantity}
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>

                <!-- Summary Sidebar -->
                <div class="cart-sidebar-panel">
                    <h3 class="cart-sidebar-title">ORDER SUMMARY</h3>
                    
                    <!-- Coupon Panel -->
                    <div class="coupon-section">
                        <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">PROMO CODE</span>
                        ${activeCoupon ? html`
                            <div class="coupon-active-badge">
                                <div>
                                    <strong>${activeCoupon.code}</strong> 
                                    <span style="color: var(--text-secondary); margin-left: 6px;">
                                        (${activeCoupon.type === 'percentage' ? `${activeCoupon.value}% off` : `₹${activeCoupon.value} off`})
                                    </span>
                                </div>
                                <button 
                                    style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; text-decoration: underline; font-size: 0.75rem;" 
                                    onClick=${removeCoupon}
                                >
                                    Remove
                                </button>
                            </div>
                        ` : html`
                            <form onSubmit=${handleCouponSubmit} class="coupon-input-wrapper">
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    placeholder="ENTER CODE" 
                                    value=${couponInput} 
                                    onInput=${(e) => setCouponInput(e.target.value)} 
                                />
                                <button type="submit" class="btn btn-secondary" style="padding: 10px 16px;">APPLY</button>
                            </form>
                            <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 8px;">Try: ACCESSIFY10 (10% Off) or FIRST50 (₹50 Off)</p>
                        `}
                    </div>

                    <!-- Checkout Stats -->
                    <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                            <span style="color: var(--text-secondary);">Bag Subtotal</span>
                            <span style="font-weight: 600;">₹${subtotal}</span>
                        </div>
                        
                        ${discountAmount > 0 && html`
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #25D366;">
                                <span>Discount (${activeCoupon && activeCoupon.code})</span>
                                <span>-₹${discountAmount}</span>
                            </div>
                        `}

                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                            <span style="color: var(--text-secondary);">Delivery Charges</span>
                            <span style="font-weight: 600; color: ${subtotal >= 1000 ? '#25D366' : 'var(--text-primary)'};">
                                ${subtotal >= 1000 ? 'FREE' : `₹${shippingCharge || 30}`}
                            </span>
                        </div>

                        ${subtotal < 1000 && html`
                            <p style="font-size: 0.75rem; color: #25D366; text-align: right; margin-top: -6px;">
                                Add ₹${diffToFree} more for FREE delivery
                            </p>
                        `}
                    </div>

                    <!-- Estimated total -->
                    <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800; border-top: 1px solid var(--border-color); padding-top: 20px; margin-bottom: 24px;">
                        <span>TOTAL</span>
                        <span style="color: var(--text-primary);">₹${finalTotal}</span>
                    </div>

                    <!-- Primary WhatsApp Cart Order Button -->
                    <button 
                        class="btn-whatsapp btn-whatsapp-lg" 
                        onClick=${handleOrderCartThroughWhatsApp}
                        title="Order all items in your cart through WhatsApp"
                    >
                        <${WhatsAppIcon} size=${22} color="#ffffff" />
                        <span>Order Cart through WhatsApp</span>
                    </button>
                    
                    <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 12px; line-height: 1.4;">
                        Your cart list, quantities, prices, and links will be automatically sent to our official WhatsApp (${WHATSAPP_DISPLAY}) for instant confirmation!
                    </p>

                    <a href="#/shop" class="btn btn-secondary" style="width: 100%; text-align: center; margin-top: 16px; font-size: 0.8rem;">
                        CONTINUE BROWSING
                    </a>
                </div>
            </div>
        </div>
    `;
};
