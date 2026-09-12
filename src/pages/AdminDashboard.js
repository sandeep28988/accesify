import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { db } from '../services/db.js';

const html = htm.bind(h);

export const AdminDashboard = () => {
    const { 
        user, 
        login, 
        products, 
        orders, 
        coupons, 
        refreshData, 
        showToast 
    } = useContext(AppContext);

    // Auth fields for protected screen
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Navigation state within admin
    const [activeTab, setActiveTab] = useState("analytics"); // analytics | products | orders | coupons | banners

    // Product CRUD Modals & Forms State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // add | edit
    const [editingProductId, setEditingProductId] = useState("");
    
    // Product Form Fields
    const [prodName, setProdName] = useState("");
    const [prodCategory, setProdCategory] = useState("rings");
    const [prodPrice, setProdPrice] = useState("");
    const [prodComparePrice, setProdComparePrice] = useState("");
    const [prodDescription, setProdDescription] = useState("");
    const [prodImages, setProdImages] = useState("");
    const [prodVariants, setProdVariants] = useState("");
    const [prodStock, setProdStock] = useState("");

    // Coupon Form Fields
    const [couponCode, setCouponCode] = useState("");
    const [couponType, setCouponType] = useState("percentage");
    const [couponValue, setCouponValue] = useState("");

    // Banner Form Fields
    const [bannerTitle, setBannerTitle] = useState("");
    const [bannerSubtitle, setBannerSubtitle] = useState("");
    const [bannerDesc, setBannerDesc] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const [bannerCtaText, setBannerCtaText] = useState("");

    // Load initial banner details on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        const activeBanners = db.getBanners();
        if (activeBanners && activeBanners[0]) {
            setBannerTitle(activeBanners[0].title);
            setBannerSubtitle(activeBanners[0].subtitle);
            setBannerDesc(activeBanners[0].description);
            setBannerImage(activeBanners[0].image);
            setBannerCtaText(activeBanners[0].ctaText);
        }
    }, []);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    const handleAdminLogin = (e) => {
        e.preventDefault();
        login(email, password);
    };

    // Protect View Check
    if (!user || user.role !== "admin") {
        return html`
            <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 80px;">
                <div class="auth-container">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <i data-lucide="shield-alert" style="width: 48px; height: 48px; color: #ef4444; margin-bottom: 16px;"></i>
                        <h2 style="font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase;">ADMIN SYSTEM ACCESS</h2>
                        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 6px;">Authentication required for admin commands.</p>
                    </div>

                    <form onSubmit=${handleAdminLogin}>
                        <div class="form-group">
                            <label for="admin-email">Email Address *</label>
                            <input 
                                id="admin-email"
                                type="email" 
                                class="form-control" 
                                placeholder="admin@valoir.co"
                                value=${email} 
                                onInput=${(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="admin-pass">Password *</label>
                            <input 
                                id="admin-pass"
                                type="password" 
                                class="form-control" 
                                placeholder="••••••••"
                                value=${password} 
                                onInput=${(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                            LOGIN AS ADMIN
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    // CALCULATE SALES ANALYTICS STATS
    const totalSalesRevenue = orders
        .filter(o => o.status === "delivered")
        .reduce((sum, o) => sum + o.total, 0);

    const activeCustomerCount = new Set(orders.map(o => o.email)).size;

    // PRODUCT CRUD HANDLERS
    const openAddProductModal = () => {
        setModalMode("add");
        setProdName("");
        setProdCategory("rings");
        setProdPrice("");
        setProdComparePrice("");
        setProdDescription("");
        setProdImages("");
        setProdVariants("");
        setProdStock("");
        setIsProductModalOpen(true);
    };

    const openEditProductModal = (product) => {
        setModalMode("edit");
        setEditingProductId(product.id);
        setProdName(product.name);
        setProdCategory(product.category);
        setProdPrice(product.price);
        setProdComparePrice(product.comparePrice || "");
        setProdDescription(product.description);
        setProdImages(product.images.join(", "));
        setProdVariants(product.variants ? product.variants.join(", ") : "");
        setProdStock(product.stock);
        setIsProductModalOpen(true);
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        
        const productPayload = {
            name: prodName.toUpperCase(),
            category: prodCategory,
            price: parseFloat(prodPrice),
            comparePrice: prodComparePrice ? parseFloat(prodComparePrice) : parseFloat(prodPrice),
            description: prodDescription,
            images: prodImages.split(",").map(url => url.trim()).filter(Boolean),
            variants: prodVariants.split(",").map(v => v.trim()).filter(Boolean),
            stock: parseInt(prodStock)
        };

        if (modalMode === "edit") {
            productPayload.id = editingProductId;
        }

        const success = db.saveProduct(productPayload);
        if (success) {
            setIsProductModalOpen(false);
            refreshData();
            showToast(`Product ${modalMode === "edit" ? "updated" : "added"} successfully.`);
        }
    };

    const handleDeleteProduct = (id) => {
        if (confirm("Are you sure you want to delete this product from the inventory?")) {
            db.deleteProduct(id);
            refreshData();
            showToast("Product deleted from inventory.");
        }
    };

    // ORDER LIFECYCLE STATS HANDLERS
    const handleStatusChange = (orderId, newStatus) => {
        const success = db.updateOrderStatus(orderId, newStatus);
        if (success) {
            refreshData();
            showToast(`Order #${orderId} status set to ${newStatus}.`);
        }
    };

    // COUPON CREATION HANDLER
    const handleCouponSubmit = (e) => {
        e.preventDefault();
        if (couponCode.trim() && couponValue) {
            const success = db.saveCoupon({
                code: couponCode.trim().toUpperCase(),
                type: couponType,
                value: parseFloat(couponValue)
            });
            if (success) {
                setCouponCode("");
                setCouponValue("");
                refreshData();
                showToast("Coupon discount added.");
            }
        }
    };

    const handleDeleteCoupon = (code) => {
        db.deleteCoupon(code);
        refreshData();
        showToast("Coupon code deleted.");
    };

    // BANNER CONTROLLER HANDLER
    const handleBannerSubmit = (e) => {
        e.preventDefault();
        const success = db.updateBanner({
            title: bannerTitle,
            subtitle: bannerSubtitle,
            description: bannerDesc,
            image: bannerImage,
            ctaText: bannerCtaText
        });
        if (success) {
            showToast("Hero banner updated successfully.");
        }
    };

    return html`
        <div class="admin-layout anim-fade-in">
            <!-- Sidebar Panel -->
            <aside class="admin-sidebar">
                <ul class="admin-menu">
                    <li class="admin-menu-item ${activeTab === 'analytics' ? 'active' : ''}" onClick=${() => setActiveTab("analytics")}>
                        <i data-lucide="bar-chart-3" style="width: 18px; height: 18px;"></i>
                        <span>ANALYTICS</span>
                    </li>
                    <li class="admin-menu-item ${activeTab === 'products' ? 'active' : ''}" onClick=${() => setActiveTab("products")}>
                        <i data-lucide="package" style="width: 18px; height: 18px;"></i>
                        <span>PRODUCTS</span>
                    </li>
                    <li class="admin-menu-item ${activeTab === 'orders' ? 'active' : ''}" onClick=${() => setActiveTab("orders")}>
                        <i data-lucide="shopping-cart" style="width: 18px; height: 18px;"></i>
                        <span>ORDERS</span>
                    </li>
                    <li class="admin-menu-item ${activeTab === 'coupons' ? 'active' : ''}" onClick=${() => setActiveTab("coupons")}>
                        <i data-lucide="ticket" style="width: 18px; height: 18px;"></i>
                        <span>COUPONS</span>
                    </li>
                    <li class="admin-menu-item ${activeTab === 'banners' ? 'active' : ''}" onClick=${() => setActiveTab("banners")}>
                        <i data-lucide="image" style="width: 18px; height: 18px;"></i>
                        <span>HERO BANNER</span>
                    </li>
                </ul>
            </aside>

            <!-- Main Work Desk -->
            <main class="admin-content">
                <!-- TAB 1: ANALYTICS -->
                ${activeTab === "analytics" && html`
                    <div>
                        <div class="admin-section-header">
                            <div>
                                <h1 style="font-size: 1.8rem; text-transform: uppercase;">Studio Analytics</h1>
                                <p style="color: var(--text-secondary); margin-top: 6px; font-size: 0.85rem;">Real-time business performance summaries.</p>
                            </div>
                        </div>

                        <!-- Statistics Grid widgets -->
                        <div class="analytics-grid">
                            <div class="metric-card">
                                <div class="metric-header">
                                    <span>TOTAL REVENUE</span>
                                    <i data-lucide="dollar-sign" style="width: 16px; height: 16px;"></i>
                                </div>
                                <div class="metric-value">$${totalSalesRevenue.toFixed(2)}</div>
                                <div class="metric-trend">↑ 12.5% vs last week</div>
                            </div>
                            
                            <div class="metric-card">
                                <div class="metric-header">
                                    <span>TOTAL ORDERS</span>
                                    <i data-lucide="shopping-bag" style="width: 16px; height: 16px;"></i>
                                </div>
                                <div class="metric-value">${orders.length}</div>
                                <div class="metric-trend">↑ 8.2% vs last week</div>
                            </div>

                            <div class="metric-card">
                                <div class="metric-header">
                                    <span>TOTAL CATALOGUE</span>
                                    <i data-lucide="database" style="width: 16px; height: 16px;"></i>
                                </div>
                                <div class="metric-value">${products.length} Items</div>
                                <div class="metric-trend">Active stock levels</div>
                            </div>

                            <div class="metric-card">
                                <div class="metric-header">
                                    <span>TOTAL USERS</span>
                                    <i data-lucide="users" style="width: 16px; height: 16px;"></i>
                                </div>
                                <div class="metric-value">${activeCustomerCount}</div>
                                <div class="metric-trend">Registered accounts</div>
                            </div>
                        </div>

                        <!-- Recent activity list -->
                        <h3 style="margin-bottom: 20px; text-transform: uppercase;">Recent Submissions</h3>
                        <div class="admin-table-card">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Ref ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th style="text-align: right;">Total Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orders.slice(0, 5).map(o => html`
                                        <tr key=${o.id}>
                                            <td>#${o.id}</td>
                                            <td>${o.customerName}</td>
                                            <td>${new Date(o.date).toLocaleDateString()}</td>
                                            <td><span class="status-badge ${o.status}">${o.status}</span></td>
                                            <td style="text-align: right; font-weight: 600;">$${o.total.toFixed(2)}</td>
                                        </tr>
                                    `)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `}

                <!-- TAB 2: PRODUCTS CRUD TABLE -->
                ${activeTab === "products" && html`
                    <div>
                        <div class="admin-section-header">
                            <div>
                                <h1 style="font-size: 1.8rem; text-transform: uppercase;">Inventory Management</h1>
                                <p style="color: var(--text-secondary); margin-top: 6px; font-size: 0.85rem;">Modify products, categories and stock levels.</p>
                            </div>
                            <button class="btn btn-primary" onClick=${openAddProductModal}>
                                ADD PRODUCT +
                            </button>
                        </div>

                        <div class="admin-table-card">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Details</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th style="text-align: right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${products.map(p => html`
                                        <tr key=${p.id}>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 16px;">
                                                    <img src=${p.images[0]} style="width: 44px; height: 44px; object-fit: cover; border: 1px solid var(--border-color);" />
                                                    <div>
                                                        <strong style="font-size: 0.85rem;">${p.name}</strong>
                                                        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">ID: ${p.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style="text-transform: uppercase; font-size: 0.75rem;">${p.category}</td>
                                            <td>$${p.price.toFixed(2)}</td>
                                            <td>
                                                ${p.stock === 0 
                                                    ? html`<span class="status-badge cancelled">OUT OF STOCK</span>` 
                                                    : p.stock <= 5 
                                                        ? html`<span class="status-badge pending">LOW STOCK (${p.stock})</span>` 
                                                        : html`<span style="font-weight: 500;">${p.stock} units</span>`
                                                }
                                            </td>
                                            <td style="text-align: right;">
                                                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; margin-right: 8px;" onClick=${() => openEditProductModal(p)}>
                                                    EDIT
                                                </button>
                                                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; border-color: #ef4444; color: #ef4444;" onClick=${() => handleDeleteProduct(p.id)}>
                                                    DELETE
                                                </button>
                                            </td>
                                        </tr>
                                    `)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `}

                <!-- TAB 3: ORDERS MANAGEMENT -->
                ${activeTab === "orders" && html`
                    <div>
                        <div class="admin-section-header">
                            <div>
                                <h1 style="font-size: 1.8rem; text-transform: uppercase;">Order Processing</h1>
                                <p style="color: var(--text-secondary); margin-top: 6px; font-size: 0.85rem;">Inspect address info, payments and update shipping states.</p>
                            </div>
                        </div>

                        <div class="admin-table-card">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Ref ID</th>
                                        <th>Client details</th>
                                        <th>Invoice</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                        <th style="text-align: right;">Toggle Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orders.map(o => html`
                                        <tr key=${o.id}>
                                            <td>
                                                <strong>#${o.id}</strong>
                                                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${new Date(o.date).toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                <div>${o.customerName}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${o.address}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">Phone: ${o.phone}</div>
                                            </td>
                                            <td style="font-weight: 600;">$${o.total.toFixed(2)}</td>
                                            <td style="font-size: 0.8rem; color: var(--text-secondary);">${o.paymentMethod}</td>
                                            <td><span class="status-badge ${o.status}">${o.status}</span></td>
                                            <td style="text-align: right;">
                                                <select 
                                                    style="background: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 8px 12px; font-size: 0.8rem;"
                                                    value=${o.status}
                                                    onChange=${(e) => handleStatusChange(o.id, e.target.value)}
                                                    aria-label="Change order status"
                                                >
                                                    <option value="pending">PENDING</option>
                                                    <option value="processing">PROCESSING</option>
                                                    <option value="shipped">SHIPPED</option>
                                                    <option value="delivered">DELIVERED</option>
                                                    <option value="cancelled">CANCELLED</option>
                                                </select>
                                            </td>
                                        </tr>
                                    `)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `}

                <!-- TAB 4: COUPONS MANAGEMENT -->
                ${activeTab === "coupons" && html`
                    <div style="display: grid; grid-template-columns: 320px 1fr; gap: 40px;">
                        <!-- Left form -->
                        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 24px; height: fit-content;">
                            <h3 style="margin-bottom: 20px; text-transform: uppercase;">Create Coupon</h3>
                            <form onSubmit=${handleCouponSubmit}>
                                <div class="form-group">
                                    <label for="coupon-code">Promo Code *</label>
                                    <input id="coupon-code" type="text" class="form-control" required placeholder="SUMMER15" value=${couponCode} onInput=${(e) => setCouponCode(e.target.value)} />
                                </div>
                                <div class="form-group">
                                    <label for="coupon-type">Discount Type</label>
                                    <select id="coupon-type" class="form-control" value=${couponType} onChange=${(e) => setCouponType(e.target.value)}>
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="flat">Flat Value ($)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="coupon-value">Discount Value *</label>
                                    <input id="coupon-value" type="number" class="form-control" required placeholder="15" value=${couponValue} onInput=${(e) => setCouponValue(e.target.value)} />
                                </div>
                                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                                    SAVE COUPON CODE
                                </button>
                            </form>
                        </div>

                        <!-- Right list -->
                        <div>
                            <h3 style="margin-bottom: 20px; text-transform: uppercase;">Active Promo Codes</h3>
                            <div class="admin-table-card">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Formula</th>
                                            <th>Status</th>
                                            <th style="text-align: right;">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${coupons.map(c => html`
                                            <tr key=${c.code}>
                                                <td><strong>${c.code}</strong></td>
                                                <td>${c.type === 'percentage' ? `${c.value}% Off` : `$${c.value} Off`}</td>
                                                <td><span class="status-badge active">Active</span></td>
                                                <td style="text-align: right;">
                                                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; border-color: #ef4444; color: #ef4444;" onClick=${() => handleDeleteCoupon(c.code)}>
                                                        DELETE
                                                    </button>
                                                </td>
                                            </tr>
                                        `)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `}

                <!-- TAB 5: BANNERS CONTROLLER -->
                ${activeTab === "banners" && html`
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 40px; max-width: 800px;">
                        <h2 style="margin-bottom: 8px; text-transform: uppercase; font-family: var(--font-display);">Hero Banner Asset Control</h2>
                        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 30px;">Update customer hero banner messaging and branding images.</p>
                        
                        <form onSubmit=${handleBannerSubmit}>
                            <div class="form-group">
                                <label for="banner-subtitle">Pre-Title (Small)</label>
                                <input id="banner-subtitle" type="text" class="form-control" value=${bannerSubtitle} onInput=${(e) => setBannerSubtitle(e.target.value)} />
                            </div>
                            
                            <div class="form-group">
                                <label for="banner-title">Main Header Title</label>
                                <input id="banner-title" type="text" class="form-control" value=${bannerTitle} onInput=${(e) => setBannerTitle(e.target.value)} />
                            </div>

                            <div class="form-group">
                                <label for="banner-desc">Description Statement</label>
                                <textarea id="banner-desc" class="form-control" value=${bannerDesc} onInput=${(e) => setBannerDesc(e.target.value)}></textarea>
                            </div>

                            <div class="form-group">
                                <label for="banner-img">Hero Background Image URL</label>
                                <input id="banner-img" type="text" class="form-control" value=${bannerImage} onInput=${(e) => setBannerImage(e.target.value)} />
                            </div>

                            <div class="form-group">
                                <label for="banner-cta">CTA Button Text</label>
                                <input id="banner-cta" type="text" class="form-control" value=${bannerCtaText} onInput=${(e) => setBannerCtaText(e.target.value)} />
                            </div>

                            <button type="submit" class="btn btn-primary" style="margin-top: 10px;">
                                COMMIT HERO CHANGES
                            </button>
                        </form>
                    </div>
                `}
            </main>

            <!-- PRODUCT EDIT / ADD OVERLAY MODAL -->
            <div class="admin-modal-overlay ${isProductModalOpen ? 'open' : ''}">
                <div class="admin-modal">
                    <button class="admin-modal-close" onClick=${() => setIsProductModalOpen(false)}>
                        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                    </button>
                    
                    <h3 style="margin-bottom: 24px; text-transform: uppercase; font-family: var(--font-display);">
                        ${modalMode === 'edit' ? 'Edit Product details' : 'Add New Product'}
                    </h3>

                    <form onSubmit=${handleProductSubmit}>
                        <div class="form-group">
                            <label for="prod-name">Product Name *</label>
                            <input id="prod-name" type="text" class="form-control" required placeholder="CHROME SPIKE LINK" value=${prodName} onInput=${(e) => setProdName(e.target.value)} />
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="prod-cat">Category</label>
                                <select id="prod-cat" class="form-control" value=${prodCategory} onChange=${(e) => setProdCategory(e.target.value)}>
                                    <option value="rings">Rings</option>
                                    <option value="chains">Chains</option>
                                    <option value="bracelets">Bracelets</option>
                                    <option value="watches">Watches</option>
                                    <option value="sunglasses">Sunglasses</option>
                                    <option value="caps">Caps</option>
                                    <option value="wallets">Wallets</option>
                                    <option value="perfumes">Perfumes</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="prod-stock">Stock Qty *</label>
                                <input id="prod-stock" type="number" class="form-control" required placeholder="10" value=${prodStock} onInput=${(e) => setProdStock(e.target.value)} />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="prod-price">Retail Price ($) *</label>
                                <input id="prod-price" type="number" step="0.01" class="form-control" required placeholder="120.00" value=${prodPrice} onInput=${(e) => setProdPrice(e.target.value)} />
                            </div>
                            
                            <div class="form-group">
                                <label for="prod-compare">Original Price ($)</label>
                                <input id="prod-compare" type="number" step="0.01" class="form-control" placeholder="150.00" value=${prodComparePrice} onInput=${(e) => setProdComparePrice(e.target.value)} />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="prod-desc">Product Description *</label>
                            <textarea id="prod-desc" class="form-control" required placeholder="Aerospace grade silver alloy interlocking link..." value=${prodDescription} onInput=${(e) => setProdDescription(e.target.value)}></textarea>
                        </div>

                        <div class="form-group">
                            <label for="prod-imgs">Image URLs (comma separated) *</label>
                            <input id="prod-imgs" type="text" class="form-control" required placeholder="http://domain.com/img1.jpg, http://domain.com/img2.jpg" value=${prodImages} onInput=${(e) => setProdImages(e.target.value)} />
                        </div>

                        <div class="form-group">
                            <label for="prod-vars">Variants / Options (comma separated)</label>
                            <input id="prod-vars" type="text" class="form-control" placeholder="Medium, Large or US 8, US 9" value=${prodVariants} onInput=${(e) => setProdVariants(e.target.value)} />
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                            SAVE PRODUCT
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
};
