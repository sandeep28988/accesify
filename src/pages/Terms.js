import { h } from 'https://esm.sh/preact@10.19.3';
import { useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(h);

export const Terms = () => {
    useEffect(() => window.scrollTo(0, 0), []);
    
    return html`
        <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px; max-width: 800px;">
            <h1 class="section-title" style="margin-bottom: 30px; text-align: left;">TERMS OF SERVICE</h1>
            <div style="color: var(--text-secondary); line-height: 1.8; display: flex; flex-direction: column; gap: 20px;">
                <p>Last updated: June 08, 2026</p>
                <p>Welcome to VALOIR. These Terms of Service govern your use of our website and purchase transactions. By browsing our catalogue or submitting orders, you agree to comply with these terms.</p>
                
                <h3 style="color: var(--text-primary); margin-top: 10px; text-transform: uppercase;">1. PRODUCT OFFERS & ACCURACY</h3>
                <p>We make every effort to display the colors, metal weights, and sizing options of our accessories accurately. However, we cannot guarantee your screen display matches the physical material finishes exactly.</p>
                
                <h3 style="color: var(--text-primary); margin-top: 10px; text-transform: uppercase;">2. SHIPMENT & CUSTOMS</h3>
                <p>Orders are dispatched from our design hub within 48 business hours. Delivery timelines are subject to courier handling. Cash on Delivery (COD) invoices must be settled in cash at delivery.</p>

                <h3 style="color: var(--text-primary); margin-top: 10px; text-transform: uppercase;">3. ORDER CANCELATIONS</h3>
                <p>VALOIR reserves the right to cancel or refuse any orders in cases of stock discrepancies or invalid coupon applications. Stock levels are simulated in real-time.</p>
            </div>
        </div>
    `;
};
