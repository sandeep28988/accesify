import { h } from 'https://esm.sh/preact@10.19.3';
import { useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(h);

export const PrivacyPolicy = () => {
    useEffect(() => window.scrollTo(0, 0), []);
    
    return html`
        <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px; max-width: 800px;">
            <h1 class="section-title" style="margin-bottom: 30px; text-align: left;">PRIVACY POLICY</h1>
            <div style="color: var(--text-secondary); line-height: 1.8; display: flex; flex-direction: column; gap: 20px;">
                <p>Last updated: June 08, 2026</p>
                <p>Welcome to VALOIR. We respect your privacy and are committed to protecting your personal data. This privacy policy describes how we collect, use, and process your information when you visit or make a purchase from our website.</p>
                
                <h3 style="color: var(--text-primary); margin-top: 10px; text-transform: uppercase;">1. INFORMATION WE COLLECT</h3>
                <p>When you place an order, sign up for an account, or contact us, we collect details such as your name, delivery address, phone number, email address, and payment preferences. We also capture device information (IP address, browser type) to optimize our catalog loading times.</p>
                
                <h3 style="color: var(--text-primary); margin-top: 10px; text-transform: uppercase;">2. HOW WE USE YOUR DATA</h3>
                <p>We use this data to process payments, organize shipping logistics, send order tracking details, and answer support messages. If you opt-in to our newsletter, we will notify you of upcoming accessory drops.</p>

                <h3 style="color: var(--text-primary); margin-top: 10px; text-transform: uppercase;">3. SECURE INTEGRATIONS</h3>
                <p>We utilize trusted third-party providers (such as Razorpay for secure card processing, and WhatsApp API for order dispatch routing). We do not store credit card credentials on our servers.</p>
            </div>
        </div>
    `;
};
