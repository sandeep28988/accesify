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

    // Auth fields for protected screen
    const [email, setEmail] = useState("admin@accessify.com");
    const [password, setPassword] = useState("admin123");

    // Filter and Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("default");

    // Modals
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
    const [editingProductId, setEditingProductId] = useState("");
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [newCategoryInput, setNewCategoryInput] = useState("");

    // Form Fields for Add / Edit Product
    const [formName, setFormName] = useState("");
    const [formCategory, setFormCategory] = useState("rings");
    const [formPrice, setFormPrice] = useState("");
    const [formComparePrice, setFormComparePrice] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formImages, setFormImages] = useState([""]);
    const [formVariants, setFormVariants] = useState("");
    const [formStock, setFormStock] = useState("25");
    const [formFeatured, setFormFeatured] = useState(false);
    const [formNewArrival, setFormNewArrival] = useState(false);

    // Inline price edit state: { [productId]: { price, comparePrice } }
    const [inlinePrices, setInlinePrices] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    // Handle Admin Login
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    // If not authenticated as admin, show login view
    if (!user || user.role !== "admin") {
        return html`
            <div class="container anim-fade-in" style="padding-top: 130px; padding-bottom: 90px; max-width: 480px; margin: 0 auto;">
                <div class="card" style="padding: 36px 28px; border-radius: 12px; background: var(--card-bg); border: 1px solid var(--border-color); text-align: center;">
                    <div style="width: 56px; height: 56px; margin: 0 auto 18px; border-radius: 50%; background: rgba(37, 211, 102, 0.1); display: flex; align-items: center; justify-content: center; color: var(--color-whatsapp);">
                        <i data-lucide="shield-check" style="width: 28px; height: 28px;"></i>
                    </div>
                    
                    <h2 style="font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.05em; margin-bottom: 6px;">
                        ACCESSIFY ADMIN PANEL
                    </h2>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 24px;">
                        Manage product prices, catalog, categories, and inventory.
                    </p>

                    <!-- Instant 1-Click Access for Owner -->
                    <button 
                        type="button" 
                        class="btn btn-primary" 
                        style="width: 100%; margin-bottom: 16px; padding: 12px; font-weight: 700;"
                        onClick=${() => directAdminLogin()}
                    >
                        <i data-lucide="unlock" style="width: 16px; height: 16px; margin-right: 8px;"></i>
                        1-Click Owner Access
                    </button>

                    <div style="display: flex; align-items: center; margin: 16px 0; color: var(--text-muted); font-size: 0.75rem;">
                        <span style="flex: 1; height: 1px; background: var(--border-color);"></span>
                        <span style="padding: 0 10px;">OR USE CREDENTIALS</span>
                        <span style="flex: 1; height: 1px; background: var(--border-color);"></span>
                    </div>

                    <form onSubmit=${handleLoginSubmit} style="text-align: left;">
                        <div class="form-group" style="margin-bottom: 14px;">
                            <label style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">Email Address</label>
                            <input 
                                type="email" 
                                class="form-control" 
                                value=${email} 
                                onInput=${e => setEmail(e.target.value)} 
                                required 
                            />
                        </div>

                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">Password</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                value=${password} 
                                onInput=${e => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <button type="submit" class="btn btn-secondary" style="width: 100%; padding: 11px;">
                            Log In to Dashboard
                        </button>
                    </form>

                    <div style="margin-top: 24px;">
                        <a href="#/" style="font-size: 0.8rem; color: var(--text-muted); text-decoration: underline;">
                            ← Return to Customer Storefront
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Categories list
    const allCategories = db.getCategories();

    // Filter products
    let filteredProducts = [...products];

    if (selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter(p => (p.category || "").toLowerCase() === selectedCategory.toLowerCase());
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

    // Open Add Modal
    const openAddProductModal = () => {
        setModalMode("add");
        setEditingProductId("");
        setFormName("");
        setFormCategory(allCategories[0] || "rings");
        setFormPrice("");
        setFormComparePrice("");
        setFormDescription("");
        setFormImages(["https://cdn.zepio.io/blyo/branch_image/50b64328-0aad-46ad-beb2-3df2faf9aca7.webp"]);
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
        setFormCategory(product.category || "rings");
        setFormPrice(String(product.price || ""));
        setFormComparePrice(String(product.comparePrice || product.price || ""));
        setFormDescription(product.description || "");
        setFormImages(product.images && product.images.length > 0 ? [...product.images] : [""]);
        setFormVariants(Array.isArray(product.variants) ? product.variants.join(", ") : "Standard");
        setFormStock(String(product.stock !== undefined ? product.stock : 20));
        setFormFeatured(Boolean(product.featured));
        setFormNewArrival(Boolean(product.newArrival));
        setIsProductModalOpen(true);
    };

    // Handle Save Product
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

        const validImages = formImages.map(img => img.trim()).filter(Boolean);
        const variantsList = formVariants
            .split(",")
            .map(v => v.trim())
            .filter(Boolean);

        const payload = {
            name: formName.trim(),
            slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            category: formCategory.toLowerCase().trim(),
            price: Number(formPrice),
            comparePrice: Number(formComparePrice) || Number(formPrice),
            description: formDescription.trim(),
            images: validImages.length > 0 ? validImages : ["https://cdn.zepio.io/blyo/branch_image/50b64328-0aad-46ad-beb2-3df2faf9aca7.webp"],
            variants: variantsList.length > 0 ? variantsList : ["Standard"],
            stock: Number(formStock) || 0,
            featured: formFeatured,
            newArrival: formNewArrival
        };

        if (modalMode === "edit" && editingProductId) {
            payload.id = editingProductId;
            db.saveProduct(payload);
            showToast(`Updated "${formName}" successfully.`);
        } else {
            db.saveProduct(payload);
            showToast(`Added "${formName}" to catalog.`);
        }

        refreshData();
        setIsProductModalOpen(false);
    };

    // Handle Delete Product
    const handleDeleteProduct = (product) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"?`);
        if (confirmed) {
            db.deleteProduct(product.id);
            refreshData();
            showToast(`Deleted "${product.name}".`);
        }
    };

    // Handle Inline Quick Price Change
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
        const changes = inlinePrices[product.id];
        if (!changes) return;

        const newPrice = changes.price !== undefined ? Number(changes.price) : product.price;
        const newComparePrice = changes.comparePrice !== undefined ? Number(changes.comparePrice) : product.comparePrice;

        if (isNaN(newPrice) || newPrice <= 0) {
            showToast("Please enter a valid price.");
            return;
        }

        db.updateProductPrice(product.id, newPrice, newComparePrice);
        refreshData();
        showToast(`Saved price for ${product.name}: ₹${newPrice}`);

        // Clear inline state for this item
        setInlinePrices(prev => {
            const copy = { ...prev };
            delete copy[product.id];
            return copy;
        });
    };

    // Add Image field in modal
    const handleAddImageField = () => {
        setFormImages(prev => [...prev, ""]);
    };

    const handleImageChange = (index, value) => {
        setFormImages(prev => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const handleRemoveImageField = (index) => {
        setFormImages(prev => prev.filter((_, i) => i !== index));
    };

    // Add New Category
    const handleCreateCategory = (e) => {
        e.preventDefault();
        if (!newCategoryInput.trim()) return;
        const slug = db.addCategory(newCategoryInput);
        if (slug) {
            showToast(`Category "${slug}" added.`);
            setNewCategoryInput("");
            refreshData();
        }
    };

    // Reset Catalog with confirmation
    const handleResetCatalog = () => {
        const conf = window.confirm("Reset all products back to the original 205 authentic products? Any customized changes will be replaced.");
        if (conf) {
            db.resetToDefaultProducts();
            refreshData();
            showToast("Catalog reset to original 205 products.");
        }
    };

    // Download JSON export
    const handleDownloadJson = () => {
        try {
            const dataStr = db.exportProductsJson();
            const blob = new Blob([dataStr], { type: "application/json;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", url);
            dlAnchorElem.setAttribute("download", `accessify_products_${products.length}_catalog.json`);
            document.body.appendChild(dlAnchorElem);
            dlAnchorElem.click();
            document.body.removeChild(dlAnchorElem);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            showToast(`Downloaded catalog JSON (${products.length} products).`);
        } catch (err) {
            console.error("Download JSON error:", err);
            showToast("Download failed: " + err.message);
        }
    };

    // Copy JSON to clipboard
    const handleCopyJson = () => {
        try {
            const dataStr = db.exportProductsJson();
            navigator.clipboard.writeText(dataStr);
            showToast(`Copied ${products.length} products JSON to clipboard!`);
        } catch (err) {
            console.error("Clipboard copy error:", err);
            showToast("Could not copy directly. Please select text from the box below.");
        }
    };

    return html`
        <div class="admin-dashboard container anim-fade-in" style="padding-top: 110px; padding-bottom: 100px;">
            <!-- Top Navigation & Controls Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);">
                <div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h1 style="font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.05em;">
                            ACCESSIFY ADMIN
                        </h1>
                        <span style="font-size: 0.7rem; background: rgba(37, 211, 102, 0.15); color: var(--color-whatsapp); padding: 3px 8px; border-radius: 4px; font-weight: 700;">
                            LIVE
                        </span>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px;">
                        Customize prices, add/edit products, manage categories & photos.
                    </p>
                </div>

                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <button 
                        type="button" 
                        class="btn btn-primary" 
                        style="padding: 9px 16px; font-size: 0.85rem;"
                        onClick=${openAddProductModal}
                    >
                        <i data-lucide="plus-circle" style="width: 15px; height: 15px; margin-right: 6px;"></i>
                        Add Product
                    </button>

                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        style="padding: 9px 14px; font-size: 0.85rem;"
                        onClick=${() => setIsCategoryModalOpen(true)}
                    >
                        <i data-lucide="tag" style="width: 15px; height: 15px; margin-right: 6px;"></i>
                        Categories (${allCategories.length})
                    </button>

                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        style="padding: 9px 14px; font-size: 0.85rem;"
                        onClick=${() => setIsExportModalOpen(true)}
                    >
                        <i data-lucide="download" style="width: 15px; height: 15px; margin-right: 6px;"></i>
                        Export
                    </button>

                    <a href="#/" class="btn btn-secondary" style="padding: 9px 14px; font-size: 0.85rem;" title="View Store">
                        <i data-lucide="external-link" style="width: 15px; height: 15px; margin-right: 6px;"></i>
                        Store
                    </a>

                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        style="padding: 9px 12px; color: var(--text-muted);" 
                        onClick=${logout}
                        title="Logout"
                    >
                        <i data-lucide="log-out" style="width: 15px; height: 15px;"></i>
                    </button>
                </div>
            </div>

            <!-- Stats Bar -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
                <div class="card" style="padding: 16px; border-radius: 8px;">
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Total Products</div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">${products.length}</div>
                </div>

                <div class="card" style="padding: 16px; border-radius: 8px;">
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Categories</div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">${allCategories.length}</div>
                </div>

                <div class="card" style="padding: 16px; border-radius: 8px;">
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Filtered Results</div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-whatsapp); margin-top: 4px;">${filteredProducts.length}</div>
                </div>

                <div class="card" style="padding: 16px; border-radius: 8px;">
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">WhatsApp Line</div>
                    <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 8px;">+91 7012400815</div>
                </div>
            </div>

            <!-- Search, Filter & Quick Price Controls -->
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; align-items: center;">
                <div style="flex: 1; min-width: 220px; position: relative;">
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Search product name, category, or SKU..." 
                        value=${searchQuery} 
                        onInput=${e => setSearchQuery(e.target.value)}
                        style="padding-left: 36px;"
                    />
                    <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
                </div>

                <div style="min-width: 150px;">
                    <select 
                        class="form-control" 
                        value=${selectedCategory} 
                        onChange=${e => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories (${products.length})</option>
                        ${allCategories.map(cat => {
                            const count = products.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase()).length;
                            return html`<option value=${cat}>${cat.toUpperCase()} (${count})</option>`;
                        })}
                    </select>
                </div>

                <div style="min-width: 140px;">
                    <select 
                        class="form-control" 
                        value=${sortBy} 
                        onChange=${e => setSortBy(e.target.value)}
                    >
                        <option value="default">Default Order</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Product Name (A-Z)</option>
                    </select>
                </div>
            </div>

            <!-- Products List / Table -->
            <div class="card" style="border-radius: 10px; overflow: hidden; border: 1px solid var(--border-color);">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                        <thead>
                            <tr style="background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid var(--border-color); color: var(--text-muted); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.05em;">
                                <th style="padding: 14px 16px; width: 60px;">Image</th>
                                <th style="padding: 14px 16px;">Product Details</th>
                                <th style="padding: 14px 16px; width: 140px;">Selling Price (₹)</th>
                                <th style="padding: 14px 16px; width: 140px;">MRP / Compare (₹)</th>
                                <th style="padding: 14px 16px; width: 90px;">Stock</th>
                                <th style="padding: 14px 16px; text-align: right; width: 150px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredProducts.length === 0 && html`
                                <tr>
                                    <td colspan="6" style="padding: 40px; text-align: center; color: var(--text-muted);">
                                        No products match your search or filter.
                                    </td>
                                </tr>
                            `}
                            ${filteredProducts.map(product => {
                                const currentInline = inlinePrices[product.id] || {};
                                const editPrice = currentInline.price !== undefined ? currentInline.price : product.price;
                                const editCompare = currentInline.comparePrice !== undefined ? currentInline.comparePrice : (product.comparePrice || product.price);
                                const isDirty = currentInline.price !== undefined || currentInline.comparePrice !== undefined;
                                const discount = editCompare > editPrice ? Math.round(((editCompare - editPrice) / editCompare) * 100) : 0;

                                return html`
                                    <tr key=${product.id} style="border-bottom: 1px solid rgba(255, 255, 255, 0.04); transition: background 0.15s ease;">
                                        <!-- Thumbnail -->
                                        <td style="padding: 12px 16px;">
                                            <img 
                                                src=${product.images && product.images[0] ? product.images[0] : 'https://cdn.zepio.io/blyo/branch_image/50b64328-0aad-46ad-beb2-3df2faf9aca7.webp'} 
                                                alt=${product.name} 
                                                style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; background: #1a1a1a;"
                                                loading="lazy"
                                            />
                                        </td>

                                        <!-- Title & Category -->
                                        <td style="padding: 12px 16px;">
                                            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                                <a href=${`#/product/${product.id}`} target="_blank" style="color: inherit; text-decoration: none;">
                                                    ${product.name}
                                                </a>
                                            </div>
                                            <div style="display: flex; gap: 8px; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
                                                <span style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 3px; text-transform: uppercase;">
                                                    ${product.category || 'General'}
                                                </span>
                                                ${discount > 0 && html`
                                                    <span style="color: var(--color-whatsapp); font-weight: 600;">
                                                        -${discount}%
                                                    </span>
                                                `}
                                                ${product.sku_code && html`
                                                    <span>SKU: ${product.sku_code}</span>
                                                `}
                                            </div>
                                        </td>

                                        <!-- Editable Price -->
                                        <td style="padding: 12px 16px;">
                                            <div style="display: flex; align-items: center; gap: 4px;">
                                                <span style="color: var(--text-muted); font-weight: 600;">₹</span>
                                                <input 
                                                    type="number" 
                                                    class="form-control" 
                                                    style="width: 85px; padding: 6px 8px; font-weight: 700; font-size: 0.85rem;"
                                                    value=${editPrice} 
                                                    onInput=${e => handleInlinePriceChange(product.id, "price", e.target.value)}
                                                />
                                            </div>
                                        </td>

                                        <!-- Editable MRP / Compare Price -->
                                        <td style="padding: 12px 16px;">
                                            <div style="display: flex; align-items: center; gap: 4px;">
                                                <span style="color: var(--text-muted); font-weight: 600;">₹</span>
                                                <input 
                                                    type="number" 
                                                    class="form-control" 
                                                    style="width: 85px; padding: 6px 8px; font-size: 0.85rem; color: var(--text-secondary);"
                                                    value=${editCompare} 
                                                    onInput=${e => handleInlinePriceChange(product.id, "comparePrice", e.target.value)}
                                                />
                                            </div>
                                        </td>

                                        <!-- Stock -->
                                        <td style="padding: 12px 16px;">
                                            <span style="color: ${product.stock > 5 ? 'var(--text-secondary)' : '#ef4444'}; font-weight: 600;">
                                                ${product.stock !== undefined ? product.stock : 15}
                                            </span>
                                        </td>

                                        <!-- Actions -->
                                        <td style="padding: 12px 16px; text-align: right;">
                                            <div style="display: flex; justify-content: flex-end; gap: 6px;">
                                                ${isDirty && html`
                                                    <button 
                                                        class="btn btn-primary" 
                                                        style="padding: 5px 10px; font-size: 0.75rem;" 
                                                        onClick=${() => handleSaveInlinePrice(product)}
                                                        title="Save Price Changes"
                                                    >
                                                        Save
                                                    </button>
                                                `}

                                                <button 
                                                    class="btn btn-secondary" 
                                                    style="padding: 5px 8px;" 
                                                    onClick=${() => openEditProductModal(product)}
                                                    title="Edit Full Details"
                                                >
                                                    <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
                                                </button>

                                                <button 
                                                    class="btn btn-secondary" 
                                                    style="padding: 5px 8px; color: #ef4444;" 
                                                    onClick=${() => handleDeleteProduct(product)}
                                                    title="Delete Product"
                                                >
                                                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
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

            <!-- PRODUCT ADD / EDIT MODAL -->
            ${isProductModalOpen && html`
                <div 
                    class="admin-modal-backdrop" 
                    style="position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 16px; opacity: 1; pointer-events: auto;"
                    onClick=${e => { if (e.target === e.currentTarget) setIsProductModalOpen(false); }}
                >
                    <div 
                        class="card anim-scale-up" 
                        style="max-width: 620px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 28px; border-radius: 12px; background: #111111; border: 1px solid var(--border-color); box-shadow: 0 24px 48px rgba(0,0,0,0.9); position: relative; z-index: 100000;"
                        onClick=${e => e.stopPropagation()}
                    >
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.25rem;">
                                    ${modalMode === "edit" ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}
                                </h2>
                                <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    ${modalMode === "edit" ? "Modify pricing, title, photos, or stock" : "Create a new jewelry piece in your catalog"}
                                </p>
                            </div>
                            <button 
                                type="button" 
                                style="background: rgba(255,255,255,0.08); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;"
                                onClick=${() => setIsProductModalOpen(false)}
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit=${handleSaveProduct}>
                            <div class="form-group" style="margin-bottom: 14px;">
                                <label style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">Product Title *</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    placeholder="e.g. Chrome Cross Pendant Chain" 
                                    value=${formName} 
                                    onInput=${e => setFormName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                                <div class="form-group">
                                    <label style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">Category *</label>
                                    <select 
                                        class="form-control" 
                                        value=${formCategory} 
                                        onChange=${e => setFormCategory(e.target.value)}
                                    >
                                        ${allCategories.map(cat => html`<option value=${cat}>${cat.toUpperCase()}</option>`)}
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">Stock Quantity</label>
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        value=${formStock} 
                                        onInput=${e => setFormStock(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                                <div class="form-group">
                                    <label style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">Selling Price (₹) *</label>
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        placeholder="e.g. 899" 
                                        value=${formPrice} 
                                        onInput=${e => setFormPrice(e.target.value)} 
                                        required 
                                    />
                                </div>

                                <div class="form-group">
                                    <label style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">MRP / Compare Price (₹)</label>
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        placeholder="e.g. 1499" 
                                        value=${formComparePrice} 
                                        onInput=${e => setFormComparePrice(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div class="form-group" style="margin-bottom: 14px;">
                                <label style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">Description</label>
                                <textarea 
                                    class="form-control" 
                                    rows="3" 
                                    placeholder="High quality 316L stainless steel jewelry..." 
                                    value=${formDescription} 
                                    onInput=${e => setFormDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div class="form-group" style="margin-bottom: 14px;">
                                <label style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">Size / Variants (comma separated)</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    placeholder="e.g. Size 7, Size 8, Size 9, Size 10" 
                                    value=${formVariants} 
                                    onInput=${e => setFormVariants(e.target.value)} 
                                />
                            </div>

                            <!-- Images Management with Live Preview -->
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <label style="font-size: 0.8rem; color: var(--text-secondary);">Image URLs</label>
                                    <button 
                                        type="button" 
                                        class="btn btn-secondary" 
                                        style="padding: 4px 10px; font-size: 0.75rem;" 
                                        onClick=${handleAddImageField}
                                    >
                                        + Add Image URL
                                    </button>
                                </div>

                                ${formImages.map((imgUrl, idx) => html`
                                    <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                                        <input 
                                            type="url" 
                                            class="form-control" 
                                            placeholder="https://cdn.zepio.io/... or https://..." 
                                            value=${imgUrl} 
                                            onInput=${e => handleImageChange(idx, e.target.value)} 
                                            style="flex: 1;"
                                        />
                                        ${formImages.length > 1 && html`
                                            <button 
                                                type="button" 
                                                class="btn btn-secondary" 
                                                style="padding: 8px 10px; color: #ef4444;" 
                                                onClick=${() => handleRemoveImageField(idx)}
                                            >
                                                ✕
                                            </button>
                                        `}
                                    </div>
                                `)}

                                <!-- Visual Image Previews -->
                                <div style="display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding: 4px 0;">
                                    ${formImages.filter(Boolean).map((imgUrl, i) => html`
                                        <div style="position: relative; flex-shrink: 0; width: 64px; height: 64px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-color);">
                                            <img src=${imgUrl} alt="preview" style="width: 100%; height: 100%; object-fit: cover;" onError=${e => e.target.style.display='none'} />
                                            <span style="position: absolute; bottom: 2px; right: 2px; font-size: 0.6rem; background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 2px;">#${i+1}</span>
                                        </div>
                                    `)}
                                </div>
                            </div>

                            <div style="display: flex; gap: 20px; margin-bottom: 24px;">
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
                                    <input type="checkbox" checked=${formFeatured} onChange=${e => setFormFeatured(e.target.checked)} />
                                    Featured Drop
                                </label>

                                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
                                    <input type="checkbox" checked=${formNewArrival} onChange=${e => setFormNewArrival(e.target.checked)} />
                                    New Arrival Badge
                                </label>
                            </div>

                            <div style="display: flex; justify-content: flex-end; gap: 12px;">
                                <button 
                                    type="button" 
                                    class="btn btn-secondary" 
                                    onClick=${() => setIsProductModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" class="btn btn-primary" style="padding: 10px 24px; font-weight: 700;">
                                    ${modalMode === "edit" ? "Save Changes" : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `}

            <!-- CATEGORY MANAGER MODAL -->
            ${isCategoryModalOpen && html`
                <div 
                    class="admin-modal-backdrop" 
                    style="position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 16px; opacity: 1; pointer-events: auto;"
                    onClick=${e => { if (e.target === e.currentTarget) setIsCategoryModalOpen(false); }}
                >
                    <div 
                        class="card anim-scale-up" 
                        style="max-width: 500px; width: 100%; padding: 26px; border-radius: 12px; background: #111111; border: 1px solid var(--border-color); box-shadow: 0 24px 48px rgba(0,0,0,0.9); position: relative; z-index: 100000;"
                        onClick=${e => e.stopPropagation()}
                    >
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
                            <h2 style="font-family: var(--font-display); font-size: 1.2rem;">MANAGE CATEGORIES</h2>
                            <button 
                                type="button" 
                                style="background: rgba(255,255,255,0.08); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;" 
                                onClick=${() => setIsCategoryModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit=${handleCreateCategory} style="display: flex; gap: 8px; margin-bottom: 20px;">
                            <input 
                                type="text" 
                                class="form-control" 
                                placeholder="New category name (e.g. pendants)..." 
                                value=${newCategoryInput} 
                                onInput=${e => setNewCategoryInput(e.target.value)} 
                                style="flex: 1;"
                            />
                            <button type="submit" class="btn btn-primary" style="padding: 8px 16px;">
                                Add
                            </button>
                        </form>

                        <div style="max-height: 280px; overflow-y: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                                <thead>
                                    <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">
                                        <th style="padding: 8px; text-align: left;">Category</th>
                                        <th style="padding: 8px; text-align: right;">Product Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${allCategories.map(cat => {
                                        const count = products.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase()).length;
                                        return html`
                                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                                                <td style="padding: 10px 8px; font-weight: 600; text-transform: uppercase;">${cat}</td>
                                                <td style="padding: 10px 8px; text-align: right; color: var(--color-whatsapp); font-weight: 700;">${count} items</td>
                                            </tr>
                                        `;
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `}

            <!-- EXPORT & BACKUP MODAL -->
            ${isExportModalOpen && html`
                <div 
                    class="admin-modal-backdrop" 
                    style="position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 16px; opacity: 1; pointer-events: auto;"
                    onClick=${e => { if (e.target === e.currentTarget) setIsExportModalOpen(false); }}
                >
                    <div 
                        class="card anim-scale-up" 
                        style="max-width: 580px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 26px; border-radius: 12px; background: #111111; border: 1px solid var(--border-color); box-shadow: 0 24px 48px rgba(0,0,0,0.9); position: relative; z-index: 100000;"
                        onClick=${e => e.stopPropagation()}
                    >
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.2rem;">EXPORT & BACKUP CATALOG</h2>
                                <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    ${products.length} products with custom prices & photos
                                </p>
                            </div>
                            <button 
                                type="button" 
                                style="background: rgba(255,255,255,0.08); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;" 
                                onClick=${() => setIsExportModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 18px;">
                            Download your product catalog as JSON or copy it directly. Perfect for backups or bulk updates.
                        </p>

                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                            <button 
                                type="button" 
                                class="btn btn-primary" 
                                style="width: 100%; padding: 12px; justify-content: center; font-weight: 700;"
                                onClick=${handleDownloadJson}
                            >
                                <i data-lucide="download" style="width: 16px; height: 16px; margin-right: 8px;"></i>
                                Download products.json (${products.length} Items)
                            </button>

                            <button 
                                type="button" 
                                class="btn btn-secondary" 
                                style="width: 100%; padding: 12px; justify-content: center; font-weight: 700;"
                                onClick=${handleCopyJson}
                            >
                                <i data-lucide="copy" style="width: 16px; height: 16px; margin-right: 8px;"></i>
                                Copy JSON to Clipboard
                            </button>
                        </div>

                        <!-- Raw JSON Preview / Select All for Mobile -->
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Raw JSON Data</span>
                                <button 
                                    type="button" 
                                    style="background: transparent; border: none; color: var(--color-whatsapp); font-size: 0.75rem; cursor: pointer;"
                                    onClick=${e => {
                                        const ta = e.currentTarget.closest('.card').querySelector('textarea');
                                        if (ta) {
                                            ta.select();
                                            document.execCommand('copy');
                                            showToast("Selected and copied JSON!");
                                        }
                                    }}
                                >
                                    Select & Copy All
                                </button>
                            </div>
                            <textarea 
                                readonly 
                                rows="6" 
                                style="width: 100%; font-family: monospace; font-size: 0.72rem; background: #000; color: #10b981; border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; resize: vertical;"
                                value=${db.exportProductsJson()}
                                onClick=${e => e.target.select()}
                            ></textarea>
                        </div>

                        <div style="padding-top: 14px; border-top: 1px solid var(--border-color);">
                            <button 
                                type="button" 
                                class="btn btn-secondary" 
                                style="width: 100%; padding: 10px; justify-content: center; color: #ef4444; border-color: rgba(239, 68, 68, 0.3); font-size: 0.8rem;"
                                onClick=${handleResetCatalog}
                            >
                                <i data-lucide="rotate-ccw" style="width: 14px; height: 14px; margin-right: 6px;"></i>
                                Reset Catalog to Default Jewelry Products
                            </button>
                        </div>
                    </div>
                </div>
            `}
        </div>
    `;
};
