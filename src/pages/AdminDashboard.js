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
        directAdminLogin,
        logout,
        products, 
        refreshData, 
        showToast 
    } = useContext(AppContext);

    // Navigation & UI States
    const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | products | categories | orders | customers | coupons | settings
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Auth fields for protected screen
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");

    // Filter and Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [stockFilter, setStockFilter] = useState("all"); // all | instock | lowstock | outofstock
    const [sortBy, setSortBy] = useState("default");
    const [orderFilter, setOrderFilter] = useState("all"); // all | pending | processing | shipped | delivered | cancelled

    // Modals
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
    const [editingProductId, setEditingProductId] = useState("");
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [newCategoryInput, setNewCategoryInput] = useState("");

    // Form Fields for Add / Edit Product
    const [formName, setFormName] = useState("");
    const [formCategory, setFormCategory] = useState("rings");
    const [formPrice, setFormPrice] = useState("");
    const [formComparePrice, setFormComparePrice] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formImages, setFormImages] = useState(["assets/images/hero-hand.jpg"]);
    const [formVariants, setFormVariants] = useState("");
    const [formStock, setFormStock] = useState("25");
    const [formFeatured, setFormFeatured] = useState(false);
    const [formNewArrival, setFormNewArrival] = useState(false);

    // Form for Coupon
    const [newCouponCode, setNewCouponCode] = useState("");
    const [newCouponType, setNewCouponType] = useState("percentage");
    const [newCouponValue, setNewCouponValue] = useState("");

    // Settings State
    const [settingsState, setSettingsState] = useState(db.getSettings());

    // Inline price edit state: { [productId]: { price, comparePrice } }
    const [inlinePrices, setInlinePrices] = useState({});

    // Live Orders & Customers State
    const [ordersList, setOrdersList] = useState(db.getOrders());
    const [couponsList, setCouponsList] = useState(db.getCoupons());

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    // Re-fetch data on active tab change
    useEffect(() => {
        setOrdersList(db.getOrders());
        setCouponsList(db.getCoupons());
        setSettingsState(db.getSettings());
    }, [activeTab]);

    // Handle Admin Login
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        login(adminId, password);
    };

    // Quick Admin Login
    const handleQuickAdminLogin = () => {
        if (directAdminLogin) {
            directAdminLogin();
        } else {
            login("admin", "admin123");
        }
    };

    // If not authenticated as admin, show Zepio-styled secured login view
    if (!user || user.role !== "admin") {
        return html`
            <div style="min-height: 100vh; background: #0f172a; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="width: 100%; max-width: 420px; background: #ffffff; border-radius: 14px; padding: 36px 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); text-align: center;">
                    <div style="width: 52px; height: 52px; margin: 0 auto 16px; border-radius: 12px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);">
                        <i data-lucide="shield-check" style="width: 26px; height: 26px;"></i>
                    </div>

                    <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; letter-spacing: -0.02em;">
                        ZEPIO ADMIN PORTAL
                    </h2>
                    <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 24px;">
                        Sign in to manage ACCESSIFY store products, orders & settings.
                    </p>

                    <form onSubmit=${handleLoginSubmit} style="text-align: left;">
                        <div style="margin-bottom: 16px;">
                            <label style="font-size: 0.8rem; font-weight: 600; color: #334155; display: block; margin-bottom: 6px;">Admin ID</label>
                            <input 
                                type="text" 
                                class="zepio-input" 
                                placeholder="Enter Admin ID (e.g. admin)"
                                value=${adminId} 
                                onInput=${e => setAdminId(e.target.value)} 
                                required 
                                autocomplete="username"
                            />
                        </div>

                        <div style="margin-bottom: 22px;">
                            <label style="font-size: 0.8rem; font-weight: 600; color: #334155; display: block; margin-bottom: 6px;">Password</label>
                            <input 
                                type="password" 
                                class="zepio-input" 
                                placeholder="Enter Password"
                                value=${password} 
                                onInput=${e => setPassword(e.target.value)} 
                                required 
                                autocomplete="current-password"
                            />
                        </div>

                        <button type="submit" class="zepio-btn zepio-btn-primary" style="width: 100%; padding: 11px; font-weight: 700;">
                            Sign In to Dashboard
                        </button>

                        <button 
                            type="button" 
                            class="zepio-btn zepio-btn-secondary" 
                            style="width: 100%; padding: 9px; margin-top: 10px; font-size: 0.8rem;"
                            onClick=${handleQuickAdminLogin}
                        >
                            <i data-lucide="zap" style="width: 14px; height: 14px; color: #f59e0b;"></i>
                            One-Click Store Owner Access
                        </button>
                    </form>

                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                        <a href="#/" style="font-size: 0.82rem; color: #64748b; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                            <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i>
                            Return to Customer Storefront
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Categories list
    const allCategories = db.getCategories();

    // Derived Statistics
    const totalProductsCount = products.length;
    const totalOrdersCount = ordersList.length;
    const totalRevenue = ordersList.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
    const pendingOrdersCount = ordersList.filter(o => o.status === "pending" || o.status === "processing").length;
    const customersList = db.getCustomers();

    // Filter products for Catalog Tab
    let filteredProducts = [...products];

    if (selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter(p => (p.category || "").toLowerCase() === selectedCategory.toLowerCase());
    }

    if (stockFilter === "instock") {
        filteredProducts = filteredProducts.filter(p => (p.stock || 20) > 5);
    } else if (stockFilter === "lowstock") {
        filteredProducts = filteredProducts.filter(p => (p.stock || 20) > 0 && (p.stock || 20) <= 5);
    } else if (stockFilter === "outofstock") {
        filteredProducts = filteredProducts.filter(p => (p.stock || 20) === 0);
    }

    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(q) || 
            (p.category || "").toLowerCase().includes(q) ||
            (p.sku_code || "").toLowerCase().includes(q)
        );
    }

    // Sorting
    if (sortBy === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Filter Orders
    let filteredOrders = [...ordersList];
    if (orderFilter !== "all") {
        filteredOrders = filteredOrders.filter(o => o.status === orderFilter);
    }

    // Open Add Modal
    const openAddProductModal = () => {
        setModalMode("add");
        setEditingProductId("");
        setFormName("");
        setFormCategory(allCategories[0] || "chains");
        setFormPrice("");
        setFormComparePrice("");
        setFormDescription("");
        setFormImages(["assets/images/hero-hand.jpg"]);
        setFormVariants("Standard, Size 7, Size 8, Size 9");
        setFormStock("25");
        setFormFeatured(false);
        setFormNewArrival(true);
        setIsProductModalOpen(true);
    };

    // Open Edit Modal
    const openEditProductModal = (product) => {
        setModalMode("edit");
        setEditingProductId(product.id);
        setFormName(product.name || "");
        setFormCategory(product.category || "chains");
        setFormPrice(String(product.price || ""));
        setFormComparePrice(String(product.comparePrice || product.price || ""));
        setFormDescription(product.description || "");
        setFormImages(product.images && product.images.length > 0 ? [...product.images] : ["assets/images/hero-hand.jpg"]);
        setFormVariants(Array.isArray(product.variants) ? product.variants.join(", ") : "Standard");
        setFormStock(String(product.stock !== undefined ? product.stock : 20));
        setFormFeatured(Boolean(product.featured));
        setFormNewArrival(Boolean(product.newArrival));
        setIsProductModalOpen(true);
    };

    // Save Product
    const handleSaveProduct = (e) => {
        e.preventDefault();
        if (!formName.trim()) {
            showToast("Product name is required.");
            return;
        }
        if (!formPrice || Number(formPrice) <= 0) {
            showToast("Valid price is required.");
            return;
        }

        const validImages = formImages.filter(img => img && img.trim());

        const productData = {
            id: modalMode === "edit" ? editingProductId : `acc_custom_${Date.now()}`,
            name: formName.trim(),
            category: formCategory,
            price: parseFloat(formPrice),
            comparePrice: formComparePrice ? parseFloat(formComparePrice) : parseFloat(formPrice),
            description: formDescription.trim(),
            images: validImages.length > 0 ? validImages : ["assets/images/hero-hand.jpg"],
            variants: formVariants.split(",").map(v => v.trim()).filter(Boolean),
            stock: parseInt(formStock, 10) || 20,
            featured: formFeatured,
            newArrival: formNewArrival,
            rating: 4.8,
            numReviews: 12
        };

        db.saveProduct(productData);
        refreshData();
        setIsProductModalOpen(false);
        showToast(modalMode === "edit" ? "Product updated successfully!" : "New product created successfully!");
    };

    // Delete Product
    const handleDeleteProduct = (product) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}"?`);
        if (confirmDelete) {
            db.deleteProduct(product.id);
            refreshData();
            showToast(`Deleted ${product.name}`);
        }
    };

    // Inline Price Edit Handlers
    const handleInlinePriceChange = (productId, field, value) => {
        setInlinePrices(prev => ({
            ...prev,
            [productId]: {
                ...(prev[productId] || {}),
                [field]: value
            }
        }));
    };

    const handleSaveInlinePrice = (product) => {
        const edits = inlinePrices[product.id];
        if (!edits) return;

        const newPrice = edits.price !== undefined ? parseFloat(edits.price) : product.price;
        const newComparePrice = edits.comparePrice !== undefined ? parseFloat(edits.comparePrice) : product.comparePrice;

        if (isNaN(newPrice) || newPrice <= 0) {
            showToast("Please enter a valid price greater than 0.");
            return;
        }

        db.saveProduct({
            ...product,
            price: newPrice,
            comparePrice: isNaN(newComparePrice) ? newPrice : newComparePrice
        });

        refreshData();
        showToast(`Updated price for ${product.name}`);

        setInlinePrices(prev => {
            const copy = { ...prev };
            delete copy[product.id];
            return copy;
        });
    };

    // Image fields helpers
    const handleAddImageField = () => setFormImages(prev => [...prev, ""]);
    const handleImageChange = (index, value) => {
        setFormImages(prev => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };
    const handleRemoveImageField = (index) => setFormImages(prev => prev.filter((_, i) => i !== index));

    // Category Creation
    const handleCreateCategory = (e) => {
        e.preventDefault();
        if (!newCategoryInput.trim()) return;
        const slug = db.addCategory(newCategoryInput);
        if (slug) {
            showToast(`Category "${slug}" added.`);
            setNewCategoryInput("");
            setIsCategoryModalOpen(false);
            refreshData();
        }
    };

    // Order Status Update
    const handleUpdateOrderStatus = (orderId, newStatus) => {
        db.updateOrderStatus(orderId, newStatus);
        setOrdersList(db.getOrders());
        showToast(`Order ${orderId} marked as ${newStatus}.`);
    };

    // Send WhatsApp Message to Order Customer
    const handleCustomerWhatsApp = (order) => {
        const phone = order.customer && order.customer.phone ? String(order.customer.phone).replace(/[^0-9]/g, "") : "";
        if (!phone) {
            showToast("Customer phone number not available.");
            return;
        }
        const message = `Hello ${order.customer.name}! This is ACCESSIFY regarding your order #${order.id}. Current status: ${order.status.toUpperCase()}. Total: ₹${order.total}. Thank you for shopping with us!`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    };

    // Add Coupon
    const handleCreateCoupon = (e) => {
        e.preventDefault();
        if (!newCouponCode.trim() || !newCouponValue) return;
        db.saveCoupon({
            code: newCouponCode.trim().toUpperCase(),
            type: newCouponType,
            value: Number(newCouponValue),
            active: true
        });
        setCouponsList(db.getCoupons());
        setNewCouponCode("");
        setNewCouponValue("");
        setIsCouponModalOpen(false);
        showToast("Coupon created successfully!");
    };

    const handleDeleteCoupon = (code) => {
        if (window.confirm(`Delete coupon ${code}?`)) {
            db.deleteCoupon(code);
            setCouponsList(db.getCoupons());
            showToast(`Coupon ${code} deleted.`);
        }
    };

    // Save Settings
    const handleSaveSettings = (e) => {
        e.preventDefault();
        const updated = db.updateSettings(settingsState);
        setSettingsState(updated);
        showToast("Store settings saved successfully!");
    };

    // Download JSON export
    const handleDownloadJson = () => {
        try {
            const dataStr = db.exportProductsJson();
            const blob = new Blob([dataStr], { type: "application/json;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", url);
            dlAnchorElem.setAttribute("download", `accessify_products_catalog.json`);
            document.body.appendChild(dlAnchorElem);
            dlAnchorElem.click();
            document.body.removeChild(dlAnchorElem);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            showToast(`Downloaded catalog JSON (${products.length} products).`);
        } catch (err) {
            showToast("Download failed: " + err.message);
        }
    };

    // Reset Catalog
    const handleResetCatalog = () => {
        if (window.confirm("Reset all products back to the original 205 authentic products? Any customized changes will be replaced.")) {
            db.resetToDefaultProducts();
            refreshData();
            showToast("Catalog reset to original 205 products.");
        }
    };

    // Format Helpers
    const getStatusBadge = (status) => {
        switch (status) {
            case "delivered": return html`<span class="zepio-badge zepio-badge-success">Delivered</span>`;
            case "shipped": return html`<span class="zepio-badge zepio-badge-purple">Shipped</span>`;
            case "processing": return html`<span class="zepio-badge zepio-badge-blue">Processing</span>`;
            case "pending": return html`<span class="zepio-badge zepio-badge-warning">Pending</span>`;
            case "cancelled": return html`<span class="zepio-badge zepio-badge-danger">Cancelled</span>`;
            default: return html`<span class="zepio-badge zepio-badge-gray">${status}</span>`;
        }
    };

    return html`
        <div class="zepio-admin-wrapper">
            <!-- Mobile Sidebar Overlay -->
            ${mobileMenuOpen && html`
                <div class="zepio-sidebar-overlay" onClick=${() => setMobileMenuOpen(false)}></div>
            `}

            <!-- 1. ZEPIO LEFT VERTICAL SIDEBAR -->
            <aside class="zepio-sidebar ${mobileMenuOpen ? 'open' : ''}">
                <div class="zepio-sidebar-header">
                    <div class="zepio-brand-info">
                        <div class="zepio-brand-icon">A</div>
                        <div>
                            <h3 class="zepio-brand-title">ACCESSIFY</h3>
                            <div class="zepio-brand-sub">
                                <span class="zepio-status-dot"></span>
                                Store Online (Zepio)
                            </div>
                        </div>
                    </div>
                </div>

                <nav class="zepio-sidebar-nav">
                    <div class="zepio-nav-section-title">Main</div>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'dashboard' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i data-lucide="layout-dashboard" class="zepio-nav-icon"></i>
                            <span>Mission Control</span>
                        </div>
                    </button>

                    <div class="zepio-nav-section-title">Catalog</div>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'products' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('products'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i data-lucide="package" class="zepio-nav-icon"></i>
                            <span>Products</span>
                        </div>
                        <span class="zepio-nav-badge">${totalProductsCount}</span>
                    </button>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'categories' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i data-lucide="folder-tree" class="zepio-nav-icon"></i>
                            <span>Categories</span>
                        </div>
                        <span class="zepio-nav-badge">${allCategories.length}</span>
                    </button>

                    <div class="zepio-nav-section-title">Operations</div>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'orders' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i data-lucide="shopping-cart" class="zepio-nav-icon"></i>
                            <span>Orders</span>
                        </div>
                        ${pendingOrdersCount > 0 && html`
                            <span class="zepio-nav-badge" style="background-color: #f59e0b;">${pendingOrdersCount}</span>
                        `}
                    </button>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'customers' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('customers'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i data-lucide="users" class="zepio-nav-icon"></i>
                            <span>Customers</span>
                        </div>
                        <span class="zepio-nav-badge">${customersList.length}</span>
                    </button>

                    <div class="zepio-nav-section-title">Growth & Plugins</div>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'coupons' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('coupons'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i data-lucide="tag" class="zepio-nav-icon"></i>
                            <span>Coupons & Marketing</span>
                        </div>
                        <span class="zepio-nav-badge">${couponsList.length}</span>
                    </button>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'settings' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i data-lucide="settings" class="zepio-nav-icon"></i>
                            <span>Store Settings</span>
                        </div>
                    </button>
                </nav>

                <div class="zepio-sidebar-footer">
                    <a href="#/" class="zepio-sidebar-store-btn" target="_blank" rel="noopener noreferrer">
                        <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                        <span>Visit Online Store</span>
                    </a>
                    <button 
                        type="button" 
                        class="zepio-btn zepio-btn-secondary zepio-btn-sm" 
                        style="width: 100%; border: none; background: transparent; color: #94a3b8;"
                        onClick=${logout}
                    >
                        <i data-lucide="log-out" style="width: 14px; height: 14px;"></i>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <!-- 2. MAIN CONTENT WRAPPER -->
            <div class="zepio-main-content">
                <!-- TOP UTILITY BAR -->
                <header class="zepio-topbar">
                    <div class="zepio-topbar-left">
                        <button 
                            type="button" 
                            class="zepio-mobile-menu-btn" 
                            onClick=${() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            <i data-lucide="menu" style="width: 20px; height: 20px;"></i>
                        </button>
                        <div class="zepio-breadcrumbs">
                            <span>Admin</span>
                            <i data-lucide="chevron-right" style="width: 12px; height: 12px;"></i>
                            <span class="zepio-breadcrumb-active" style="text-transform: capitalize;">${activeTab}</span>
                        </div>
                    </div>

                    <div class="zepio-topbar-right">
                        <div class="zepio-topbar-search">
                            <i data-lucide="search" class="zepio-topbar-search-icon"></i>
                            <input 
                                type="text" 
                                placeholder="Search products, orders..."
                                value=${searchQuery}
                                onInput=${e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <a href="#/" class="zepio-btn zepio-btn-secondary zepio-btn-sm">
                            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                            <span>View Store</span>
                        </a>

                        <div class="zepio-user-profile">
                            <div class="zepio-avatar">A</div>
                            <span class="zepio-user-role">Admin</span>
                        </div>
                    </div>
                </header>

                <!-- 3. DYNAMIC CONTENT CANVAS -->
                <main class="zepio-content-body">
                    
                    <!-- TAB 1: MISSION CONTROL / DASHBOARD -->
                    ${activeTab === 'dashboard' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Mission Control</h1>
                                    <p class="zepio-page-subtitle">Real-time overview of sales, active jewelry inventory & customer orders.</p>
                                </div>
                                <div class="zepio-page-actions">
                                    <button type="button" class="zepio-btn zepio-btn-primary" onClick=${openAddProductModal}>
                                        <i data-lucide="plus-circle" style="width: 15px; height: 15px;"></i>
                                        <span>Add Product</span>
                                    </button>
                                </div>
                            </div>

                            <!-- 4 Real-time KPI Stats -->
                            <div class="zepio-stats-grid">
                                <div class="zepio-stat-card">
                                    <div>
                                        <div class="zepio-stat-label">Total Revenue</div>
                                        <div class="zepio-stat-value">₹${totalRevenue.toLocaleString()}</div>
                                        <div class="zepio-stat-sub" style="color: #10b981;">
                                            <i data-lucide="trending-up" style="width: 12px; height: 12px;"></i>
                                            <span>+18.4% this month</span>
                                        </div>
                                    </div>
                                    <div class="zepio-stat-icon-wrap green">
                                        <i data-lucide="indian-rupee" style="width: 22px; height: 22px;"></i>
                                    </div>
                                </div>

                                <div class="zepio-stat-card">
                                    <div>
                                        <div class="zepio-stat-label">Total Orders</div>
                                        <div class="zepio-stat-value">${totalOrdersCount}</div>
                                        <div class="zepio-stat-sub">
                                            <span>${pendingOrdersCount} pending processing</span>
                                        </div>
                                    </div>
                                    <div class="zepio-stat-icon-wrap blue">
                                        <i data-lucide="shopping-bag" style="width: 22px; height: 22px;"></i>
                                    </div>
                                </div>

                                <div class="zepio-stat-card">
                                    <div>
                                        <div class="zepio-stat-label">Active Products</div>
                                        <div class="zepio-stat-value">${totalProductsCount}</div>
                                        <div class="zepio-stat-sub">
                                            <span>across ${allCategories.length} categories</span>
                                        </div>
                                    </div>
                                    <div class="zepio-stat-icon-wrap purple">
                                        <i data-lucide="package" style="width: 22px; height: 22px;"></i>
                                    </div>
                                </div>

                                <div class="zepio-stat-card">
                                    <div>
                                        <div class="zepio-stat-label">Average Order Value</div>
                                        <div class="zepio-stat-value">₹${avgOrderValue.toLocaleString()}</div>
                                        <div class="zepio-stat-sub">
                                            <span>based on recent sales</span>
                                        </div>
                                    </div>
                                    <div class="zepio-stat-icon-wrap amber">
                                        <i data-lucide="award" style="width: 22px; height: 22px;"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Recent Orders Table -->
                            <div class="zepio-card">
                                <div class="zepio-card-header">
                                    <h3 class="zepio-card-title">Recent Store Orders</h3>
                                    <button 
                                        type="button" 
                                        class="zepio-btn zepio-btn-secondary zepio-btn-sm"
                                        onClick=${() => setActiveTab('orders')}
                                    >
                                        View All Orders →
                                    </button>
                                </div>
                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Payment</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${ordersList.slice(0, 5).map(order => html`
                                                <tr key=${order.id}>
                                                    <td style="font-weight: 700; color: #2563eb;">#${order.id}</td>
                                                    <td>
                                                        <div style="font-weight: 600;">${order.customer?.name || 'Customer'}</div>
                                                        <div style="font-size: 0.72rem; color: #64748b;">${order.customer?.phone || ''}</div>
                                                    </td>
                                                    <td>${order.items?.length || 1} item(s)</td>
                                                    <td style="font-weight: 700;">₹${order.total}</td>
                                                    <td><span class="zepio-badge zepio-badge-gray">${order.paymentMethod || 'COD'}</span></td>
                                                    <td>${getStatusBadge(order.status)}</td>
                                                    <td>
                                                        <button 
                                                            type="button" 
                                                            class="zepio-btn zepio-btn-success zepio-btn-sm"
                                                            title="Chat with customer on WhatsApp"
                                                            onClick=${() => handleCustomerWhatsApp(order)}
                                                        >
                                                            <i data-lucide="message-circle" style="width: 13px; height: 13px;"></i>
                                                            WhatsApp
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

                    <!-- TAB 2: PRODUCTS CATALOG -->
                    ${activeTab === 'products' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Products Catalog</h1>
                                    <p class="zepio-page-subtitle">Showing ${filteredProducts.length} of ${products.length} streetwear & gothic jewelry pieces.</p>
                                </div>
                                <div class="zepio-page-actions">
                                    <button type="button" class="zepio-btn zepio-btn-secondary" onClick=${handleDownloadJson}>
                                        <i data-lucide="download" style="width: 15px; height: 15px;"></i>
                                        <span>Export JSON</span>
                                    </button>
                                    <button type="button" class="zepio-btn zepio-btn-primary" onClick=${openAddProductModal}>
                                        <i data-lucide="plus-circle" style="width: 15px; height: 15px;"></i>
                                        <span>Add Product</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Filter & Search Toolbar -->
                            <div class="zepio-card" style="margin-bottom: 16px;">
                                <div class="zepio-filter-bar">
                                    <div class="zepio-filter-group">
                                        <select 
                                            class="zepio-select" 
                                            value=${selectedCategory} 
                                            onChange=${e => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="all">All Categories (${products.length})</option>
                                            ${allCategories.map(cat => html`
                                                <option key=${cat} value=${cat}>${cat.toUpperCase()}</option>
                                            `)}
                                        </select>

                                        <select 
                                            class="zepio-select" 
                                            value=${stockFilter} 
                                            onChange=${e => setStockFilter(e.target.value)}
                                        >
                                            <option value="all">All Stock Status</option>
                                            <option value="instock">In Stock (>5)</option>
                                            <option value="lowstock">Low Stock (1-5)</option>
                                            <option value="outofstock">Out of Stock (0)</option>
                                        </select>

                                        <select 
                                            class="zepio-select" 
                                            value=${sortBy} 
                                            onChange=${e => setSortBy(e.target.value)}
                                        >
                                            <option value="default">Default Order</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="name">Name (A-Z)</option>
                                        </select>
                                    </div>

                                    <div style="font-size: 0.8rem; color: #64748b;">
                                        Tip: Edit price directly in the table and click <strong>Save</strong>.
                                    </div>
                                </div>

                                <!-- Product Table -->
                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Price (₹)</th>
                                                <th>Compare Price (₹)</th>
                                                <th>Stock</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${filteredProducts.slice(0, 100).map(product => {
                                                const editedPrice = inlinePrices[product.id]?.price !== undefined 
                                                    ? inlinePrices[product.id].price 
                                                    : product.price;
                                                const editedCompare = inlinePrices[product.id]?.comparePrice !== undefined 
                                                    ? inlinePrices[product.id].comparePrice 
                                                    : (product.comparePrice || product.price);
                                                const isEdited = inlinePrices[product.id] !== undefined;

                                                const stockVal = product.stock !== undefined ? product.stock : 20;

                                                return html`
                                                    <tr key=${product.id}>
                                                        <td>
                                                            <div class="zepio-product-cell">
                                                                <img 
                                                                    src=${product.images && product.images[0] ? product.images[0] : 'assets/images/hero-hand.jpg'} 
                                                                    alt=${product.name} 
                                                                    class="zepio-product-thumb"
                                                                    loading="lazy"
                                                                />
                                                                <div>
                                                                    <span class="zepio-product-name">${product.name}</span>
                                                                    <div class="zepio-product-meta">ID: ${product.id} ${product.featured ? '• ✦ Featured' : ''}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span class="zepio-badge zepio-badge-blue" style="text-transform: uppercase;">
                                                                ${product.category || 'General'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div class="zepio-inline-price-box">
                                                                <span>₹</span>
                                                                <input 
                                                                    type="number" 
                                                                    class="zepio-inline-input"
                                                                    value=${editedPrice}
                                                                    onInput=${e => handleInlinePriceChange(product.id, 'price', e.target.value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="zepio-inline-price-box">
                                                                <span>₹</span>
                                                                <input 
                                                                    type="number" 
                                                                    class="zepio-inline-input"
                                                                    value=${editedCompare}
                                                                    onInput=${e => handleInlinePriceChange(product.id, 'comparePrice', e.target.value)}
                                                                />
                                                                ${isEdited && html`
                                                                    <button 
                                                                        type="button" 
                                                                        class="zepio-btn zepio-btn-primary zepio-btn-sm"
                                                                        style="padding: 3px 8px; font-size: 0.72rem;"
                                                                        onClick=${() => handleSaveInlinePrice(product)}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                `}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            ${stockVal > 5 ? html`
                                                                <span class="zepio-badge zepio-badge-success">${stockVal} In Stock</span>
                                                            ` : stockVal > 0 ? html`
                                                                <span class="zepio-badge zepio-badge-warning">${stockVal} Low Stock</span>
                                                            ` : html`
                                                                <span class="zepio-badge zepio-badge-danger">Out of Stock</span>
                                                            `}
                                                        </td>
                                                        <td>
                                                            <span class="zepio-badge zepio-badge-success">Active</span>
                                                        </td>
                                                        <td>
                                                            <div style="display: flex; align-items: center; gap: 6px;">
                                                                <button 
                                                                    type="button" 
                                                                    class="zepio-btn zepio-btn-secondary zepio-btn-sm"
                                                                    onClick=${() => openEditProductModal(product)}
                                                                    title="Edit Product"
                                                                >
                                                                    <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i>
                                                                </button>
                                                                <a 
                                                                    href="#/product/${product.id}" 
                                                                    target="_blank" 
                                                                    class="zepio-btn zepio-btn-secondary zepio-btn-sm"
                                                                    title="View in Store"
                                                                >
                                                                    <i data-lucide="eye" style="width: 13px; height: 13px;"></i>
                                                                </a>
                                                                <button 
                                                                    type="button" 
                                                                    class="zepio-btn zepio-btn-danger zepio-btn-sm"
                                                                    onClick=${() => handleDeleteProduct(product)}
                                                                    title="Delete Product"
                                                                >
                                                                    <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                `;
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `}

                    <!-- TAB 3: CATEGORIES CATALOG -->
                    ${activeTab === 'categories' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Categories Management</h1>
                                    <p class="zepio-page-subtitle">Organize your store collections and navigation cards.</p>
                                </div>
                                <div class="zepio-page-actions">
                                    <button type="button" class="zepio-btn zepio-btn-primary" onClick=${() => setIsCategoryModalOpen(true)}>
                                        <i data-lucide="plus-circle" style="width: 15px; height: 15px;"></i>
                                        <span>Add Category</span>
                                    </button>
                                </div>
                            </div>

                            <div class="zepio-cat-grid">
                                ${allCategories.map(cat => {
                                    const count = products.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase()).length;
                                    let img = `assets/images/category-${cat}.jpg`;
                                    if (cat === "sleek-chains") img = "assets/images/sleek-chains.jpg";
                                    if (cat === "y2k-gothic-necklaces") img = "assets/images/category-gothic.jpg";
                                    if (cat === "iced-out-jewels") img = "assets/images/category-iced-out.jpg";

                                    return html`
                                        <div class="zepio-cat-card" key=${cat}>
                                            <img 
                                                src=${img} 
                                                alt=${cat} 
                                                class="zepio-cat-thumb"
                                                onError=${(e) => { e.target.src = 'assets/images/hero-hand.jpg'; }}
                                            />
                                            <div class="zepio-cat-info">
                                                <div>
                                                    <div class="zepio-cat-name">${cat.replace(/-/g, ' ')}</div>
                                                    <div class="zepio-cat-count">${count} items in catalog</div>
                                                </div>
                                                <a href="#/shop?category=${cat}" target="_blank" class="zepio-btn zepio-btn-secondary zepio-btn-sm">
                                                    View
                                                </a>
                                            </div>
                                        </div>
                                    `;
                                })}
                            </div>
                        </div>
                    `}

                    <!-- TAB 4: ORDERS PIPELINE -->
                    ${activeTab === 'orders' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Orders Management</h1>
                                    <p class="zepio-page-subtitle">Track incoming orders, update shipping progress, and contact customers on WhatsApp.</p>
                                </div>
                            </div>

                            <!-- Order Status Tabs -->
                            <div class="zepio-tabs-header">
                                <button class="zepio-tab-button ${orderFilter === 'all' ? 'active' : ''}" onClick=${() => setOrderFilter('all')}>
                                    All Orders (${ordersList.length})
                                </button>
                                <button class="zepio-tab-button ${orderFilter === 'pending' ? 'active' : ''}" onClick=${() => setOrderFilter('pending')}>
                                    Pending (${ordersList.filter(o => o.status === 'pending').length})
                                </button>
                                <button class="zepio-tab-button ${orderFilter === 'processing' ? 'active' : ''}" onClick=${() => setOrderFilter('processing')}>
                                    Processing (${ordersList.filter(o => o.status === 'processing').length})
                                </button>
                                <button class="zepio-tab-button ${orderFilter === 'shipped' ? 'active' : ''}" onClick=${() => setOrderFilter('shipped')}>
                                    Shipped (${ordersList.filter(o => o.status === 'shipped').length})
                                </button>
                                <button class="zepio-tab-button ${orderFilter === 'delivered' ? 'active' : ''}" onClick=${() => setOrderFilter('delivered')}>
                                    Delivered (${ordersList.filter(o => o.status === 'delivered').length})
                                </button>
                            </div>

                            <!-- Orders Table -->
                            <div class="zepio-card">
                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Order</th>
                                                <th>Date</th>
                                                <th>Customer Info</th>
                                                <th>Items Ordered</th>
                                                <th>Amount</th>
                                                <th>Update Status</th>
                                                <th>WhatsApp Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${filteredOrders.map(order => html`
                                                <tr key=${order.id}>
                                                    <td>
                                                        <div style="font-weight: 700; color: #2563eb;">#${order.id}</div>
                                                        <div style="font-size: 0.72rem; color: #64748b;">${order.paymentMethod || 'COD'}</div>
                                                    </td>
                                                    <td style="font-size: 0.76rem; color: #64748b; white-space: nowrap;">
                                                        ${new Date(order.date).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <div style="font-weight: 600;">${order.customer?.name || 'Customer'}</div>
                                                        <div style="font-size: 0.74rem; color: #64748b;">${order.customer?.phone || ''}</div>
                                                        <div style="font-size: 0.72rem; color: #94a3b8; max-width: 220px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                                                            ${order.customer?.address || ''}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style="display: flex; flex-direction: column; gap: 4px;">
                                                            ${(order.items || []).map(item => html`
                                                                <div style="font-size: 0.76rem; display: flex; align-items: center; gap: 6px;">
                                                                    <span style="font-weight: 600;">${item.quantity}x</span>
                                                                    <span>${item.name}</span>
                                                                </div>
                                                            `)}
                                                        </div>
                                                    </td>
                                                    <td style="font-weight: 800; font-size: 0.95rem;">
                                                        ₹${order.total}
                                                    </td>
                                                    <td>
                                                        <select 
                                                            class="zepio-select" 
                                                            style="font-size: 0.76rem; padding: 4px 8px;"
                                                            value=${order.status}
                                                            onChange=${e => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            type="button" 
                                                            class="zepio-btn zepio-btn-success zepio-btn-sm"
                                                            onClick=${() => handleCustomerWhatsApp(order)}
                                                        >
                                                            <i data-lucide="message-circle" style="width: 14px; height: 14px;"></i>
                                                            Notify on WhatsApp
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

                    <!-- TAB 5: CUSTOMERS DIRECTORY -->
                    ${activeTab === 'customers' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Customer Directory</h1>
                                    <p class="zepio-page-subtitle">View repeat buyers, customer spending history & contact channels.</p>
                                </div>
                            </div>

                            <div class="zepio-card">
                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Customer</th>
                                                <th>Contact</th>
                                                <th>Orders Placed</th>
                                                <th>Total Spent</th>
                                                <th>Last Active</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${customersList.map(c => html`
                                                <tr key=${c.id}>
                                                    <td>
                                                        <div style="display: flex; align-items: center; gap: 10px;">
                                                            <div class="zepio-avatar" style="background: #e2e8f0; color: #334155; font-size: 0.8rem;">
                                                                ${(c.name || 'C').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div style="font-weight: 600;">${c.name}</div>
                                                                <div style="font-size: 0.72rem; color: #64748b;">${c.address}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style="font-weight: 500;">${c.phone}</div>
                                                        <div style="font-size: 0.72rem; color: #64748b;">${c.email}</div>
                                                    </td>
                                                    <td>
                                                        <span class="zepio-badge zepio-badge-blue">${c.orderCount} Orders</span>
                                                    </td>
                                                    <td style="font-weight: 700; color: #0f172a;">
                                                        ₹${c.totalSpent.toLocaleString()}
                                                    </td>
                                                    <td style="font-size: 0.76rem; color: #64748b;">
                                                        ${new Date(c.lastOrderDate).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <a 
                                                            href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)}!%20Greetings%20from%20ACCESSIFY." 
                                                            target="_blank" 
                                                            class="zepio-btn zepio-btn-success zepio-btn-sm"
                                                        >
                                                            <i data-lucide="message-circle" style="width: 13px; height: 13px;"></i>
                                                            WhatsApp
                                                        </a>
                                                    </td>
                                                </tr>
                                            `)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `}

                    <!-- TAB 6: COUPONS & MARKETING -->
                    ${activeTab === 'coupons' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Marketing & Coupons</h1>
                                    <p class="zepio-page-subtitle">Create discount codes, flash sale promo codes, and special incentives.</p>
                                </div>
                                <div class="zepio-page-actions">
                                    <button type="button" class="zepio-btn zepio-btn-primary" onClick=${() => setIsCouponModalOpen(true)}>
                                        <i data-lucide="plus-circle" style="width: 15px; height: 15px;"></i>
                                        <span>Create Coupon</span>
                                    </button>
                                </div>
                            </div>

                            <div class="zepio-card">
                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Coupon Code</th>
                                                <th>Discount Type</th>
                                                <th>Value</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${couponsList.map(coupon => html`
                                                <tr key=${coupon.code}>
                                                    <td>
                                                        <span style="font-family: monospace; font-weight: 700; font-size: 0.95rem; background: #f1f5f9; padding: 3px 8px; border-radius: 4px;">
                                                            ${coupon.code}
                                                        </span>
                                                    </td>
                                                    <td style="text-transform: capitalize;">${coupon.type} Discount</td>
                                                    <td style="font-weight: 700; color: #10b981;">
                                                        ${coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                                    </td>
                                                    <td>
                                                        <span class="zepio-badge zepio-badge-success">Active</span>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            type="button" 
                                                            class="zepio-btn zepio-btn-danger zepio-btn-sm"
                                                            onClick=${() => handleDeleteCoupon(coupon.code)}
                                                        >
                                                            Delete
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

                    <!-- TAB 7: STORE SETTINGS -->
                    ${activeTab === 'settings' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Store Configuration</h1>
                                    <p class="zepio-page-subtitle">Manage store branding, WhatsApp order reception, delivery thresholds, and catalog data.</p>
                                </div>
                            </div>

                            <div class="zepio-card">
                                <div class="zepio-card-header">
                                    <h3 class="zepio-card-title">Store Profile & Contacts</h3>
                                </div>
                                <div class="zepio-card-body">
                                    <form onSubmit=${handleSaveSettings}>
                                        <div class="zepio-form-row">
                                            <div class="zepio-form-group">
                                                <label class="zepio-label">Store Brand Name</label>
                                                <input 
                                                    type="text" 
                                                    class="zepio-input" 
                                                    value=${settingsState.storeName}
                                                    onInput=${e => setSettingsState({ ...settingsState, storeName: e.target.value })}
                                                />
                                            </div>
                                            <div class="zepio-form-group">
                                                <label class="zepio-label">Brand Tagline</label>
                                                <input 
                                                    type="text" 
                                                    class="zepio-input" 
                                                    value=${settingsState.storeTagline}
                                                    onInput=${e => setSettingsState({ ...settingsState, storeTagline: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div class="zepio-form-row">
                                            <div class="zepio-form-group">
                                                <label class="zepio-label">Official Order WhatsApp Number (Country Code + Phone)</label>
                                                <input 
                                                    type="text" 
                                                    class="zepio-input" 
                                                    value=${settingsState.whatsappPhone}
                                                    onInput=${e => setSettingsState({ ...settingsState, whatsappPhone: e.target.value })}
                                                />
                                            </div>
                                            <div class="zepio-form-group">
                                                <label class="zepio-label">Support Email Address</label>
                                                <input 
                                                    type="email" 
                                                    class="zepio-input" 
                                                    value=${settingsState.supportEmail}
                                                    onInput=${e => setSettingsState({ ...settingsState, supportEmail: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div class="zepio-form-row">
                                            <div class="zepio-form-group">
                                                <label class="zepio-label">Standard Shipping Fee (₹)</label>
                                                <input 
                                                    type="number" 
                                                    class="zepio-input" 
                                                    value=${settingsState.deliveryFee}
                                                    onInput=${e => setSettingsState({ ...settingsState, deliveryFee: Number(e.target.value) })}
                                                />
                                            </div>
                                            <div class="zepio-form-group">
                                                <label class="zepio-label">Free Delivery Minimum Order (₹)</label>
                                                <input 
                                                    type="number" 
                                                    class="zepio-input" 
                                                    value=${settingsState.freeDeliveryThreshold}
                                                    onInput=${e => setSettingsState({ ...settingsState, freeDeliveryThreshold: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" class="zepio-btn zepio-btn-primary" style="margin-top: 10px;">
                                            Save Settings
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <!-- Database Maintenance & Backup -->
                            <div class="zepio-card">
                                <div class="zepio-card-header">
                                    <h3 class="zepio-card-title">Catalog Backup & Reset</h3>
                                </div>
                                <div class="zepio-card-body">
                                    <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 16px;">
                                        Download a full snapshot of your active catalog JSON, or reset the catalog back to factory default.
                                    </p>
                                    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                                        <button type="button" class="zepio-btn zepio-btn-secondary" onClick=${handleDownloadJson}>
                                            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                                            Download Catalog JSON
                                        </button>
                                        <button type="button" class="zepio-btn zepio-btn-danger" onClick=${handleResetCatalog}>
                                            <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                                            Reset Catalog to Default (205 items)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `}
                </main>
            </div>

            <!-- MODAL: ADD / EDIT PRODUCT (ZEPIO PRODUCT DRAWER) -->
            ${isProductModalOpen && html`
                <div class="zepio-modal-backdrop" onClick=${() => setIsProductModalOpen(false)}>
                    <div class="zepio-modal-dialog" onClick=${e => e.stopPropagation()}>
                        <div class="zepio-modal-header">
                            <h3 class="zepio-modal-title">
                                ${modalMode === 'edit' ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button class="zepio-modal-close" onClick=${() => setIsProductModalOpen(false)}>
                                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                            </button>
                        </div>

                        <form onSubmit=${handleSaveProduct} style="display: flex; flex-direction: column; flex: 1; min-height: 0;">
                            <div class="zepio-modal-body">
                                <div class="zepio-form-group">
                                    <label class="zepio-label">Product Name *</label>
                                    <input 
                                        type="text" 
                                        class="zepio-input" 
                                        placeholder="e.g., Heavyweight Gothic Cross Chain" 
                                        value=${formName} 
                                        onInput=${e => setFormName(e.target.value)} 
                                        required 
                                    />
                                </div>

                                <div class="zepio-form-row">
                                    <div class="zepio-form-group">
                                        <label class="zepio-label">Category *</label>
                                        <select 
                                            class="zepio-select" 
                                            style="width: 100%;"
                                            value=${formCategory} 
                                            onChange=${e => setFormCategory(e.target.value)}
                                        >
                                            ${allCategories.map(cat => html`
                                                <option key=${cat} value=${cat}>${cat.toUpperCase()}</option>
                                            `)}
                                        </select>
                                    </div>

                                    <div class="zepio-form-group">
                                        <label class="zepio-label">Initial Stock Units *</label>
                                        <input 
                                            type="number" 
                                            class="zepio-input" 
                                            value=${formStock} 
                                            onInput=${e => setFormStock(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div class="zepio-form-row">
                                    <div class="zepio-form-group">
                                        <label class="zepio-label">Selling Price (₹) *</label>
                                        <input 
                                            type="number" 
                                            class="zepio-input" 
                                            placeholder="499" 
                                            value=${formPrice} 
                                            onInput=${e => setFormPrice(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div class="zepio-form-group">
                                        <label class="zepio-label">MRP / Compare Price (₹)</label>
                                        <input 
                                            type="number" 
                                            class="zepio-input" 
                                            placeholder="999" 
                                            value=${formComparePrice} 
                                            onInput=${e => setFormComparePrice(e.target.value)} 
                                        />
                                    </div>
                                </div>

                                <div class="zepio-form-group">
                                    <label class="zepio-label">Description</label>
                                    <textarea 
                                        class="zepio-textarea" 
                                        rows="3" 
                                        placeholder="Detailed description, material (316L stainless steel, titanium), finish..."
                                        value=${formDescription} 
                                        onInput=${e => setFormDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div class="zepio-form-group">
                                    <label class="zepio-label">Variants (Comma-separated sizes)</label>
                                    <input 
                                        type="text" 
                                        class="zepio-input" 
                                        placeholder="Standard, Size 7, Size 8, Size 9" 
                                        value=${formVariants} 
                                        onInput=${e => setFormVariants(e.target.value)} 
                                    />
                                </div>

                                <div class="zepio-form-group">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                        <label class="zepio-label" style="margin-bottom: 0;">Product Images (Paths or URLs)</label>
                                        <button 
                                            type="button" 
                                            class="zepio-btn zepio-btn-secondary zepio-btn-sm" 
                                            onClick=${handleAddImageField}
                                        >
                                            + Add Image URL
                                        </button>
                                    </div>
                                    ${formImages.map((img, idx) => html`
                                        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;" key=${idx}>
                                            <input 
                                                type="text" 
                                                class="zepio-input" 
                                                placeholder="assets/images/... or https://..." 
                                                value=${img} 
                                                onInput=${e => handleImageChange(idx, e.target.value)} 
                                            />
                                            ${formImages.length > 1 && html`
                                                <button 
                                                    type="button" 
                                                    class="zepio-btn zepio-btn-danger zepio-btn-sm" 
                                                    onClick=${() => handleRemoveImageField(idx)}
                                                >
                                                    ✕
                                                </button>
                                            `}
                                        </div>
                                    `)}
                                </div>

                                <div style="display: flex; gap: 20px; margin-top: 12px;">
                                    <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; cursor: pointer;">
                                        <input 
                                            type="checkbox" 
                                            checked=${formFeatured} 
                                            onChange=${e => setFormFeatured(e.target.checked)} 
                                        />
                                        <span>Mark as Featured Product</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; cursor: pointer;">
                                        <input 
                                            type="checkbox" 
                                            checked=${formNewArrival} 
                                            onChange=${e => setFormNewArrival(e.target.checked)} 
                                        />
                                        <span>Mark as New Arrival</span>
                                    </label>
                                </div>
                            </div>

                            <div class="zepio-modal-footer">
                                <button type="button" class="zepio-btn zepio-btn-secondary" onClick=${() => setIsProductModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" class="zepio-btn zepio-btn-primary">
                                    ${modalMode === 'edit' ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `}

            <!-- MODAL: ADD CATEGORY -->
            ${isCategoryModalOpen && html`
                <div class="zepio-modal-backdrop" onClick=${() => setIsCategoryModalOpen(false)}>
                    <div class="zepio-modal-dialog" style="max-width: 440px;" onClick=${e => e.stopPropagation()}>
                        <div class="zepio-modal-header">
                            <h3 class="zepio-modal-title">Add Category</h3>
                            <button class="zepio-modal-close" onClick=${() => setIsCategoryModalOpen(false)}>
                                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                            </button>
                        </div>
                        <form onSubmit=${handleCreateCategory}>
                            <div class="zepio-modal-body">
                                <div class="zepio-form-group">
                                    <label class="zepio-label">Category Name</label>
                                    <input 
                                        type="text" 
                                        class="zepio-input" 
                                        placeholder="e.g., Pendants or Sunglasses" 
                                        value=${newCategoryInput} 
                                        onInput=${e => setNewCategoryInput(e.target.value)} 
                                        required 
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div class="zepio-modal-footer">
                                <button type="button" class="zepio-btn zepio-btn-secondary" onClick=${() => setIsCategoryModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" class="zepio-btn zepio-btn-primary">
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `}

            <!-- MODAL: CREATE COUPON -->
            ${isCouponModalOpen && html`
                <div class="zepio-modal-backdrop" onClick=${() => setIsCouponModalOpen(false)}>
                    <div class="zepio-modal-dialog" style="max-width: 440px;" onClick=${e => e.stopPropagation()}>
                        <div class="zepio-modal-header">
                            <h3 class="zepio-modal-title">Create Promo Coupon</h3>
                            <button class="zepio-modal-close" onClick=${() => setIsCouponModalOpen(false)}>
                                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                            </button>
                        </div>
                        <form onSubmit=${handleCreateCoupon}>
                            <div class="zepio-modal-body">
                                <div class="zepio-form-group">
                                    <label class="zepio-label">Coupon Code (e.g., SALE20)</label>
                                    <input 
                                        type="text" 
                                        class="zepio-input" 
                                        placeholder="CODE" 
                                        value=${newCouponCode} 
                                        onInput=${e => setNewCouponCode(e.target.value.toUpperCase())} 
                                        required 
                                        autoFocus
                                    />
                                </div>
                                <div class="zepio-form-group">
                                    <label class="zepio-label">Discount Type</label>
                                    <select 
                                        class="zepio-select" 
                                        style="width: 100%;"
                                        value=${newCouponType}
                                        onChange=${e => setNewCouponType(e.target.value)}
                                    >
                                        <option value="percentage">Percentage Discount (%)</option>
                                        <option value="flat">Flat Discount (₹)</option>
                                    </select>
                                </div>
                                <div class="zepio-form-group">
                                    <label class="zepio-label">Discount Value</label>
                                    <input 
                                        type="number" 
                                        class="zepio-input" 
                                        placeholder="e.g. 15 or 100" 
                                        value=${newCouponValue} 
                                        onInput=${e => setNewCouponValue(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div class="zepio-modal-footer">
                                <button type="button" class="zepio-btn zepio-btn-secondary" onClick=${() => setIsCouponModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" class="zepio-btn zepio-btn-primary">
                                    Create Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `}
        </div>
    `;
};
