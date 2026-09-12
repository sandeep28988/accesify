import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { WhatsAppIcon } from '../components/WhatsAppIcon.js';
import { getCartWhatsAppUrl, WHATSAPP_DISPLAY } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const Checkout = () => {
    const { 
        cart, 
        subtotal, 
        discountAmount, 
        shippingCharge, 
        finalTotal,
        activeCoupon 
    } = useContext(AppContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [cart]);

    if (cart.length === 0) {
        return html`
            <div class="container" style="padding-top: 160px; padding-bottom: 100px; text-align: center;">
                <i data-lucide="shopping-bag" style="width: 56px; height: 56px; color: var(--text-muted); margin-bottom: 24px;"></i>
                <h2>YOUR BAG IS EMPTY</h2>
                <p style="color: var(--text-secondary); margin-top: 12px; margin-bottom: 30px;">
                    Select accessories to order via WhatsApp.
                </p>
                <a href="#/shop" class="btn btn-primary">EXPLORE 205 PRODUCTS</a>
            </div>
        `;
    }

    const handleOrderViaWhatsApp = () => {
        const total = finalTotal || subtotal;
        const url = getCartWhatsAppUrl(cart, total);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return html`
        <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px; max-width: 800px;">
            <div class="section-header" style="text-align: center; margin-bottom: 40px;">
                <span class="section-subtitle">DIRECT WHATSAPP ORDERING</span>
                <h1 class="section-title">CONFIRM YOUR ORDER</h1>
                <p style="color: var(--text-secondary); margin-top: 10px; font-size: 0.95rem;">
                    We process all orders directly through WhatsApp for personalized service, stock confirmation, and instant delivery tracking.
                </p>
            </div>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 32px; box-shadow: var(--shadow-md);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                    <h3 style="font-size: 1.1rem; font-weight: 700;">ORDER ITEMS (${cart.length})</h3>
                    <a href="#/cart" style="color: var(--text-secondary); font-size: 0.8rem; text-decoration: underline;">
                        Edit Bag
                    </a>
                </div>

                <!-- Items list preview -->
                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 30px;">
                    ${cart.map((item, index) => html`
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;" key=${`${item.id}-${item.variant}`}>
                            <div style="display: flex; align-items: center; gap: 14px;">
                                <img src=${item.image} alt=${item.name} style="width: 52px; height: 52px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);" />
                                <div>
                                    <h4 style="font-size: 0.9rem; font-weight: 600;">${item.name}</h4>
                                    <p style="font-size: 0.75rem; color: var(--text-muted);">
                                        Qty: ${item.quantity} ${item.variant && item.variant !== "Standard" ? `• ${item.variant}` : ''}
                                    </p>
                                </div>
                            </div>
                            <div style="font-weight: 700; font-size: 0.95rem;">
                                ₹${item.price * item.quantity}
                            </div>
                        </div>
                    `)}
                </div>

                <!-- Totals Breakdown -->
                <div style="border-top: 1px solid var(--border-color); padding-top: 20px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                        <span style="color: var(--text-secondary);">Subtotal</span>
                        <span style="font-weight: 600;">₹${subtotal}</span>
                    </div>

                    ${discountAmount > 0 && html`
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #25D366;">
                            <span>Discount (${activeCoupon && activeCoupon.code})</span>
                            <span>-₹${discountAmount}</span>
                        </div>
                    `}

                    <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                        <span style="color: var(--text-secondary);">Delivery</span>
                        <span style="font-weight: 600; color: ${subtotal >= 1000 ? '#25D366' : 'var(--text-primary)'};">
                            ${subtotal >= 1000 ? 'FREE' : `₹${shippingCharge || 30}`}
                        </span>
                    </div>

                    <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 800; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 6px;">
                        <span>Total Payable</span>
                        <span style="color: #ffffff;">₹${finalTotal}</span>
                    </div>
                </div>

                <!-- WhatsApp Order CTA -->
                <button 
                    class="btn-whatsapp btn-whatsapp-lg" 
                    onClick=${handleOrderViaWhatsApp}
                    style="font-size: 1.05rem;"
                >
                    <${WhatsAppIcon} size=${24} color="#ffffff" />
                    <span>Order through WhatsApp</span>
                </button>

                <div style="margin-top: 20px; padding: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; border: 1px dashed var(--border-color); font-size: 0.8rem; color: var(--text-secondary); text-align: center;">
                    <p style="margin-bottom: 4px;">
                        📲 Clicking will launch WhatsApp with your pre-formatted order message directly to <strong>${WHATSAPP_DISPLAY}</strong>.
                    </p>
                    <p>
                        Our team will instantly verify product stock, take your delivery address, and confirm dispatch!
                    </p>
                </div>
            </div>
        </div>
    `;
};
