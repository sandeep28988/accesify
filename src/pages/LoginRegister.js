import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';

const html = htm.bind(h);

export const LoginRegister = () => {
    const { user, login, logout, orders, showToast } = useContext(AppContext);
    
    // UI states
    const [activeTab, setActiveTab] = useState("login"); // login | register
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    
    // Register states
    const [regUsername, setRegUsername] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Listen to tab redirects
        const hash = window.location.hash || "";
        if (hash.includes("tab=orders")) {
            setActiveTab("orders");
        }
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [user]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            login(email, password);
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (regUsername && regEmail && regPassword) {
            // Register session
            const standardUser = { username: regUsername, email: regEmail, role: "user" };
            localStorage.setItem("valoir_current_user", JSON.stringify(standardUser));
            login(regEmail, regPassword); // log them in automatically
            showToast(`Welcome to VALOIR, ${regUsername}!`);
        }
    };

    // Filter orders belonging to current logged in user
    const userOrders = orders.filter(order => {
        if (!user) return false;
        return order.email.toLowerCase() === user.email.toLowerCase();
    });

    // If logged in, show Account Profile Dashboard
    if (user) {
        return html`
            <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px;">
                <div class="section-header" style="text-align: left; margin-bottom: 40px;">
                    <span class="section-subtitle">MEMBER AREA</span>
                    <h1 class="section-title">MY ACCOUNT</h1>
                </div>

                <div class="shop-layout">
                    <!-- Sidebar Account Control -->
                    <aside class="shop-sidebar" style="padding: 24px;">
                        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color);">
                            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--bg-tertiary); display: inline-flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 12px; border: 1px solid var(--border-color);">
                                ${user.username ? user.username.substr(0,2).toUpperCase() : 'US'}
                            </div>
                            <h3>${user.username}</h3>
                            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px;">${user.email}</p>
                            <span class="status-badge delivered" style="margin-top: 10px; font-size: 0.65rem;">
                                VALOIR CLUB MEMBER
                            </span>
                        </div>

                        <ul class="filter-list">
                            <li class="filter-item ${activeTab === 'orders' ? 'active' : ''}" onClick=${() => setActiveTab("orders")}>
                                <span>ORDER HISTORY</span>
                                <span style="font-size: 0.75rem; color: var(--text-muted);">(${userOrders.length})</span>
                            </li>
                            <li class="filter-item" onClick=${logout} style="color: #ef4444;">
                                <span>LOG OUT</span>
                                <i data-lucide="log-out" style="width: 14px; height: 14px;"></i>
                            </li>
                        </ul>
                    </aside>

                    <!-- Main Account Area -->
                    <main>
                        ${activeTab === "orders" ? html`
                            <div>
                                <h3 style="margin-bottom: 24px; text-transform: uppercase; font-family: var(--font-display);">Orders Dashboard</h3>
                                ${userOrders.length === 0 ? html`
                                    <div style="padding: 60px; text-align: center; border: 1px solid var(--border-color); background: var(--bg-secondary);">
                                        <i data-lucide="package" style="width: 40px; height: 40px; color: var(--text-muted); margin-bottom: 16px;"></i>
                                        <p style="color: var(--text-secondary);">You have not placed any orders yet.</p>
                                        <a href="#/shop" class="btn btn-primary" style="margin-top: 20px; font-size: 0.75rem;">BROWSE SHOP</a>
                                    </div>
                                ` : userOrders.map(order => html`
                                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 24px; margin-bottom: 20px;" key=${order.id}>
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 16px;">
                                            <div>
                                                <h4 style="font-size: 0.95rem;">ORDER REF: #${order.id}</h4>
                                                <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">Placed on: ${new Date(order.date).toLocaleDateString()}</p>
                                            </div>
                                            <span class="status-badge ${order.status}">${order.status}</span>
                                        </div>

                                        <!-- Order Items -->
                                        <div style="margin-bottom: 16px;">
                                            ${order.items.map(item => html`
                                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;" key=${`${item.id}-${item.variant}`}>
                                                    <span style="color: var(--text-secondary);">${item.name} (${item.variant}) x${item.quantity}</span>
                                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            `)}
                                        </div>

                                        <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--border-color); padding-top: 16px; font-size: 0.9rem; font-weight: 600;">
                                            <span>Invoice Total:</span>
                                            <span>$${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        ` : html`
                            <div>
                                <h3 style="margin-bottom: 24px; text-transform: uppercase;">Profile Details</h3>
                                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 30px;">
                                    <div class="form-group" style="margin-bottom: 20px;">
                                        <label>Username</label>
                                        <input type="text" class="form-control" value=${user.username} disabled />
                                    </div>
                                    <div class="form-group" style="margin-bottom: 20px;">
                                        <label>Email Address</label>
                                        <input type="text" class="form-control" value=${user.email} disabled />
                                    </div>
                                    <div class="form-group">
                                        <label>Account Role</label>
                                        <input type="text" class="form-control" value=${user.role} disabled style="text-transform: uppercase;" />
                                    </div>
                                </div>
                            </div>
                        `}
                    </main>
                </div>
            </div>
        `;
    }

    // Default Login/Register Panel View
    return html`
        <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px;">
            <div class="auth-container">
                <div class="auth-tabs">
                    <button class="auth-tab-btn ${activeTab === 'login' ? 'active' : ''}" onClick=${() => setActiveTab("login")}>
                        LOGIN
                    </button>
                    <button class="auth-tab-btn ${activeTab === 'register' ? 'active' : ''}" onClick=${() => setActiveTab("register")}>
                        REGISTER
                    </button>
                </div>

                ${activeTab === 'login' ? html`
                    <!-- Login Form -->
                    <form onSubmit=${handleLoginSubmit}>
                        <div class="form-group">
                            <label for="login-email">Email Address *</label>
                            <input 
                                id="login-email"
                                type="email" 
                                class="form-control" 
                                placeholder="customer@valoir.co"
                                value=${email} 
                                onInput=${(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="login-pass">Password *</label>
                            <input 
                                id="login-pass"
                                type="password" 
                                class="form-control" 
                                placeholder="••••••••"
                                value=${password} 
                                onInput=${(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                            SIGN IN
                        </button>
                    </form>
                ` : html`
                    <!-- Registration Form -->
                    <form onSubmit=${handleRegisterSubmit}>
                        <div class="form-group">
                            <label for="reg-user">Username *</label>
                            <input 
                                id="reg-user"
                                type="text" 
                                class="form-control" 
                                placeholder="AidenCross"
                                value=${regUsername} 
                                onInput=${(e) => setRegUsername(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-email">Email Address *</label>
                            <input 
                                id="reg-email"
                                type="email" 
                                class="form-control" 
                                placeholder="aiden@cross.com"
                                value=${regEmail} 
                                onInput=${(e) => setRegEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-pass">Password *</label>
                            <input 
                                id="reg-pass"
                                type="password" 
                                class="form-control" 
                                placeholder="••••••••"
                                value=${regPassword} 
                                onInput=${(e) => setRegPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                            CREATE ACCOUNT
                        </button>
                    </form>
                `}
            </div>
        </div>
    `;
};
