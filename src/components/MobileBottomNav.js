import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';

const html = htm.bind(h);

export const MobileBottomNav = () => {
    const { currentRoute, cart, wishlist, setCartOpen, searchOpen, setSearchOpen } = useContext(AppContext);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalWishlistItems = wishlist.length;

    const isHome = currentRoute === "#/" || currentRoute === "" || currentRoute === "#";
    const isShop = currentRoute.startsWith("#/shop") || currentRoute.startsWith("#/product/");
    const isWishlist = currentRoute === "#/wishlist";

    return html`
        <nav class="mobile-bottom-nav" aria-label="Mobile Navigation">
            <a href="#/" class="bottom-nav-item ${isHome ? 'active' : ''}">
                <i data-lucide="home"></i>
                <span>Home</span>
            </a>

            <a href="#/shop" class="bottom-nav-item ${isShop ? 'active' : ''}">
                <i data-lucide="layout-grid"></i>
                <span>Shop</span>
            </a>

            <button 
                type="button" 
                class="bottom-nav-item ${searchOpen ? 'active' : ''}" 
                onClick=${() => setSearchOpen(true)}
                aria-label="Search accessories"
                style="background: transparent; border: none; cursor: pointer;"
            >
                <i data-lucide="search"></i>
                <span>Search</span>
            </button>

            <a href="#/wishlist" class="bottom-nav-item ${isWishlist ? 'active' : ''}">
                <div class="bottom-nav-icon-wrap">
                    <i data-lucide="heart"></i>
                    ${totalWishlistItems > 0 && html`
                        <span class="bottom-nav-badge">${totalWishlistItems}</span>
                    `}
                </div>
                <span>Wishlist</span>
            </a>

            <button 
                type="button" 
                class="bottom-nav-item" 
                onClick=${() => setCartOpen(true)}
                aria-label="Open Shopping Bag"
                style="background: transparent; border: none; cursor: pointer;"
            >
                <div class="bottom-nav-icon-wrap">
                    <i data-lucide="shopping-bag"></i>
                    ${totalCartItems > 0 && html`
                        <span class="bottom-nav-badge">${totalCartItems}</span>
                    `}
                </div>
                <span>Bag</span>
            </button>
        </nav>
    `;
};
