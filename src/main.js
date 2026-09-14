import { h, render } from 'https://esm.sh/preact@10.19.3';
import { useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';

// Global Context
import { AppProvider, AppContext } from './context/AppContext.js';

// Layout Shared Components
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';
import { Toast } from './components/Toast.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';

// Page Views
import { Home } from './pages/Home.js';
import { Shop } from './pages/Shop.js';
import { ProductDetails } from './pages/ProductDetails.js';
import { Cart } from './pages/Cart.js';
import { Checkout } from './pages/Checkout.js';
import { LoginRegister } from './pages/LoginRegister.js';
import { WishlistPage } from './pages/WishlistPage.js';
import { About } from './pages/About.js';
import { Contact } from './pages/Contact.js';
import { PrivacyPolicy } from './pages/PrivacyPolicy.js';
import { Terms } from './pages/Terms.js';
import { AdminDashboard } from './pages/AdminDashboard.js';

const html = htm.bind(h);

const App = () => {
    const { currentRoute } = useContext(AppContext);

    // Initialise Lucide icons on route change
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [currentRoute]);

    // Router Logic - Hash Routing
    const renderActivePage = () => {
        // Strip out query parameters for routing
        const routePath = currentRoute.split("?")[0] || "#/";

        if (routePath === "#/" || routePath === "") {
            return html`<${Home} />`;
        }
        if (routePath.startsWith("#/shop")) {
            return html`<${Shop} />`;
        }
        const cleanPath = routePath.replace(/^#\/?/, "");
        const isProductRoute = 
            routePath.startsWith("#/product/") || 
            routePath.startsWith("#product/") || 
            routePath.startsWith("#/products/") || 
            routePath.startsWith("#products/") ||
            cleanPath.startsWith("product/") ||
            cleanPath.startsWith("products/") ||
            cleanPath === "product" ||
            cleanPath === "products";

        if (isProductRoute) {
            return html`<${ProductDetails} key=${currentRoute} />`;
        }
        if (routePath === "#/cart") {
            return html`<${Cart} />`;
        }
        if (routePath === "#/checkout") {
            return html`<${Checkout} />`;
        }
        if (routePath === "#/login") {
            return html`<${LoginRegister} />`;
        }
        if (routePath === "#/wishlist") {
            return html`<${WishlistPage} />`;
        }
        if (routePath === "#/about") {
            return html`<${About} />`;
        }
        if (routePath === "#/contact") {
            return html`<${Contact} />`;
        }
        if (routePath === "#/privacy") {
            return html`<${PrivacyPolicy} />`;
        }
        if (routePath === "#/terms") {
            return html`<${Terms} />`;
        }
        if (routePath.startsWith("#/admin")) {
            return html`<${AdminDashboard} />`;
        }

        // 404 Fallback View
        return html`
            <div class="container" style="padding-top: 160px; padding-bottom: 100px; text-align: center;">
                <h2 style="font-size: 3rem; font-family: var(--font-display);">404</h2>
                <h3 style="margin-top: 10px; text-transform: uppercase;">PAGE NOT FOUND</h3>
                <p style="color: var(--text-secondary); margin-top: 12px; margin-bottom: 30px;">
                    The archive path you are looking for does not exist.
                </p>
                <a href="#/" class="btn btn-primary">RETURN TO HOUSE</a>
            </div>
        `;
    };

    return html`
        <div style="display: flex; flex-direction: column; min-height: 100vh;">
            <!-- Floating Elements -->
            <${Toast} />
            <${CartDrawer} />

            <!-- Core Navigation Bar -->
            <${Navbar} />

            <!-- Dynamic Viewport Area -->
            <main style="flex: 1 0 auto;">
                ${renderActivePage()}
            </main>

            <!-- Brand Footer -->
            <${Footer} />

            <!-- Mobile Bottom Bar (Mobile Only) -->
            <${MobileBottomNav} />
        </div>
    `;
};

// Render App inside the #app Root
render(
    html`
        <${AppProvider}>
            <${App} />
        </${AppProvider}>
    `,
    document.getElementById('app')
);
