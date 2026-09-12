import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';

const html = htm.bind(h);

export const Toast = () => {
    const { toasts, removeToast } = useContext(AppContext);

    if (toasts.length === 0) return null;

    return html`
        <div class="toast-container">
            ${toasts.map(toast => html`
                <div class="toast" key=${toast.id}>
                    <div class="toast-message">${toast.message}</div>
                    <button class="toast-close" onClick=${() => removeToast(toast.id)}>
                        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                    </button>
                </div>
            `)}
        </div>
    `;
};
