import { h } from 'https://esm.sh/preact@10.19.3';
import htm from 'https://esm.sh/htm@3.1.1';
import { WhatsAppIcon } from './WhatsAppIcon.js';
import { WHATSAPP_PHONE, WHATSAPP_DISPLAY } from '../utils/whatsapp.js';

const html = htm.bind(h);

export const WhatsAppButton = () => {
    const message = "Hi ACCESSIFY! I am browsing your streetwear accessories and would love some assistance with an order.";
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    return html`
        <a 
            href=${url} 
            class="whatsapp-float" 
            target="_blank" 
            rel="noopener noreferrer" 
            title="Chat with ACCESSIFY on WhatsApp (${WHATSAPP_DISPLAY})"
            aria-label="Chat on WhatsApp"
        >
            <${WhatsAppIcon} size=${30} color="#ffffff" />
        </a>
    `;
};
