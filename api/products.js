const GIST_ID = '06e8f373b416770af58aaa695600f62c';
// Central persistent database authentication token configured securely in Vercel environment variables
const GITHUB_TOKEN = process.env.GITHUB_SYNC_TOKEN;

// Fetch current products from central persistent database
async function fetchCentralProducts() {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
            'User-Agent': 'Accessify-Serverless-API',
            'Accept': 'application/vnd.github.v3+json',
            ...(GITHUB_TOKEN ? { 'Authorization': `token ${GITHUB_TOKEN}` } : {})
        }
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch from central DB: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    const file = data.files && data.files['products.json'];
    if (!file || !file.content) {
        return [];
    }
    return JSON.parse(file.content);
}

// Persist updated products to central persistent database
async function saveCentralProducts(products) {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'Accessify-Serverless-API',
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                'products.json': {
                    content: JSON.stringify(products)
                }
            }
        })
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to save to central DB: ${res.status} ${errText}`);
    }
    const data = await res.json();
    return data;
}

export default async function handler(req, res) {
    // 1. Strict Anti-Cache Headers: Ensure zero caching on CDN, browser, proxy, or ISP
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const products = await fetchCentralProducts();
            return res.status(200).json({
                success: true,
                count: products.length,
                timestamp: Date.now(),
                products
            });
        }

        if (req.method === 'POST' || req.method === 'PUT') {
            let body = req.body;
            if (typeof body === 'string') {
                try { body = JSON.parse(body); } catch (e) {}
            }

            if (!body) {
                return res.status(400).json({ success: false, error: 'Request body is required.' });
            }

            const currentProducts = await fetchCentralProducts();

            // Bulk replace action (e.g. catalog reset or import)
            if (body.action === 'replace_all' && Array.isArray(body.products)) {
                await saveCentralProducts(body.products);
                return res.status(200).json({
                    success: true,
                    count: body.products.length,
                    products: body.products
                });
            }

            const targetProduct = body.product || body;
            if (!targetProduct || typeof targetProduct !== 'object') {
                return res.status(400).json({ success: false, error: 'Product object is required.' });
            }

            const targetId = targetProduct.id ? String(targetProduct.id).trim() : null;
            const index = targetId ? currentProducts.findIndex(p => p.id === targetId) : -1;

            let updatedProduct = null;
            if (index !== -1) {
                // Update existing product
                currentProducts[index] = {
                    ...currentProducts[index],
                    ...targetProduct,
                    id: targetId,
                    name: (targetProduct.name || currentProducts[index].name || 'Product').trim(),
                    price: Number(targetProduct.price) || 0,
                    comparePrice: Number(targetProduct.comparePrice) || Number(targetProduct.price) || 0,
                    stock: targetProduct.stock !== undefined ? Number(targetProduct.stock) : (currentProducts[index].stock || 20),
                    status: targetProduct.status || currentProducts[index].status || 'active',
                    images: Array.isArray(targetProduct.images) && targetProduct.images.length > 0 
                        ? targetProduct.images 
                        : (currentProducts[index].images || ['assets/images/hero-hand.jpg'])
                };
                updatedProduct = currentProducts[index];
            } else {
                // Create new product and place at top of catalog
                const generatedId = targetId || `acc_custom_${Date.now()}`;
                const slug = (targetProduct.name || 'product')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');

                updatedProduct = {
                    id: generatedId,
                    original_id: Date.now(),
                    name: (targetProduct.name || 'New Product').trim(),
                    slug: slug,
                    category: targetProduct.category || 'chains',
                    price: Number(targetProduct.price) || 0,
                    comparePrice: Number(targetProduct.comparePrice) || Number(targetProduct.price) || 0,
                    description: (targetProduct.description || '').trim(),
                    images: Array.isArray(targetProduct.images) && targetProduct.images.length > 0 
                        ? targetProduct.images 
                        : ['assets/images/hero-hand.jpg'],
                    variants: Array.isArray(targetProduct.variants) && targetProduct.variants.length > 0 
                        ? targetProduct.variants 
                        : ['Standard'],
                    stock: targetProduct.stock !== undefined ? Number(targetProduct.stock) : 25,
                    status: targetProduct.status || 'active',
                    sku_code: targetProduct.sku_code || `ACC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                    featured: Boolean(targetProduct.featured),
                    newArrival: targetProduct.newArrival !== undefined ? Boolean(targetProduct.newArrival) : true,
                    rating: Number(targetProduct.rating) || 4.9,
                    numReviews: Number(targetProduct.numReviews) || 1,
                    tags: Array.isArray(targetProduct.tags) && targetProduct.tags.length > 0 
                        ? targetProduct.tags 
                        : [targetProduct.category || 'chains']
                };
                currentProducts.unshift(updatedProduct);
            }

            await saveCentralProducts(currentProducts);

            return res.status(200).json({
                success: true,
                message: index !== -1 ? 'Product updated in central database.' : 'Product created in central database.',
                count: currentProducts.length,
                product: updatedProduct,
                products: currentProducts
            });
        }

        if (req.method === 'DELETE') {
            const idToDelete = req.query.id || (req.body && req.body.id);
            if (!idToDelete) {
                return res.status(400).json({ success: false, error: 'Product ID is required for deletion.' });
            }

            const currentProducts = await fetchCentralProducts();
            const filtered = currentProducts.filter(p => p.id !== idToDelete);

            await saveCentralProducts(filtered);

            return res.status(200).json({
                success: true,
                message: `Product ${idToDelete} deleted from central database.`,
                count: filtered.length,
                products: filtered
            });
        }

        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
    } catch (err) {
        console.error('API /api/products error:', err);
        return res.status(500).json({
            success: false,
            error: err.message || 'Internal server error while syncing central database.'
        });
    }
}
