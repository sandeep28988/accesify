import { h } from 'https://esm.sh/preact@10.19.3';
import { useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { WhatsAppIcon } from './WhatsAppIcon.js';
import { WHATSAPP_DISPLAY, getSupportWhatsAppUrl } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const Footer = () => {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    return html`
        <footer class="footer">
            <div class="container">
                <!-- 5-Column Grid Matching Reference Mockup -->
                <div class="footer-top-grid">
                    
                    <!-- Column 1: Brand & Logo -->
                    <div class="footer-brand-col">
                        <a href="#/" style="text-decoration: none; margin-bottom: 8px; display: inline-block;">
                            <img 
                                src="assets/images/accessify-logo.png" 
                                alt="Accessify" 
                                style="height: 42px; width: auto; max-width: 170px; display: block; margin-bottom: 8px;" 
                            />
                        </a>
                    </div>

                    <!-- Column 2: SHOP -->
                    <div>
                        <div class="footer-col-title">SHOP</div>
                        <ul class="footer-link-list">
                            <li><a href="#/">Home</a></li>
                            <li><a href="#/shop">Shop All</a></li>
                            <li><a href="#/shop?sort=new">New Arrivals</a></li>
                            <li><a href="#/shop?sort=bestseller">Best Sellers</a></li>
                        </ul>
                    </div>

                    <!-- Column 3: CATEGORIES (Split into 2 Sub-columns) -->
                    <div>
                        <div class="footer-col-title">CATEGORIES</div>
                        <div class="footer-categories-split">
                            <ul class="footer-link-list">
                                <li><a href="#/shop?category=chains">Chains</a></li>
                                <li><a href="#/shop?category=rings">Rings</a></li>
                                <li><a href="#/shop?category=earrings">Earrings</a></li>
                                <li><a href="#/shop?category=bracelets">Bracelet</a></li>
                            </ul>
                            <ul class="footer-link-list">
                                <li><a href="#/shop?category=y2k-gothic-necklaces">Y2K Gothic Necklaces</a></li>
                                <li><a href="#/shop?category=iced-out-jewels">Iced Out Jewels</a></li>
                                <li><a href="#/shop?category=sleek-chains">Sleek Chains</a></li>
                                <li><a href="#/shop?category=combos">Limited Edition Combos</a></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Column 4: SUPPORT -->
                    <div>
                        <div class="footer-col-title">SUPPORT</div>
                        <ul class="footer-link-list">
                            <li><a href="#/contact">Contact Us</a></li>
                            <li><a href="#/about">FAQs</a></li>
                            <li><a href="#/about">Shipping & Delivery</a></li>
                            <li><a href="#/terms">Returns & Exchanges</a></li>
                        </ul>
                    </div>

                    <!-- Column 5: CONNECT WITH US -->
                    <div>
                        <div class="footer-col-title">CONNECT WITH US</div>
                        
                        <!-- WhatsApp Order Box -->
                        <a 
                            href=${getSupportWhatsAppUrl()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="footer-connect-box"
                        >
                            <div style="background: #25D366; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <${WhatsAppIcon} size=${18} color="#ffffff" />
                            </div>
                            <div class="footer-connect-text">
                                <h5>Order on WhatsApp</h5>
                                <span>${WHATSAPP_DISPLAY}</span>
                            </div>
                        </a>

                        <!-- Social Media Icons Row -->
                        <div class="footer-social-icons">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="Instagram">
                                <i data-lucide="instagram" style="width: 16px; height: 16px;"></i>
                            </a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="TikTok">
                                <i data-lucide="video" style="width: 16px; height: 16px;"></i>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="YouTube">
                                <i data-lucide="youtube" style="width: 16px; height: 16px;"></i>
                            </a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="Pinterest">
                                <i data-lucide="share-2" style="width: 16px; height: 16px;"></i>
                            </a>
                        </div>
                    </div>

                </div>

                <!-- Bottom Copyright & Policies Bar -->
                <div class="footer-bottom-bar">
                    <div>
                        © 2025 ACCESSIFY. All rights reserved.
                    </div>
                    <div class="footer-bottom-links">
                        <a href="#/privacy">Privacy Policy</a>
                        <span>|</span>
                        <a href="#/terms">Terms & Conditions</a>
                        <span>|</span>
                        <a href="#/admin" style="color: #9CA3AF;">Admin</a>
                    </div>
                </div>
            </div>
        </footer>
    `;
};

