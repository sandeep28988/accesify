import { h } from 'https://esm.sh/preact@10.19.3';
import { useContext, useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { AppContext } from '../context/AppContext.js';
import { db } from '../services/db.js';

const html = htm.bind(h);

// In-browser client-side image compression & optimization helper
const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 900;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Clean compressed JPEG data URL (~50-80KB)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                resolve(dataUrl);
            };
            img.onerror = () => reject(new Error("Failed to process image file"));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error("Failed to read file from device"));
        reader.readAsDataURL(file);
    });
};

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
    const [activeTab, setActiveTab] = useState("staff"); // staff | products | categories | orders | inventory | customers | discounts | settings
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [storeOpen, setStoreOpen] = useState(true);
    const [dateRange, setDateRange] = useState("this-month"); // today | yesterday | 7d | 30d | this-month | all

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
    const [formCategory, setFormCategory] = useState("chains");
    const [formPrice, setFormPrice] = useState("");
    const [formComparePrice, setFormComparePrice] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formImages, setFormImages] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInputValue, setUrlInputValue] = useState("");
    const [formVariants, setFormVariants] = useState("");
    const [formStock, setFormStock] = useState("25");
    const [formSku, setFormSku] = useState("");
    const [formStatus, setFormStatus] = useState("active");
    const [formTags, setFormTags] = useState("");
    const [formFeatured, setFormFeatured] = useState(false);
    const [formNewArrival, setFormNewArrival] = useState(false);
    const [isSavingProduct, setIsSavingProduct] = useState(false);

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
            <div style="min-height: 100vh; background: #111827; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="width: 100%; max-width: 420px; background: #ffffff; border-radius: 14px; padding: 36px 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); text-align: center;">
                    <div style="width: 52px; height: 52px; margin: 0 auto 16px; border-radius: 12px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);">
                        <i class="ri-shield-check-line" style="font-size: 26px;"></i>
                    </div>

                    <h2 style="font-size: 1.35rem; font-weight: 800; color: #111827; margin-bottom: 4px; letter-spacing: -0.02em;">
                        ACCESSIFY ADMIN
                    </h2>
                    <p style="font-size: 0.82rem; color: #6b7280; margin-bottom: 24px;">
                        Sign in to access staff dashboard, catalog & orders.
                    </p>

                    <form onSubmit=${handleLoginSubmit} style="text-align: left;">
                        <div style="margin-bottom: 16px;">
                            <label style="font-size: 0.8rem; font-weight: 600; color: #374151; display: block; margin-bottom: 6px;">Staff ID / Email</label>
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
                            <label style="font-size: 0.8rem; font-weight: 600; color: #374151; display: block; margin-bottom: 6px;">Password</label>
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
                            Sign In to Staff Panel
                        </button>

                        <button 
                            type="button" 
                            class="zepio-btn zepio-btn-secondary" 
                            style="width: 100%; padding: 9px; margin-top: 10px; font-size: 0.8rem;"
                            onClick=${handleQuickAdminLogin}
                        >
                            <i class="ri-flashlight-line" style="color: #f59e0b;"></i>
                            One-Click Store Staff Access
                        </button>
                    </form>

                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                        <a href="#/" style="font-size: 0.82rem; color: #6b7280; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                            <i class="ri-arrow-left-line"></i>
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

    // Pipeline Counts (Nu)
    const pipelineCounts = {
        placed: ordersList.filter(o => o.status === "pending").length,
        processing: ordersList.filter(o => o.status === "processing").length,
        ready: 0,
        shipped: ordersList.filter(o => o.status === "shipped").length,
        delivered: ordersList.filter(o => o.status === "delivered").length
    };

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
        setFormImages([]);
        setShowUrlInput(false);
        setUrlInputValue("");
        setFormVariants("Standard, Size 7, Size 8, Size 9");
        setFormStock("25");
        setFormSku(`ACC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
        setFormStatus("active");
        setFormTags("");
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
        setFormImages(product.images && product.images.length > 0 ? [...product.images] : []);
        setShowUrlInput(false);
        setUrlInputValue("");
        setFormVariants(Array.isArray(product.variants) ? product.variants.join(", ") : (product.variants || "Standard"));
        setFormStock(String(product.stock !== undefined ? product.stock : 20));
        setFormSku(product.sku_code || `ACC-${product.id}`);
        setFormStatus(product.status || "active");
        setFormTags(Array.isArray(product.tags) ? product.tags.join(", ") : (product.tags || ""));
        setFormFeatured(Boolean(product.featured));
        setFormNewArrival(Boolean(product.newArrival));
        setIsProductModalOpen(true);
    };

    // Save Product
    const handleSaveProduct = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!formName.trim()) {
            showToast("Product name is required.");
            return;
        }
        const parsedPrice = parseFloat(formPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            showToast("Please enter a valid selling price greater than ₹0.");
            return;
        }

        setIsSavingProduct(true);
        try {
            const validImages = formImages.filter(img => img && img.trim());
            const parsedComparePrice = formComparePrice ? parseFloat(formComparePrice) : parsedPrice;
            const parsedStock = parseInt(formStock, 10);

            const parsedTags = formTags
                ? formTags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)
                : [formCategory || "chains"];

            const parsedVariants = formVariants
                ? formVariants.split(",").map(v => v.trim()).filter(Boolean)
                : ["Standard"];

            const productData = {
                id: modalMode === "edit" ? editingProductId : `acc_custom_${Date.now()}`,
                name: formName.trim(),
                category: formCategory || "chains",
                price: parsedPrice,
                comparePrice: isNaN(parsedComparePrice) ? parsedPrice : parsedComparePrice,
                description: formDescription.trim(),
                images: validImages.length > 0 ? validImages : ["assets/images/hero-hand.jpg"],
                variants: parsedVariants.length > 0 ? parsedVariants : ["Standard"],
                stock: isNaN(parsedStock) ? 20 : parsedStock,
                sku_code: formSku ? formSku.trim() : `ACC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                status: formStatus || "active",
                tags: parsedTags,
                featured: Boolean(formFeatured),
                newArrival: Boolean(formNewArrival),
                rating: 4.9,
                numReviews: 1
            };

            const success = db.saveProduct(productData);
            if (success) {
                if (refreshData) refreshData();
                setIsProductModalOpen(false);
                showToast(modalMode === "edit" ? "Product updated successfully!" : "New product created and live in store!");
            } else {
                showToast("Failed to save product. Please try again.");
            }
        } catch (err) {
            console.error("Error saving product:", err);
            showToast("Error saving product: " + (err.message || "Unknown error"));
        } finally {
            setIsSavingProduct(false);
        }
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

    // Stock adjustment helper
    const handleAdjustStock = (product, delta) => {
        const currentStock = product.stock !== undefined ? product.stock : 20;
        const newStock = Math.max(0, currentStock + delta);
        db.saveProduct({
            ...product,
            stock: newStock
        });
        refreshData();
        showToast(`Stock for ${product.name} updated to ${newStock}`);
    };

    // Real Device Image Upload & Optimization Helpers
    const processImageFiles = async (files) => {
        if (!files || files.length === 0) return;
        const validFiles = Array.from(files).filter(f => f.type && f.type.startsWith("image/"));
        if (validFiles.length === 0) {
            showToast("Please select valid image files (JPG, PNG, WEBP, etc.)");
            return;
        }
        showToast(`Processing ${validFiles.length} image${validFiles.length > 1 ? 's' : ''}...`);
        try {
            const compressedResults = await Promise.all(
                validFiles.map(file => compressImage(file))
            );
            setFormImages(prev => [...prev, ...compressedResults]);
            showToast(`Added ${compressedResults.length} photo${compressedResults.length > 1 ? 's' : ''}!`);
        } catch (err) {
            console.error("Image processing error:", err);
            showToast("Error processing image file from device");
        }
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processImageFiles(files);
        }
        e.target.value = "";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processImageFiles(e.dataTransfer.files);
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSetCover = (indexToCover) => {
        setFormImages(prev => {
            if (indexToCover <= 0 || indexToCover >= prev.length) return prev;
            const target = prev[indexToCover];
            const remaining = prev.filter((_, idx) => idx !== indexToCover);
            return [target, ...remaining];
        });
        showToast("Set as primary cover photo!");
    };

    const handleAddUrlImage = () => {
        if (!urlInputValue.trim()) return;
        setFormImages(prev => [...prev, urlInputValue.trim()]);
        setUrlInputValue("");
        setShowUrlInput(false);
    };

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

            <!-- 1. ZEPIO / BLYO LEFT VERTICAL SIDEBAR -->
            <aside class="zepio-sidebar ${mobileMenuOpen ? 'open' : ''}">
                <div class="zepio-sidebar-header">
                    <div class="zepio-brand-info">
                        <div class="zepio-brand-icon">A</div>
                        <div>
                            <h3 class="zepio-brand-title">ACCESSIFY</h3>
                            <div class="zepio-brand-sub">
                                <span class="zepio-status-dot"></span>
                                Staff Panel
                            </div>
                        </div>
                    </div>
                </div>

                <nav class="zepio-sidebar-nav">
                    <div class="zepio-nav-section-title">Operations</div>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'staff' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('staff'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i class="ri-home-5-line zepio-nav-icon"></i>
                            <span>Staff Dashboard</span>
                        </div>
                    </button>

                    <div class="zepio-nav-section-title">Catalog</div>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'products' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('products'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i class="ri-box-3-line zepio-nav-icon"></i>
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
                            <i class="ri-folder-line zepio-nav-icon"></i>
                            <span>Categories</span>
                        </div>
                        <span class="zepio-nav-badge">${allCategories.length}</span>
                    </button>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'inventory' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i class="ri-stack-line zepio-nav-icon"></i>
                            <span>Inventory</span>
                        </div>
                    </button>

                    <div class="zepio-nav-section-title">Orders & Customers</div>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'orders' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i class="ri-inbox-archive-line zepio-nav-icon"></i>
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
                            <i class="ri-user-3-line zepio-nav-icon"></i>
                            <span>Customers</span>
                        </div>
                        <span class="zepio-nav-badge">${customersList.length}</span>
                    </button>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'discounts' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('discounts'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i class="ri-discount-percent-line zepio-nav-icon"></i>
                            <span>Discounts</span>
                        </div>
                        <span class="zepio-nav-badge">${couponsList.length}</span>
                    </button>

                    <div class="zepio-nav-section-title">Settings</div>

                    <button 
                        type="button" 
                        class="zepio-nav-item ${activeTab === 'settings' ? 'active' : ''}" 
                        onClick=${() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                    >
                        <div class="zepio-nav-item-left">
                            <i class="ri-settings-line zepio-nav-icon"></i>
                            <span>Store Settings</span>
                        </div>
                    </button>
                </nav>

                <div class="zepio-sidebar-footer">
                    <a href="#/" class="zepio-sidebar-store-btn" target="_blank" rel="noopener noreferrer">
                        <i class="ri-external-link-line"></i>
                        <span>Visit your store</span>
                    </a>
                    <button 
                        type="button" 
                        class="zepio-btn zepio-btn-secondary zepio-btn-sm" 
                        style="width: 100%; border: none; background: transparent; color: #9ca3af;"
                        onClick=${logout}
                    >
                        <i class="ri-logout-box-r-line"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <!-- 2. MAIN CONTENT WRAPPER -->
            <div class="zepio-main-content">
                <!-- TOPBAR MATCHING BLYO.IN/ADMIN/STAFF -->
                <header class="zepio-topbar">
                    <div class="zepio-topbar-left">
                        <button 
                            type="button" 
                            class="zepio-mobile-menu-btn" 
                            onClick=${() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            <i class="ri-menu-line" style="font-size: 18px;"></i>
                        </button>
                        <div class="zepio-breadcrumbs">
                            <i class="ri-store-2-line" style="color: #6b7280;"></i>
                            <span style="font-weight: 600;">Main Store</span>
                            <span>/</span>
                            <span class="zepio-breadcrumb-active" style="text-transform: capitalize;">${activeTab}</span>
                        </div>
                    </div>

                    <div class="zepio-topbar-right">
                        <!-- Add Product Quick Button -->
                        <button 
                            type="button" 
                            class="zepio-btn zepio-btn-primary zepio-btn-sm" 
                            onClick=${openAddProductModal}
                            title="Add New Product"
                        >
                            <i class="ri-add-line"></i>
                            <span>Add Product</span>
                        </button>

                        <!-- Store Status Open/Closed Pill (im component from blyo.in) -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 0.78rem; font-weight: 600; color: #6b7280;" class="hidden sm:inline">Store status:</span>
                            <button 
                                type="button" 
                                class="zepio-store-status-toggle ${storeOpen ? 'open' : 'closed'}" 
                                onClick=${() => { setStoreOpen(!storeOpen); showToast(storeOpen ? "Store closed for orders" : "Store is now Open & accepting orders!"); }}
                                title="Store Status (Open/Closed)"
                            >
                                <span class="zepio-status-text">${storeOpen ? 'Open' : 'Closed'}</span>
                                <span class="zepio-status-knob"></span>
                            </button>
                        </div>

                        <a href="#/" class="zepio-btn zepio-btn-secondary zepio-btn-sm" target="_blank">
                            <i class="ri-external-link-line"></i>
                            <span class="hidden sm:inline">Visit your store</span>
                        </a>

                        <div class="zepio-user-profile" style="cursor: pointer;" onClick=${logout} title="Click to logout">
                            <div class="zepio-avatar" style="background: #3b82f6;">S</div>
                            <span class="zepio-user-role">Staff</span>
                        </div>
                    </div>
                </header>

                <!-- 3. DYNAMIC CONTENT CANVAS -->
                <main class="zepio-content-body">
                    
                    <!-- TAB: STAFF DASHBOARD (/admin/staff) -->
                    ${activeTab === 'staff' && html`
                        <div>
                            <!-- Date Range & Action Bar -->
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
                                <div>
                                    <h1 class="zepio-page-title">Staff Dashboard</h1>
                                    <p class="zepio-page-subtitle">Operations overview for ACCESSIFY streetwear store.</p>
                                </div>
                                <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                                    <button 
                                        type="button" 
                                        class="zepio-btn zepio-btn-primary zepio-btn-sm" 
                                        onClick=${openAddProductModal}
                                    >
                                        <i class="ri-add-line"></i>
                                        <span>Add Product</span>
                                    </button>
                                    <div class="zepio-range-bar">
                                        <button class="zepio-range-pill ${dateRange === 'today' ? 'active' : ''}" onClick=${() => setDateRange('today')}>Today</button>
                                        <button class="zepio-range-pill ${dateRange === 'yesterday' ? 'active' : ''}" onClick=${() => setDateRange('yesterday')}>Yesterday</button>
                                        <button class="zepio-range-pill ${dateRange === '7d' ? 'active' : ''}" onClick=${() => setDateRange('7d')}>Last 7 days</button>
                                        <button class="zepio-range-pill ${dateRange === '30d' ? 'active' : ''}" onClick=${() => setDateRange('30d')}>Last 30 days</button>
                                        <button class="zepio-range-pill ${dateRange === 'this-month' ? 'active' : ''}" onClick=${() => setDateRange('this-month')}>This month</button>
                                        <button class="zepio-range-pill ${dateRange === 'all' ? 'active' : ''}" onClick=${() => setDateRange('all')}>All time</button>
                                    </div>
                                </div>
                            </div>

                            <!-- KPI Metric Cards (Real Store Stats) -->
                            <div class="zepio-stats-grid">
                                <div class="zepio-stat-card">
                                    <div>
                                        <div class="zepio-stat-label">Total Orders</div>
                                        <div class="zepio-stat-value">${totalOrdersCount}</div>
                                        <div class="zepio-stat-sub">
                                            <span>${pendingOrdersCount} awaiting fulfillment</span>
                                        </div>
                                    </div>
                                    <div class="zepio-stat-icon-wrap blue">
                                        <i class="ri-shopping-bag-3-line"></i>
                                    </div>
                                </div>

                                <div class="zepio-stat-card">
                                    <div>
                                        <div class="zepio-stat-label">Catalog Products</div>
                                        <div class="zepio-stat-value">${totalProductsCount}</div>
                                        <div class="zepio-stat-sub">
                                            <span>Across ${allCategories.length} categories</span>
                                        </div>
                                    </div>
                                    <div class="zepio-stat-icon-wrap purple">
                                        <i class="ri-box-3-line"></i>
                                    </div>
                                </div>

                                <div class="zepio-stat-card">
                                    <div>
                                        <div class="zepio-stat-label">Store Customers</div>
                                        <div class="zepio-stat-value">${customersList.length}</div>
                                        <div class="zepio-stat-sub">
                                            <span>Customer directory</span>
                                        </div>
                                    </div>
                                    <div class="zepio-stat-icon-wrap green">
                                        <i class="ri-user-star-line"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- ORDER PIPELINE (Nu from Zepio /admin/staff) -->
                            <div class="zepio-pipeline-card">
                                <div class="zepio-pipeline-title">
                                    <i class="ri-route-line" style="color: #2563eb;"></i>
                                    <span>Orders Pipeline</span>
                                </div>
                                <div class="zepio-pipeline-steps">
                                    <div class="zepio-pipeline-step" onClick=${() => { setOrderFilter('pending'); setActiveTab('orders'); }}>
                                        <div class="zepio-pipeline-count" style="color: #f59e0b;">${pipelineCounts.placed}</div>
                                        <div class="zepio-pipeline-label">Placed (Pending)</div>
                                    </div>

                                    <div class="zepio-pipeline-step" onClick=${() => { setOrderFilter('processing'); setActiveTab('orders'); }}>
                                        <div class="zepio-pipeline-count" style="color: #2563eb;">${pipelineCounts.processing}</div>
                                        <div class="zepio-pipeline-label">Processing</div>
                                    </div>

                                    <div class="zepio-pipeline-step" onClick=${() => { setOrderFilter('processing'); setActiveTab('orders'); }}>
                                        <div class="zepio-pipeline-count" style="color: #8b5cf6;">${pipelineCounts.ready}</div>
                                        <div class="zepio-pipeline-label">Ready for Pickup</div>
                                    </div>

                                    <div class="zepio-pipeline-step" onClick=${() => { setOrderFilter('shipped'); setActiveTab('orders'); }}>
                                        <div class="zepio-pipeline-count" style="color: #06b6d4;">${pipelineCounts.shipped}</div>
                                        <div class="zepio-pipeline-label">Out for Delivery</div>
                                    </div>

                                    <div class="zepio-pipeline-step" onClick=${() => { setOrderFilter('delivered'); setActiveTab('orders'); }}>
                                        <div class="zepio-pipeline-count" style="color: #10b981;">${pipelineCounts.delivered}</div>
                                        <div class="zepio-pipeline-label">Delivered</div>
                                    </div>
                                </div>
                            </div>

                            <!-- "MANAGE" SHORTCUTS GRID (Fu from Zepio /admin/staff) -->
                            <div class="zepio-section-block">
                                <div class="zepio-section-header">
                                    <h3 class="zepio-section-title">Manage</h3>
                                    <p class="zepio-section-sub">Run your store day to day</p>
                                </div>
                                <div class="zepio-shortcut-grid">
                                    <!-- 1. Products -->
                                    <div class="zepio-shortcut-tile tone-indigo" onClick=${() => setActiveTab('products')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-box-3-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Products</span>
                                    </div>

                                    <!-- 2. Orders -->
                                    <div class="zepio-shortcut-tile tone-sky" onClick=${() => setActiveTab('orders')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-inbox-archive-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Orders</span>
                                        ${pendingOrdersCount > 0 && html`
                                            <span class="zepio-shortcut-badge">${pendingOrdersCount}</span>
                                        `}
                                    </div>

                                    <!-- 3. Inventory -->
                                    <div class="zepio-shortcut-tile tone-amber" onClick=${() => setActiveTab('inventory')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-stack-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Inventory</span>
                                    </div>

                                    <!-- 4. Customers -->
                                    <div class="zepio-shortcut-tile tone-pink" onClick=${() => setActiveTab('customers')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-user-3-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Customers</span>
                                    </div>

                                    <!-- 5. Categories -->
                                    <div class="zepio-shortcut-tile tone-indigo" onClick=${() => setActiveTab('categories')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-folder-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Categories</span>
                                    </div>

                                    <!-- 6. Discounts -->
                                    <div class="zepio-shortcut-tile tone-emerald" onClick=${() => setActiveTab('discounts')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-discount-percent-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Discounts</span>
                                    </div>

                                    <!-- 7. Abandoned -->
                                    <div class="zepio-shortcut-tile tone-coral" onClick=${() => showToast("No abandoned carts in last 24 hours.")}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-shopping-cart-2-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Abandoned</span>
                                    </div>

                                    <!-- 8. Reports -->
                                    <div class="zepio-shortcut-tile tone-sky" onClick=${() => showToast("Sales report generated successfully!")}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-line-chart-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Reports</span>
                                    </div>
                                </div>
                            </div>

                            <!-- "GROW" SHORTCUTS GRID (Mu from Zepio /admin/staff) -->
                            <div class="zepio-section-block">
                                <div class="zepio-section-header">
                                    <h3 class="zepio-section-title">Grow</h3>
                                    <p class="zepio-section-sub">Reach new customers and bring them back</p>
                                </div>
                                <div class="zepio-shortcut-grid">
                                    <div class="zepio-shortcut-tile tone-indigo" onClick=${() => window.open('#/', '_blank')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-quill-pen-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Design</span>
                                    </div>

                                    <div class="zepio-shortcut-tile tone-indigo" onClick=${() => setActiveTab('categories')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-price-tag-3-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Collections</span>
                                    </div>

                                    <div class="zepio-shortcut-tile tone-coral" onClick=${() => showToast("Push Notification center active.")}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-notification-3-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Push Alerts</span>
                                    </div>

                                    <div class="zepio-shortcut-tile tone-pink" onClick=${() => showToast("All product reviews verified.")}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-star-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Reviews</span>
                                    </div>

                                    <div class="zepio-shortcut-tile tone-sky" onClick=${() => setActiveTab('settings')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-global-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Domain</span>
                                    </div>

                                    <div class="zepio-shortcut-tile tone-emerald" onClick=${() => showToast("PWA Store ready for mobile install.")}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-smartphone-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Android App</span>
                                    </div>

                                    <div class="zepio-shortcut-tile tone-amber" onClick=${() => showToast("SEO Meta Tags & Sitemaps are indexed.")}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-search-eye-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">SEO</span>
                                    </div>

                                    <div class="zepio-shortcut-tile tone-sky" onClick=${() => setActiveTab('settings')}>
                                        <div class="zepio-shortcut-icon">
                                            <i class="ri-flashlight-line"></i>
                                        </div>
                                        <span class="zepio-shortcut-name">Plugins</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `}

                    <!-- TAB: PRODUCTS CATALOG -->
                    ${activeTab === 'products' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Products</h1>
                                    <p class="zepio-page-subtitle">${filteredProducts.length} items in catalog • Inline price editing enabled</p>
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button type="button" class="zepio-btn zepio-btn-secondary" onClick=${handleDownloadJson}>
                                        <i class="ri-download-2-line"></i>
                                        <span>Export JSON</span>
                                    </button>
                                    <button type="button" class="zepio-btn zepio-btn-primary" onClick=${openAddProductModal}>
                                        <i class="ri-add-line"></i>
                                        <span>Add Product</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Filter & Search Toolbar -->
                            <div class="zepio-card" style="margin-bottom: 16px;">
                                <div style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid #e5e7eb;">
                                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                        <input 
                                            type="text" 
                                            class="zepio-input" 
                                            style="width: 200px; padding: 6px 10px;"
                                            placeholder="Search products..."
                                            value=${searchQuery}
                                            onInput=${e => setSearchQuery(e.target.value)}
                                        />

                                        <select 
                                            class="zepio-select" 
                                            style="padding: 6px 10px;"
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
                                            style="padding: 6px 10px;"
                                            value=${stockFilter} 
                                            onChange=${e => setStockFilter(e.target.value)}
                                        >
                                            <option value="all">All Stock Status</option>
                                            <option value="instock">In Stock (>5)</option>
                                            <option value="lowstock">Low Stock (1-5)</option>
                                            <option value="outofstock">Out of Stock (0)</option>
                                        </select>
                                    </div>
                                    <div style="font-size: 0.78rem; color: #6b7280;">
                                        Click price to edit directly.
                                    </div>
                                </div>

                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Selling Price (₹)</th>
                                                <th>MRP / Compare (₹)</th>
                                                <th>Inventory</th>
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
                                                                    <div class="zepio-product-meta">ID: ${product.id} ${product.sku_code ? `• SKU: ${product.sku_code}` : ''} ${product.status === 'inactive' ? '• (Inactive)' : ''} ${product.featured ? '• ✦ Featured' : ''}</div>
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
                                                                        style="padding: 2px 7px; font-size: 0.7rem;"
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
                                                            <div style="display: flex; align-items: center; gap: 6px;">
                                                                <button 
                                                                    type="button" 
                                                                    class="zepio-btn zepio-btn-secondary zepio-btn-sm"
                                                                    onClick=${() => openEditProductModal(product)}
                                                                    title="Edit Product"
                                                                >
                                                                    <i class="ri-edit-line"></i>
                                                                </button>
                                                                <a 
                                                                    href="#/product/${product.id}" 
                                                                    target="_blank" 
                                                                    class="zepio-btn zepio-btn-secondary zepio-btn-sm"
                                                                    title="View in Store"
                                                                >
                                                                    <i class="ri-eye-line"></i>
                                                                </a>
                                                                <button 
                                                                    type="button" 
                                                                    class="zepio-btn zepio-btn-danger zepio-btn-sm"
                                                                    onClick=${() => handleDeleteProduct(product)}
                                                                    title="Delete Product"
                                                                >
                                                                    <i class="ri-delete-bin-line"></i>
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

                    <!-- TAB: INVENTORY -->
                    ${activeTab === 'inventory' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Inventory Management</h1>
                                    <p class="zepio-page-subtitle">Track and adjust stock levels across all jewelry items.</p>
                                </div>
                            </div>

                            <div class="zepio-card">
                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Current Stock</th>
                                                <th>Status</th>
                                                <th>Quick Adjust</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${products.slice(0, 100).map(product => {
                                                const stock = product.stock !== undefined ? product.stock : 20;
                                                return html`
                                                    <tr key=${product.id}>
                                                        <td>
                                                            <div class="zepio-product-cell">
                                                                <img src=${product.images?.[0] || 'assets/images/hero-hand.jpg'} class="zepio-product-thumb" />
                                                                <span class="zepio-product-name">${product.name}</span>
                                                            </div>
                                                        </td>
                                                        <td><span class="zepio-badge zepio-badge-gray">${product.category}</span></td>
                                                        <td style="font-weight: 700; font-size: 1rem;">${stock} units</td>
                                                        <td>
                                                            ${stock > 5 ? html`<span class="zepio-badge zepio-badge-success">In Stock</span>` : stock > 0 ? html`<span class="zepio-badge zepio-badge-warning">Low Stock</span>` : html`<span class="zepio-badge zepio-badge-danger">Out of Stock</span>`}
                                                        </td>
                                                        <td>
                                                            <div style="display: flex; gap: 6px;">
                                                                <button class="zepio-btn zepio-btn-secondary zepio-btn-sm" onClick=${() => handleAdjustStock(product, -1)}>-1</button>
                                                                <button class="zepio-btn zepio-btn-secondary zepio-btn-sm" onClick=${() => handleAdjustStock(product, +5)}>+5</button>
                                                                <button class="zepio-btn zepio-btn-secondary zepio-btn-sm" onClick=${() => handleAdjustStock(product, +20)}>+20</button>
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

                    <!-- TAB: CATEGORIES -->
                    ${activeTab === 'categories' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Categories</h1>
                                    <p class="zepio-page-subtitle">Manage store collections & catalog grouping.</p>
                                </div>
                                <button type="button" class="zepio-btn zepio-btn-primary" onClick=${() => setIsCategoryModalOpen(true)}>
                                    <i class="ri-add-line"></i>
                                    <span>Add Category</span>
                                </button>
                            </div>

                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
                                ${allCategories.map(cat => {
                                    const count = products.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase()).length;
                                    let img = `assets/images/category-${cat}.jpg`;
                                    if (cat === "sleek-chains") img = "assets/images/sleek-chains.jpg";
                                    if (cat === "y2k-gothic-necklaces") img = "assets/images/category-gothic.jpg?v=2";
                                    if (cat === "iced-out-jewels") img = "assets/images/category-iced-out.jpg";

                                    return html`
                                        <div class="zepio-card" key=${cat} style="margin-bottom: 0;">
                                            <img 
                                                src=${img} 
                                                alt=${cat} 
                                                style="width: 100%; height: 130px; object-fit: cover;"
                                                onError=${(e) => { e.target.src = 'assets/images/hero-hand.jpg'; }}
                                            />
                                            <div style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
                                                <div>
                                                    <div style="font-weight: 700; text-transform: uppercase; font-size: 0.88rem;">${cat.replace(/-/g, ' ')}</div>
                                                    <div style="font-size: 0.72rem; color: #6b7280;">${count} items</div>
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

                    <!-- TAB: ORDERS -->
                    ${activeTab === 'orders' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Orders</h1>
                                    <p class="zepio-page-subtitle">Track orders, update delivery pipeline & contact customers.</p>
                                </div>
                            </div>

                            <!-- Filter Pills -->
                            <div class="zepio-range-bar" style="margin-bottom: 16px;">
                                <button class="zepio-range-pill ${orderFilter === 'all' ? 'active' : ''}" onClick=${() => setOrderFilter('all')}>All (${ordersList.length})</button>
                                <button class="zepio-range-pill ${orderFilter === 'pending' ? 'active' : ''}" onClick=${() => setOrderFilter('pending')}>Placed (${ordersList.filter(o => o.status === 'pending').length})</button>
                                <button class="zepio-range-pill ${orderFilter === 'processing' ? 'active' : ''}" onClick=${() => setOrderFilter('processing')}>Processing (${ordersList.filter(o => o.status === 'processing').length})</button>
                                <button class="zepio-range-pill ${orderFilter === 'shipped' ? 'active' : ''}" onClick=${() => setOrderFilter('shipped')}>Shipped (${ordersList.filter(o => o.status === 'shipped').length})</button>
                                <button class="zepio-range-pill ${orderFilter === 'delivered' ? 'active' : ''}" onClick=${() => setOrderFilter('delivered')}>Delivered (${ordersList.filter(o => o.status === 'delivered').length})</button>
                            </div>

                            <div class="zepio-card">
                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${filteredOrders.length === 0 ? html`
                                                <tr>
                                                    <td colspan="6" style="text-align: center; padding: 48px 16px; color: #6b7280;">
                                                        <i class="ri-inbox-line" style="font-size: 2.2rem; color: #9ca3af; display: block; margin-bottom: 8px;"></i>
                                                        <div style="font-weight: 700; font-size: 0.95rem; color: #374151; margin-bottom: 4px;">No orders yet</div>
                                                        <div style="font-size: 0.8rem;">New orders placed via WhatsApp or checkout will appear here in real time.</div>
                                                    </td>
                                                </tr>
                                            ` : filteredOrders.map(order => html`
                                                <tr key=${order.id}>
                                                    <td>
                                                        <div style="font-weight: 700; color: #2563eb;">#${order.id}</div>
                                                        <div style="font-size: 0.72rem; color: #6b7280;">${new Date(order.date).toLocaleDateString()}</div>
                                                    </td>
                                                    <td>
                                                        <div style="font-weight: 600;">${order.customer?.name}</div>
                                                        <div style="font-size: 0.72rem; color: #6b7280;">${order.customer?.phone}</div>
                                                    </td>
                                                    <td>
                                                        ${(order.items || []).map(i => html`<div style="font-size: 0.74rem;">${i.quantity}x ${i.name}</div>`)}
                                                    </td>
                                                    <td style="font-weight: 800;">₹${order.total}</td>
                                                    <td>
                                                        <select 
                                                            class="zepio-select" 
                                                            style="font-size: 0.76rem; padding: 4px 6px;"
                                                            value=${order.status}
                                                            onChange=${e => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        >
                                                            <option value="pending">Placed (Pending)</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Out for Delivery</option>
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
                                                            <i class="ri-whatsapp-line"></i>
                                                            Notify
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

                    <!-- TAB: CUSTOMERS -->
                    ${activeTab === 'customers' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Customers</h1>
                                    <p class="zepio-page-subtitle">Buyer directory & WhatsApp customer messaging.</p>
                                </div>
                            </div>

                            <div class="zepio-card">
                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Customer</th>
                                                <th>Phone</th>
                                                <th>Orders</th>
                                                <th>Total Spend</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${customersList.length === 0 ? html`
                                                <tr>
                                                    <td colspan="5" style="text-align: center; padding: 48px 16px; color: #6b7280;">
                                                        <i class="ri-user-line" style="font-size: 2.2rem; color: #9ca3af; display: block; margin-bottom: 8px;"></i>
                                                        <div style="font-weight: 700; font-size: 0.95rem; color: #374151; margin-bottom: 4px;">No customer profiles yet</div>
                                                        <div style="font-size: 0.8rem;">Customers who place orders will automatically be cataloged here.</div>
                                                    </td>
                                                </tr>
                                            ` : customersList.map(c => html`
                                                <tr key=${c.id}>
                                                    <td>
                                                        <div style="font-weight: 600;">${c.name}</div>
                                                        <div style="font-size: 0.72rem; color: #6b7280;">${c.address}</div>
                                                    </td>
                                                    <td>${c.phone}</td>
                                                    <td><span class="zepio-badge zepio-badge-blue">${c.orderCount} Orders</span></td>
                                                    <td style="font-weight: 700;">₹${c.totalSpent.toLocaleString()}</td>
                                                    <td>
                                                        <a 
                                                            href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)}!%20Greetings%20from%20ACCESSIFY." 
                                                            target="_blank" 
                                                            class="zepio-btn zepio-btn-success zepio-btn-sm"
                                                        >
                                                            <i class="ri-whatsapp-line"></i>
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

                    <!-- TAB: DISCOUNTS -->
                    ${activeTab === 'discounts' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Discounts & Coupons</h1>
                                    <p class="zepio-page-subtitle">Active promotional codes & discounts.</p>
                                </div>
                                <button type="button" class="zepio-btn zepio-btn-primary" onClick=${() => setIsCouponModalOpen(true)}>
                                    <i class="ri-add-line"></i>
                                    <span>Create Coupon</span>
                                </button>
                            </div>

                            <div class="zepio-card">
                                <div class="zepio-table-container">
                                    <table class="zepio-table">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Type</th>
                                                <th>Discount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${couponsList.map(c => html`
                                                <tr key=${c.code}>
                                                    <td><strong style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${c.code}</strong></td>
                                                    <td style="text-transform: capitalize;">${c.type}</td>
                                                    <td style="font-weight: 700; color: #10b981;">
                                                        ${c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                                                    </td>
                                                    <td><span class="zepio-badge zepio-badge-success">Active</span></td>
                                                    <td>
                                                        <button class="zepio-btn zepio-btn-danger zepio-btn-sm" onClick=${() => handleDeleteCoupon(c.code)}>Delete</button>
                                                    </td>
                                                </tr>
                                            `)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `}

                    <!-- TAB: SETTINGS -->
                    ${activeTab === 'settings' && html`
                        <div>
                            <div class="zepio-page-header">
                                <div>
                                    <h1 class="zepio-page-title">Store Settings</h1>
                                    <p class="zepio-page-subtitle">Branding, WhatsApp checkout & delivery configuration.</p>
                                </div>
                            </div>

                            <div class="zepio-card">
                                <div class="zepio-card-header">
                                    <h3 class="zepio-card-title">Store Configuration</h3>
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
                                                <label class="zepio-label">Official WhatsApp Order Phone</label>
                                                <input 
                                                    type="text" 
                                                    class="zepio-input" 
                                                    value=${settingsState.whatsappPhone}
                                                    onInput=${e => setSettingsState({ ...settingsState, whatsappPhone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div class="zepio-form-row">
                                            <div class="zepio-form-group">
                                                <label class="zepio-label">Standard Delivery Fee (₹)</label>
                                                <input 
                                                    type="number" 
                                                    class="zepio-input" 
                                                    value=${settingsState.deliveryFee}
                                                    onInput=${e => setSettingsState({ ...settingsState, deliveryFee: Number(e.target.value) })}
                                                />
                                            </div>
                                            <div class="zepio-form-group">
                                                <label class="zepio-label">Free Delivery Threshold (₹)</label>
                                                <input 
                                                    type="number" 
                                                    class="zepio-input" 
                                                    value=${settingsState.freeDeliveryThreshold}
                                                    onInput=${e => setSettingsState({ ...settingsState, freeDeliveryThreshold: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" class="zepio-btn zepio-btn-primary">
                                            Save Settings
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div class="zepio-card">
                                <div class="zepio-card-header">
                                    <h3 class="zepio-card-title">Backup & Factory Reset</h3>
                                </div>
                                <div class="zepio-card-body">
                                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                        <button type="button" class="zepio-btn zepio-btn-secondary" onClick=${handleDownloadJson}>
                                            <i class="ri-download-2-line"></i> Download JSON
                                        </button>
                                        <button type="button" class="zepio-btn zepio-btn-danger" onClick=${handleResetCatalog}>
                                            <i class="ri-refresh-line"></i> Reset Catalog to Default
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `}
                </main>
            </div>

            <!-- MODAL: ADD / EDIT PRODUCT -->
            ${isProductModalOpen && html`
                <div class="zepio-modal-backdrop" onClick=${() => setIsProductModalOpen(false)}>
                    <div class="zepio-modal-dialog" onClick=${e => e.stopPropagation()}>
                        <div class="zepio-modal-header">
                            <h3 class="zepio-modal-title">
                                ${modalMode === 'edit' ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button class="zepio-modal-close" onClick=${() => setIsProductModalOpen(false)}>
                                <i class="ri-close-line"></i>
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
                                        <label class="zepio-label">Product SKU / Code</label>
                                        <input 
                                            type="text" 
                                            class="zepio-input" 
                                            placeholder="e.g., ACC-GOTH-01" 
                                            value=${formSku} 
                                            onInput=${e => setFormSku(e.target.value)} 
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
                                            min="1"
                                            step="any"
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
                                            min="0"
                                            step="any"
                                            value=${formComparePrice} 
                                            onInput=${e => setFormComparePrice(e.target.value)} 
                                        />
                                    </div>
                                </div>

                                <div class="zepio-form-row">
                                    <div class="zepio-form-group">
                                        <label class="zepio-label">Initial Stock Quantity *</label>
                                        <input 
                                            type="number" 
                                            class="zepio-input" 
                                            placeholder="25"
                                            min="0"
                                            value=${formStock} 
                                            onInput=${e => setFormStock(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div class="zepio-form-group">
                                        <label class="zepio-label">Status</label>
                                        <select 
                                            class="zepio-select" 
                                            style="width: 100%;"
                                            value=${formStatus} 
                                            onChange=${e => setFormStatus(e.target.value)}
                                        >
                                            <option value="active">Active (Visible in Store)</option>
                                            <option value="inactive">Inactive (Hidden)</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="zepio-form-group">
                                    <label class="zepio-label">Description</label>
                                    <textarea 
                                        class="zepio-textarea" 
                                        rows="3" 
                                        placeholder="Material, finish, size, streetwear details..."
                                        value=${formDescription} 
                                        onInput=${e => setFormDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div class="zepio-form-row">
                                    <div class="zepio-form-group">
                                        <label class="zepio-label">Variants (Comma-separated sizes / styles)</label>
                                        <input 
                                            type="text" 
                                            class="zepio-input" 
                                            placeholder="Standard, Size 7, Size 8, Size 9" 
                                            value=${formVariants} 
                                            onInput=${e => setFormVariants(e.target.value)} 
                                        />
                                    </div>

                                    <div class="zepio-form-group">
                                        <label class="zepio-label">Tags (Comma-separated search keywords)</label>
                                        <input 
                                            type="text" 
                                            class="zepio-input" 
                                            placeholder="streetwear, gothic, silver, chain" 
                                            value=${formTags} 
                                            onInput=${e => setFormTags(e.target.value)} 
                                        />
                                    </div>
                                </div>

                                <!-- Badges & Visibility Toggles -->
                                <div style="display: flex; gap: 16px; flex-wrap: wrap; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: #374151;">
                                        <input 
                                            type="checkbox" 
                                            checked=${formFeatured} 
                                            onChange=${e => setFormFeatured(e.target.checked)} 
                                            style="width: 16px; height: 16px; cursor: pointer; accent-color: #3b82f6;" 
                                        />
                                        <span>Featured Product (Highlight on homepage)</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: #374151;">
                                        <input 
                                            type="checkbox" 
                                            checked=${formNewArrival} 
                                            onChange=${e => setFormNewArrival(e.target.checked)} 
                                            style="width: 16px; height: 16px; cursor: pointer; accent-color: #3b82f6;" 
                                        />
                                        <span>New Arrival Badge</span>
                                    </label>
                                </div>

                                <div class="zepio-form-group">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                        <label class="zepio-label" style="margin-bottom: 0;">
                                            Product Photos <span style="font-weight: 400; color: #6b7280; font-size: 0.76rem;">(First photo is primary cover)</span>
                                        </label>
                                        <button 
                                            type="button" 
                                            class="zepio-btn zepio-btn-secondary zepio-btn-sm" 
                                            style="font-size: 0.75rem; padding: 4px 10px;"
                                            onClick=${() => setShowUrlInput(!showUrlInput)}
                                        >
                                            <i class="ri-link" style="margin-right: 4px;"></i>
                                            ${showUrlInput ? 'Hide URL' : '+ Add via URL'}
                                        </button>
                                    </div>

                                    <!-- Hidden File Input for Device Photos -->
                                    <input 
                                        type="file" 
                                        id="zepio-product-file-input" 
                                        accept="image/*" 
                                        multiple 
                                        style="display: none;" 
                                        onChange=${handleFileUpload} 
                                    />

                                    <!-- Drag and Drop Dropzone -->
                                    <div 
                                        class=${`zepio-upload-dropzone ${isDragOver ? 'dragover' : ''}`}
                                        onClick=${() => {
                                            const el = document.getElementById('zepio-product-file-input');
                                            if (el) el.click();
                                        }}
                                        onDragOver=${handleDragOver}
                                        onDragEnter=${handleDragOver}
                                        onDragLeave=${handleDragLeave}
                                        onDrop=${handleDrop}
                                    >
                                        <i class="ri-upload-cloud-2-line zepio-upload-icon"></i>
                                        <div class="zepio-upload-title">Click to upload or drag & drop photos</div>
                                        <div class="zepio-upload-sub">Upload from phone or PC (JPG, PNG, WEBP — auto-optimized)</div>
                                    </div>

                                    <!-- Optional URL input bar if toggled -->
                                    ${showUrlInput && html`
                                        <div style="display: flex; gap: 8px; margin-top: 10px;">
                                            <input 
                                                type="text" 
                                                class="zepio-input" 
                                                placeholder="Enter image URL (e.g. https://... or assets/images/...)"
                                                value=${urlInputValue} 
                                                onInput=${e => setUrlInputValue(e.target.value)}
                                                onKeyDown=${e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddUrlImage();
                                                    }
                                                }}
                                            />
                                            <button 
                                                type="button" 
                                                class="zepio-btn zepio-btn-primary zepio-btn-sm" 
                                                onClick=${handleAddUrlImage}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    `}

                                    <!-- Uploaded Images Thumbnails Grid -->
                                    ${formImages.length > 0 && html`
                                        <div class="zepio-image-grid">
                                            ${formImages.map((img, idx) => html`
                                                <div class="zepio-image-preview-card" key=${idx}>
                                                    <img src=${img} alt="Product photo ${idx + 1}" class="zepio-image-preview-img" />
                                                    
                                                    ${idx === 0 ? html`
                                                        <span class="zepio-cover-badge">COVER</span>
                                                    ` : html`
                                                        <button 
                                                            type="button" 
                                                            title="Set as Primary Cover"
                                                            style="position: absolute; bottom: 4px; left: 4px; background: rgba(17, 24, 39, 0.75); color: #fff; border: none; border-radius: 4px; font-size: 9px; font-weight: 600; padding: 2px 6px; cursor: pointer; z-index: 10;"
                                                            onClick=${() => handleSetCover(idx)}
                                                        >
                                                            Set Cover
                                                        </button>
                                                    `}

                                                    <button 
                                                        type="button" 
                                                        class="zepio-image-remove-btn" 
                                                        title="Remove photo"
                                                        onClick=${() => handleRemoveImage(idx)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            `)}
                                        </div>
                                    `}
                                </div>
                            </div>

                            <div class="zepio-modal-footer">
                                <button type="button" class="zepio-btn zepio-btn-secondary" onClick=${() => setIsProductModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" class="zepio-btn zepio-btn-primary" disabled=${isSavingProduct}>
                                    ${isSavingProduct ? html`
                                        <span style="display: inline-flex; align-items: center; gap: 6px;">
                                            <i class="ri-loader-4-line ri-spin"></i>
                                            <span>Saving...</span>
                                        </span>
                                    ` : (modalMode === 'edit' ? 'Update Product' : 'Create Product')}
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
                                <i class="ri-close-line"></i>
                            </button>
                        </div>
                        <form onSubmit=${handleCreateCategory}>
                            <div class="zepio-modal-body">
                                <div class="zepio-form-group">
                                    <label class="zepio-label">Category Name</label>
                                    <input 
                                        type="text" 
                                        class="zepio-input" 
                                        placeholder="e.g. Rings, Chains, Sunglasses" 
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
                                <i class="ri-close-line"></i>
                            </button>
                        </div>
                        <form onSubmit=${handleCreateCoupon}>
                            <div class="zepio-modal-body">
                                <div class="zepio-form-group">
                                    <label class="zepio-label">Coupon Code</label>
                                    <input 
                                        type="text" 
                                        class="zepio-input" 
                                        placeholder="CODE (e.g. FLASH20)" 
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
