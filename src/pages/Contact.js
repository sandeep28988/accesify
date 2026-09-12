import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { WhatsAppIcon } from '../components/WhatsAppIcon.js';
import { WHATSAPP_DISPLAY, getSupportWhatsAppUrl } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const Contact = () => {
    const { showToast } = useContext(AppContext);
    
    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && email && message) {
            showToast(`Thank you, ${name}! Your inquiry has been received.`);
            setName("");
            setEmail("");
            setMessage("");
        }
    };

    return html`
        <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px;">
            <div class="section-header" style="text-align: left; margin-bottom: 40px;">
                <span class="section-subtitle">GET IN TOUCH</span>
                <h1 class="section-title">CONTACT ACCESSIFY</h1>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px;">
                <!-- Form column -->
                <div>
                    <form onSubmit=${handleSubmit}>
                        <div class="form-group">
                            <label for="contact-name">Your Name *</label>
                            <input 
                                id="contact-name"
                                type="text" 
                                class="form-control" 
                                placeholder="Aarav Sharma" 
                                value=${name}
                                onInput=${(e) => setName(e.target.value)}
                                required 
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-email">Email Address *</label>
                            <input 
                                id="contact-email"
                                type="email" 
                                class="form-control" 
                                placeholder="aarav@example.com" 
                                value=${email}
                                onInput=${(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>

                        <div class="form-group">
                            <label for="contact-msg">Message details *</label>
                            <textarea 
                                id="contact-msg"
                                class="form-control" 
                                placeholder="Describe your inquiry, custom sizing question, or bulk order..." 
                                value=${message}
                                onInput=${(e) => setMessage(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary" style="margin-top: 10px;">
                            SEND MESSAGE
                        </button>
                    </form>
                </div>

                <!-- Info column -->
                <div style="display: flex; flex-direction: column; gap: 30px; justify-content: center; background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 40px; border-radius: 6px;">
                    <div>
                        <h3 style="font-size: 1rem; text-transform: uppercase; margin-bottom: 8px; color: #25D366; display: flex; align-items: center; gap: 8px;">
                            <${WhatsAppIcon} size=${18} color="#25D366" />
                            <span>OFFICIAL WHATSAPP ORDERING</span>
                        </h3>
                        <p style="color: var(--text-primary); font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">
                            ${WHATSAPP_DISPLAY}
                        </p>
                        <a 
                            href=${getSupportWhatsAppUrl()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="btn-whatsapp btn-whatsapp-sm" 
                            style="display: inline-flex;"
                        >
                            <${WhatsAppIcon} size=${16} color="#ffffff" />
                            <span>Start WhatsApp Chat</span>
                        </a>
                    </div>

                    <div>
                        <h3 style="font-size: 1rem; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">ACCESSIFY BRAND</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                            Kochi, Kerala, India.<br />
                            Serving streetwear enthusiasts all across India with express delivery.
                        </p>
                    </div>

                    <div>
                        <h3 style="font-size: 1rem; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">BUSINESS HOURS</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                            Monday — Sunday: 9:00 AM – 10:00 PM IST<br />
                            Orders processed 24/7 on WhatsApp!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
};
