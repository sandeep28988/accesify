import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { WhatsAppIcon } from './WhatsAppIcon.js';
import { WHATSAPP_DISPLAY, getSupportWhatsAppUrl } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const Footer = () => {
    const [email, setEmail] = useState("");
    const { showToast } = useContext(AppContext);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            showToast(`Thank you! "${email}" has been added to our VIP drop alerts.`);
            setEmail("");
        }
    };

    return html`
        <footer class="footer">
            <div class="container">
                <div class="footer-grid">
                    <!-- Brand info -->
                    <div class="footer-brand">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                            <h3 style="font-size: 1.5rem; letter-spacing: 0.1em; margin-bottom: 0;">ACCESSIFY</h3>
                            <span style="font-size: 0.65rem; background: #25D366; color: #000; font-weight: 800; padding: 2px 6px; border-radius: 3px;">BLYO</span>
                        </div>
                        <p>Accessify.eco is an online streetwear and fashion accessories brand selling budget-friendly, Gothic- and Y2K-inspired jewelry such as stainless steel rings, chains, necklaces, bracelets, and alternative lifestyle essentials.</p>
                        
                        <div style="margin-top: 20px; margin-bottom: 24px;">
                            <a 
                                href=${getSupportWhatsAppUrl()} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="btn-whatsapp btn-whatsapp-sm" 
                                style="display: inline-flex;"
                            >
                                <${WhatsAppIcon} size=${16} color="#ffffff" />
                                <span>WhatsApp: ${WHATSAPP_DISPLAY}</span>
                            </a>
                        </div>
                    </div>

                    <!-- Collections Column -->
                    <div class="footer-links-col">
                        <h4>Categories (205)</h4>
                        <ul class="footer-links">
                            <li><a href="#/shop?category=rings">Rings (88)</a></li>
                            <li><a href="#/shop?category=chains">Chains & Necklaces (50)</a></li>
                            <li><a href="#/shop?category=bracelets">Bracelets (21)</a></li>
                            <li><a href="#/shop?category=combos">Combos & Sets (16)</a></li>
                            <li><a href="#/shop?category=fragrances">Fragrances (13)</a></li>
                            <li><a href="#/shop?category=grooming">Grooming (10)</a></li>
                            <li><a href="#/shop?category=limited-edition">Limited Edition (5)</a></li>
                        </ul>
                    </div>

                    <!-- Trust Column -->
                    <div class="footer-links-col">
                        <h4>Guarantees</h4>
                        <ul class="footer-links">
                            <li style="color: var(--text-secondary);">✓ 316L Surgical Steel</li>
                            <li style="color: var(--text-secondary);">✓ Water & Sweat Resistant</li>
                            <li style="color: var(--text-secondary);">✓ Free Delivery Over ₹1,000</li>
                            <li style="color: var(--text-secondary);">✓ WhatsApp Instant Confirmation</li>
                            <li><a href="#/terms">Terms of Service</a></li>
                            <li><a href="#/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <!-- Newsletter Column -->
                    <div class="footer-newsletter">
                        <h4>Drop Alerts</h4>
                        <p>Subscribe for WhatsApp and email alerts on rare limited edition accessories and restocks.</p>
                        <form class="newsletter-form" onSubmit=${handleSubscribe}>
                            <input 
                                type="email" 
                                placeholder="ENTER YOUR EMAIL" 
                                value=${email} 
                                onInput=${(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <button type="submit" aria-label="Subscribe">
                                <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
                            </button>
                        </form>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>© ${new Date().getFullYear()} ACCESSIFY (https://blyo.in/). All rights reserved.</p>
                    <p style="letter-spacing: 0.05em; color: #25D366; font-weight: 600;">OFFICIAL WHATSAPP ORDERING: ${WHATSAPP_DISPLAY}</p>
                </div>
            </div>
        </footer>
    `;
};
