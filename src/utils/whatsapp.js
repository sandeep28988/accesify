// WhatsApp Order Helpers for ACCESSIFY (https://blyo.in/)
// Official Order WhatsApp Number: +91 7012400815

export const WHATSAPP_PHONE = "917012400815";
export const WHATSAPP_DISPLAY = "+91 7012400815";

/**
 * Generates the direct WhatsApp click-to-chat URL for a single product order.
 * Format required:
 * “Hi! I want to order this product:
 *
 * Product: [Product Name]
 * Category: [Category]
 * Price: ₹[Price]
 * Product Link: [Product URL]
 *
 * Please confirm availability and ordering details.”
 */
export const getProductWhatsAppUrl = (product) => {
    const origin = (typeof window !== "undefined" && window.location && window.location.origin) ? window.location.origin : "https://accessify-store.vercel.app";
    const rawPath = (typeof window !== "undefined" && window.location && window.location.pathname) ? window.location.pathname.replace(/\/$/, "") : "";
    const base = `${origin}${rawPath}`;
    const productUrl = `${base}/#/product/${product.id}`;

    const categoryName = product.category
        ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
        : "Accessories";

    let message = `Hi! I want to order this product:\n\n`;
    message += `Product: ${product.name}\n`;
    message += `Category: ${categoryName}\n`;
    message += `Price: ₹${product.price}\n`;
    message += `Product Link: ${productUrl}\n\n`;
    message += `Please confirm availability and ordering details.`;

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};

/**
 * Generates the direct WhatsApp click-to-chat URL for multiple products / Cart.
 * Format required:
 * “Hi! I would like to place an order:
 *
 * 1. [Product Name] × 2 — ₹[Price]
 * 2. [Product Name] × 1 — ₹[Price]
 *
 * Total: ₹[Total]
 *
 * Please confirm my order and delivery details.”
 */
export const getCartWhatsAppUrl = (cartItems, totalAmount) => {
    const origin = (typeof window !== "undefined" && window.location && window.location.origin) ? window.location.origin : "https://accessify-store.vercel.app";
    const rawPath = (typeof window !== "undefined" && window.location && window.location.pathname) ? window.location.pathname.replace(/\/$/, "") : "";
    const base = `${origin}${rawPath}`;

    let message = `Hi! I would like to place an order:\n\n`;

    cartItems.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name} × ${item.quantity} — ₹${itemSubtotal}\n`;
    });

    message += `\nTotal: ₹${totalAmount}\n\n`;

    // Relevant product links
    message += `Product Links:\n`;
    cartItems.forEach((item, index) => {
        const link = `${base}/#/product/${item.id}`;
        message += `${index + 1}. ${item.name}: ${link}\n`;
    });

    message += `\nPlease confirm my order and delivery details.`;

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};

/**
 * General support chat URL
 */
export const getSupportWhatsAppUrl = () => {
    const message = `Hi ACCESSIFY! I would like to inquire about your streetwear accessories collection.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};
