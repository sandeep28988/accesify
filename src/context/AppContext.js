import { h, createContext } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { db } from '../services/db.js';

const html = htm.bind(h);

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Database Loaded States
    const [products, setProducts] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [orders, setOrders] = useState([]);
    
    // Interactive UI States
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState(null);
    const [toasts, setToasts] = useState([]);
    
    // Overlay States
    const [cartOpen, setCartOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Navigation / Routing State
    const [currentRoute, setCurrentRoute] = useState("");

    // Coupon Calculations
    const [activeCoupon, setActiveCoupon] = useState(null);

    // Initial Load & Synchronisation
    useEffect(() => {
        // Load initial values from DB service
        setProducts(db.getProducts());
        setCoupons(db.getCoupons());
        setOrders(db.getOrders());
        
        // Load initial local states
        const savedCart = localStorage.getItem("accessify_cart") || localStorage.getItem("valoir_cart");
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                const valid = Array.isArray(parsed) ? parsed.filter(i => i.id && i.id.startsWith("acc_")) : [];
                setCart(valid);
            } catch (e) {}
        }
        
        const savedWishlist = localStorage.getItem("accessify_wishlist") || localStorage.getItem("valoir_wishlist");
        if (savedWishlist) {
            try {
                const parsed = JSON.parse(savedWishlist);
                const valid = Array.isArray(parsed) ? parsed.filter(i => i.id && i.id.startsWith("acc_")) : [];
                setWishlist(valid);
            } catch (e) {}
        }

        const savedUser = localStorage.getItem("accessify_current_user") || localStorage.getItem("valoir_current_user");
        if (savedUser) setUser(JSON.parse(savedUser));

        // Read initial URL Hash
        const handleHashChange = () => {
            const hash = window.location.hash || "#/";
            setCurrentRoute(hash);
        };
        
        handleHashChange();
        window.addEventListener("hashchange", handleHashChange);
        
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    // Sync state helpers
    const refreshData = () => {
        setProducts(db.getProducts());
        setCoupons(db.getCoupons());
        setOrders(db.getOrders());
    };

    // TOAST NOTIFICATIONS
    const showToast = (message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message }]);
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // CART OPERATIONS
    const addToCart = (product, quantity = 1, variant = "") => {
        if (product.stock === 0) {
            showToast(`"${product.name}" is currently out of stock.`);
            return;
        }

        const selectedVariant = variant || (product.variants && product.variants[0]) || "Standard";
        
        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(
                item => item.id === product.id && item.variant === selectedVariant
            );

            let newCart;
            if (existingIndex !== -1) {
                const updatedItem = {
                    ...prevCart[existingIndex],
                    quantity: prevCart[existingIndex].quantity + quantity
                };
                newCart = [...prevCart];
                newCart[existingIndex] = updatedItem;
            } else {
                newCart = [
                    ...prevCart,
                    {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        variant: selectedVariant,
                        quantity: quantity,
                        category: product.category
                    }
                ];
            }
            
            localStorage.setItem("valoir_cart", JSON.stringify(newCart));
            return newCart;
        });
        
        showToast(`Added ${product.name} (${selectedVariant}) to cart.`);
    };

    const removeFromCart = (productId, variant) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item => !(item.id === productId && item.variant === variant));
            localStorage.setItem("valoir_cart", JSON.stringify(newCart));
            return newCart;
        });
        showToast("Removed item from cart.");
    };

    const updateCartQuantity = (productId, variant, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, variant);
            return;
        }
        
        // Check stock availability
        const product = products.find(p => p.id === productId);
        if (product && quantity > product.stock) {
            showToast(`Only ${product.stock} units available in stock.`);
            return;
        }

        setCart(prevCart => {
            const newCart = prevCart.map(item => {
                if (item.id === productId && item.variant === variant) {
                    return { ...item, quantity };
                }
                return item;
            });
            localStorage.setItem("valoir_cart", JSON.stringify(newCart));
            return newCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("valoir_cart");
        setActiveCoupon(null);
    };

    // COUPON OPERATIONS
    const applyCoupon = (code) => {
        const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
        if (found) {
            setActiveCoupon(found);
            showToast(`Coupon "${found.code}" applied successfully!`);
            return true;
        } else {
            showToast("Invalid or expired coupon code.");
            return false;
        }
    };

    const removeCoupon = () => {
        setActiveCoupon(null);
        showToast("Coupon removed.");
    };

    // WISHLIST OPERATIONS
    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(p => p.id === product.id);
            let newWishlist;
            if (exists) {
                newWishlist = prev.filter(p => p.id !== product.id);
                showToast(`Removed ${product.name} from wishlist.`);
            } else {
                newWishlist = [...prev, product];
                showToast(`Added ${product.name} to wishlist.`);
            }
            localStorage.setItem("valoir_wishlist", JSON.stringify(newWishlist));
            return newWishlist;
        });
    };

    // AUTH OPERATIONS - Secured Admin Authentication
    const login = (emailOrId, password) => {
        const idTrim = (emailOrId || "").trim();
        const passTrim = (password || "").trim();

        if (!idTrim || !passTrim) {
            showToast("Please enter both ID and Password.");
            return false;
        }

        // Exact secure admin credentials requested by owner:
        // ID: 7012400815
        // Password: adhi7012400815
        const isAdmin = 
            (idTrim === "7012400815" || idTrim.toLowerCase() === "admin@accessify.com" || idTrim.toLowerCase() === "admin") && 
            passTrim === "adhi7012400815";

        if (isAdmin) {
            const adminUser = { 
                username: "Admin (7012400815)", 
                email: "7012400815", 
                role: "admin" 
            };
            setUser(adminUser);
            localStorage.setItem("accessify_current_user", JSON.stringify(adminUser));
            showToast("Welcome to ACCESSIFY Admin Dashboard!");
            window.location.hash = "#/admin";
            return true;
        }

        // If attempting admin ID with wrong password
        if (idTrim === "7012400815" || idTrim.toLowerCase() === "admin@accessify.com" || idTrim.toLowerCase() === "admin") {
            showToast("Incorrect Admin Password.");
            return false;
        }

        // Standard customer login
        const standardUser = { 
            username: idTrim.includes("@") ? idTrim.split("@")[0] : idTrim, 
            email: idTrim, 
            role: "user" 
        };
        setUser(standardUser);
        localStorage.setItem("accessify_current_user", JSON.stringify(standardUser));
        showToast("Logged in successfully.");
        window.location.hash = "#/";
        return true;
    };

    const directAdminLogin = () => {
        // Disabled for security - credentials required
        showToast("Admin access is secured. Please enter your ID and password.");
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("accessify_current_user");
        showToast("Logged out of Admin.");
        window.location.hash = "#/admin";
    };

    // CART CALCULATIONS
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discountAmount = 0;
    if (activeCoupon) {
        if (activeCoupon.type === "percentage") {
            discountAmount = parseFloat(((subtotal * activeCoupon.value) / 100).toFixed(2));
        } else if (activeCoupon.type === "flat") {
            discountAmount = activeCoupon.value;
        }
    }

    const shippingCharge = subtotal >= 1000 || subtotal === 0 ? 0 : 30;
    const finalTotal = Math.max(0, subtotal - discountAmount + shippingCharge);

    // ORDER OPERATIONS
    const placeOrder = (addressDetails, paymentMethod) => {
        if (cart.length === 0) return null;

        const orderData = {
            customerName: addressDetails.name,
            email: addressDetails.email || (user ? user.email : ""),
            phone: addressDetails.phone,
            address: `${addressDetails.street}, ${addressDetails.city}, ${addressDetails.state}, ${addressDetails.zip}`,
            items: [...cart],
            subtotal,
            discount: discountAmount,
            shipping: shippingCharge,
            total: finalTotal,
            paymentMethod,
        };

        const newOrder = db.createOrder(orderData);
        if (newOrder) {
            clearCart();
            refreshData(); // Refresh product inventory count & list of orders
            showToast(`Order ${newOrder.id} placed successfully!`);
            return newOrder;
        }
        return null;
    };

    // Navigation helper
    const navigate = (hash) => {
        window.location.hash = hash;
    };

    return html`
        <${AppContext.Provider} value=${{
            products,
            coupons,
            orders,
            cart,
            wishlist,
            user,
            toasts,
            cartOpen,
            setCartOpen,
            searchOpen,
            setSearchOpen,
            searchQuery,
            setSearchQuery,
            currentRoute,
            activeCoupon,
            subtotal,
            discountAmount,
            shippingCharge,
            finalTotal,
            refreshData,
            showToast,
            removeToast,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
            applyCoupon,
            removeCoupon,
            toggleWishlist,
            login,
            directAdminLogin,
            logout,
            placeOrder,
            navigate
        }}>
            ${children}
        </${AppContext.Provider}>
    `;
};
