import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { ProductCard } from '../components/ProductCard.js';

const html = htm.bind(h);

export const WishlistPage = () => {
    const { wishlist } = useContext(AppContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [wishlist]);

    return html`
        <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px;">
            <div class="section-header" style="text-align: left; margin-bottom: 40px;">
                <span class="section-subtitle">YOUR FAVORITES</span>
                <h1 class="section-title">MY WISHLIST</h1>
            </div>

            ${wishlist.length === 0 ? html`
                <div class="wishlist-empty">
                    <i data-lucide="heart" style="width: 56px; height: 56px; color: var(--text-muted); margin-bottom: 20px;"></i>
                    <h2>YOUR WISHLIST IS EMPTY</h2>
                    <p style="color: var(--text-secondary); margin-top: 12px; margin-bottom: 30px;">
                        Save items you love here to easily purchase them later.
                    </p>
                    <a href="#/shop" class="btn btn-primary">GO TO CATALOGUE</a>
                </div>
            ` : html`
                <div class="products-grid">
                    ${wishlist.map(product => html`
                        <${ProductCard} key=${product.id} product=${product} />
                    `)}
                </div>
            `}
        </div>
    `;
};
