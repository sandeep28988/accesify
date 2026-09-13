import { h } from 'https://esm.sh/preact@10.19.3';
import { useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { WhatsAppIcon } from '../components/WhatsAppIcon.js';
import { WHATSAPP_DISPLAY, getSupportWhatsAppUrl } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

    return html`
        <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px;">
            <div class="section-header" style="text-align: left; margin-bottom: 60px;">
                <span class="section-subtitle">THE IDENTITY</span>
                <h1 class="section-title">ABOUT ACCESSIFY</h1>
            </div>

            <!-- Content Row -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-bottom: 80px; align-items: center;">
                <div>
                    <h2 style="font-size: 1.8rem; text-transform: uppercase; margin-bottom: 24px; line-height: 1.2;">
                        GET ACCESSIFIED. STREETWEAR & GOTHIC JEWELRY.
                    </h2>
                    <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px;">
                        Accessify.eco is an online streetwear and fashion accessories brand selling budget-friendly, Gothic- and Y2K-inspired jewelry: stainless steel rings, chains, necklaces, and alternative lifestyle items.
                    </p>
                    <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 30px;">
                        With over 205 curated products available in stock, we offer instant personal ordering via WhatsApp, express courier dispatch across India, and free delivery on orders over ₹1,000.
                    </p>
                    <a 
                        href=${getSupportWhatsAppUrl()} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="btn-whatsapp" 
                        style="display: inline-flex;"
                    >
                        <${WhatsAppIcon} size=${18} color="#ffffff" />
                        <span>Chat on WhatsApp: ${WHATSAPP_DISPLAY}</span>
                    </a>
                </div>
                <div>
                    <img 
                        src="assets/images/hero-hand.jpg" 
                        alt="ACCESSIFY Brand" 
                        style="width: 100%; height: 400px; object-fit: cover; border: 1px solid var(--border-color); border-radius: 6px;"
                    />
                </div>
            </div>

            <!-- Values Row -->
            <div style="border-top: 1px solid var(--border-color); padding-top: 60px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;">
                <div>
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid var(--border-color); margin-bottom: 20px; color: var(--text-secondary);">
                        <i data-lucide="shield" style="width: 20px; height: 20px;"></i>
                    </div>
                    <h3 style="font-size: 1.1rem; text-transform: uppercase; margin-bottom: 12px;">316L SURGICAL STEEL</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                        Hypoallergenic, sweat-resistant, and rust-proof jewelry built for long-lasting daily wear.
                    </p>
                </div>
                
                <div>
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid var(--border-color); margin-bottom: 20px; color: var(--text-secondary);">
                        <i data-lucide="truck" style="width: 20px; height: 20px;"></i>
                    </div>
                    <h3 style="font-size: 1.1rem; text-transform: uppercase; margin-bottom: 12px;">EXPRESS DISPATCH</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                        Fast packaging and doorstep delivery anywhere in India. Free delivery on orders over ₹1,000.
                    </p>
                </div>
                
                <div>
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid var(--border-color); margin-bottom: 20px; color: var(--text-secondary);">
                        <i data-lucide="message-circle" style="width: 20px; height: 20px;"></i>
                    </div>
                    <h3 style="font-size: 1.1rem; text-transform: uppercase; margin-bottom: 12px;">WHATSAPP ORDERING</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                        Direct connection to our team on +91 7012400815. Instant stock checks, custom sizes, and live tracking.
                    </p>
                </div>
            </div>
        </div>
    `;
};
