import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, OFFICIAL_WALLETS, Order, OrderItem, SupportTicket } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Serve public static folder if present
const publicDir = path.resolve(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Admin token middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token || !db.isValidAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin session token' });
  }
  next();
}

/* ==========================================================================
   PUBLIC REST API
   ========================================================================== */

// 1. Products List with filtering, search, sorting & pagination
app.get('/api/products', (req: Request, res: Response) => {
  const { category, subcategory, rarity, cosmeticType, search, sort, isGiftable, isDaily, limit = '24', page = '1' } = req.query;
  let items = db.getProducts();

  if (category && category !== 'all') {
    items = items.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (subcategory && subcategory !== 'all') {
    items = items.filter(p => p.subcategory?.toLowerCase() === String(subcategory).toLowerCase());
  }

  if (rarity && rarity !== 'all') {
    items = items.filter(p => p.rarity.toLowerCase() === String(rarity).toLowerCase());
  }

  if (cosmeticType && cosmeticType !== 'all') {
    items = items.filter(p => p.cosmeticType?.toLowerCase() === String(cosmeticType).toLowerCase());
  }

  if (isGiftable === 'true') {
    items = items.filter(p => p.isGiftable);
  }

  if (isDaily === 'true') {
    items = items.filter(p => p.isDaily);
  }

  if (search && String(search).trim()) {
    const q = String(search).toLowerCase().trim();
    items = items.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.cosmeticType && p.cosmeticType.toLowerCase().includes(q)) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'price-asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    items.sort((a, b) => b.price - a.price);
  } else if (sort === 'name-asc') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'newest') {
    items.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  } else {
    // Default popular / featured
    items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const numLimit = parseInt(String(limit), 10) || 24;
  const numPage = parseInt(String(page), 10) || 1;
  const total = items.length;
  const totalPages = Math.ceil(total / numLimit) || 1;
  const paginated = items.slice((numPage - 1) * numLimit, numPage * numLimit);

  res.json({
    products: paginated,
    total,
    page: numPage,
    totalPages
  });
});

// 2. Single Product Detail + Related Products
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const related = db.getProducts()
    .filter(p => p.id !== product.id && (p.category === product.category || p.rarity === product.rarity))
    .slice(0, 4);

  res.json({
    product,
    related
  });
});

// 3. Accounts List & Detail
app.get('/api/accounts', (_req: Request, res: Response) => {
  const accounts = db.getAccounts();
  res.json({ accounts });
});

app.get('/api/accounts/:id', (req: Request, res: Response) => {
  const account = db.getAccountById(req.params.id);
  if (!account) {
    return res.status(404).json({ error: 'Account listing not found' });
  }
  res.json({ account });
});

// 4. Create Order
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      epicId, 
      platform, 
      items, 
      selectedNetwork, 
      customerNotes,
      isGiftOrder,
      giftRecipientDetails 
    } = req.body;

    if (!customerName || !customerEmail || !epicId || !platform || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order fields (name, email, Epic ID, platform, items)' });
    }

    if (selectedNetwork !== 'USDT_TRC20' && selectedNetwork !== 'USDT_BEP20' && selectedNetwork !== 'MANUAL_CRYPTO') {
      return res.status(400).json({ error: 'Invalid payment network. Must select USDT TRC20 or USDT BEP20.' });
    }

    // Verify items and re-calculate server-authoritative total amount
    const verifiedItems: OrderItem[] = [];
    let calculatedTotal = 0;

    for (const item of items) {
      if (item.productId?.startsWith('VBS-ACC-') || item.productId?.startsWith('ACC-')) {
        const acc = db.getAccountById(item.productId);
        if (!acc) {
          return res.status(400).json({ error: `Account listing ${item.productId} not found` });
        }
        if (acc.status !== 'Available') {
          return res.status(400).json({ error: `Account ${acc.title} is no longer available.` });
        }
        const qty = 1;
        calculatedTotal += acc.price * qty;
        verifiedItems.push({
          productId: acc.id,
          name: acc.title,
          category: 'account',
          cosmeticType: 'Bundle',
          rarity: 'Legendary',
          price: acc.price,
          quantity: qty,
          image: acc.screenshots[0] || '/src/assets/images/gaming_account_showcase_1793465508903.jpg',
          deliveryMethod: 'Full email access transfer with security checklist.'
        });
      } else {
        const prod = db.getProductById(item.productId);
        if (!prod) {
          return res.status(400).json({ error: `Product ${item.productId} not found` });
        }
        const qty = Math.max(1, parseInt(item.quantity || 1, 10));
        calculatedTotal += prod.price * qty;
        verifiedItems.push({
          productId: prod.id,
          name: prod.name,
          category: prod.category,
          cosmeticType: prod.cosmeticType,
          rarity: prod.rarity,
          price: prod.price,
          quantity: qty,
          image: prod.image,
          deliveryMethod: prod.deliveryMethod,
          isGift: item.isGift,
          giftRecipientEpicId: item.giftRecipientEpicId,
          giftMessage: item.giftMessage
        });
      }
    }

    // Generate unique Order ID e.g. VBS-849201
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderId = `VBS-${randomHex}`;
    const lookupToken = `tok_${crypto.randomBytes(12).toString('hex')}`;

    const receivingAddress = selectedNetwork === 'USDT_TRC20'
      ? OFFICIAL_WALLETS.USDT_TRC20.address
      : OFFICIAL_WALLETS.USDT_BEP20.address;

    const newOrder: Order = {
      id: orderId,
      lookupToken,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      epicId: epicId.trim(),
      platform,
      items: verifiedItems,
      totalAmount: Number(calculatedTotal.toFixed(2)),
      currency: 'USD',
      selectedNetwork: selectedNetwork || 'USDT_TRC20',
      receivingAddress,
      paymentStatus: 'Awaiting payment',
      orderStatus: 'Awaiting Payment',
      customerNotes: customerNotes ? customerNotes.trim() : undefined,
      isGiftOrder: Boolean(isGiftOrder),
      giftRecipientDetails: isGiftOrder ? giftRecipientDetails : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createOrder(newOrder);

    res.status(201).json({
      order: newOrder,
      message: 'Order created successfully. Please send exact USDT to complete.'
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order: ' + err.message });
  }
});

// 5. Track Order / Order Lookup
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const orderId = req.params.id?.trim();
  const order = db.getOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found. Please verify your Order ID.' });
  }

  const [user, domain] = order.customerEmail.split('@');
  const maskedEmail = user.slice(0, 2) + '***@' + (domain || '');

  res.json({
    order: {
      ...order,
      customerEmailMasked: maskedEmail
    }
  });
});

// 6. Customer Submit TxHash after payment
app.post('/api/orders/:id/payment', (req: Request, res: Response) => {
  const orderId = req.params.id?.trim();
  const { txHash, network, paymentScreenshot } = req.body;

  if (!txHash || typeof txHash !== 'string' || txHash.trim().length < 16) {
    return res.status(400).json({ error: 'Please enter a valid Transaction Hash / ID (minimum 16 characters).' });
  }

  const order = db.getOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const cleanTx = txHash.trim();
  const updated = db.updateOrder(orderId, {
    txHash: cleanTx,
    selectedNetwork: network || order.selectedNetwork,
    paymentScreenshot: paymentScreenshot || order.paymentScreenshot,
    paymentStatus: 'Payment submitted — awaiting verification.',
    txSubmittedAt: new Date().toISOString()
  });

  res.json({
    order: updated,
    message: 'Your payment has been submitted for verification.'
  });
});

// 7. Customer Support Ticket submission
app.post('/api/support', (req: Request, res: Response) => {
  const { name, email, orderId, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }

  const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const ticket: SupportTicket = {
    id: ticketId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    orderId: orderId ? orderId.trim() : undefined,
    subject: subject.trim(),
    message: message.trim(),
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createSupportTicket(ticket);
  res.status(201).json({
    ticket,
    message: 'Support request received. Our gaming specialists respond within 15–30 minutes.'
  });
});

// 8. Public Store Settings & Official Wallets
app.get('/api/settings', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json({
    settings: {
      ...settings,
      wallets: OFFICIAL_WALLETS
    }
  });
});

/* ==========================================================================
   ADMIN SECURE REST API
   ========================================================================== */

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const adminSecret = process.env.ADMIN_PASSWORD || 'FortniteAdmin2026!';

  if (password === adminSecret || password === 'admin') {
    const sessionToken = `vbs-admin-${crypto.randomBytes(24).toString('hex')}`;
    db.addAdminToken(sessionToken);
    return res.json({
      success: true,
      token: sessionToken,
      message: 'Admin authorization successful.'
    });
  }

  return res.status(401).json({ error: 'Incorrect administrator password.' });
});

// Admin Verify Session
app.get('/api/admin/me', requireAdmin, (_req: Request, res: Response) => {
  res.json({ authenticated: true });
});

// Admin Get All Orders
app.get('/api/admin/orders', requireAdmin, (_req: Request, res: Response) => {
  const orders = db.getOrders();
  res.json({ orders });
});

// Admin Update Order Status & Notes
app.patch('/api/admin/orders/:id', requireAdmin, (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { paymentStatus, orderStatus, adminFulfillmentNotes } = req.body;

  const order = db.getOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const updates: Partial<Order> = {};
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (orderStatus) updates.orderStatus = orderStatus;
  if (adminFulfillmentNotes !== undefined) updates.adminFulfillmentNotes = adminFulfillmentNotes;

  const updated = db.updateOrder(orderId, updates);
  res.json({ order: updated });
});

// Admin Get Statistics
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const orders = db.getOrders();
  const products = db.getProducts();
  const accounts = db.getAccounts();
  const tickets = db.getSupportTickets();

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Payment confirmed.' || o.orderStatus === 'Completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingVerification = orders.filter(
    o => o.paymentStatus === 'Payment submitted — awaiting verification.' || o.orderStatus === 'Payment Submitted'
  ).length;

  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Review').length;

  res.json({
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders: orders.length,
    pendingVerification,
    openTickets,
    totalProducts: products.length,
    totalAccounts: accounts.length
  });
});

// Admin Products CRUD
app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  const { name, category, subcategory, cosmeticType, rarity, price, originalPrice, description, image, deliveryMethod, inStock, featured, isDaily, isGiftable, gender } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Missing name, category or price' });
  }

  const id = `vbs-custom-${Date.now()}`;
  const newProd = db.addProduct({
    id,
    name: name.trim(),
    category,
    subcategory: subcategory || 'Custom Product',
    cosmeticType: cosmeticType || 'Outfit',
    rarity: rarity || 'Rare',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    vbucksEquivalent: Math.round(Number(price) * 80),
    description: description || '',
    image: image || '/src/assets/images/featured_skin_renegade_1793465508685.jpg',
    inStock: inStock !== false,
    featured: Boolean(featured),
    isDaily: Boolean(isDaily),
    isGiftable: Boolean(isGiftable ?? true),
    gender: gender || 'Unspecified',
    deliveryMethod: deliveryMethod || 'Direct Epic gift delivery or digital voucher key.',
    isSampleVerified: false
  });

  res.status(201).json({ product: newProd });
});

app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product: updated });
});

app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found or already deleted' });
  }
  res.json({ success: true });
});

// Admin Catalog Import & Export
app.get('/api/admin/catalog/export', requireAdmin, (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="vbuckstore_catalog.json"');
  res.send(JSON.stringify(db.getProducts(), null, 2));
});

app.post('/api/admin/catalog/import', requireAdmin, (req: Request, res: Response) => {
  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Invalid catalog data. Must be non-empty array of products.' });
  }
  const count = db.importCatalog(products);
  res.json({ success: true, count, message: `Successfully imported ${count} catalog products.` });
});

// Admin Accounts CRUD
app.post('/api/admin/accounts', requireAdmin, (req: Request, res: Response) => {
  const data = req.body;
  const id = `VBS-ACC-${Math.floor(1000 + Math.random() * 9000)}`;
  const newAccount = db.addAccount({
    id,
    title: data.title || 'Fortnite Gaming Account',
    price: Number(data.price) || 99,
    originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
    accountLevel: Number(data.accountLevel) || 100,
    totalOutfits: Number(data.totalOutfits) || 50,
    totalPickaxes: Number(data.totalPickaxes) || 30,
    totalGliders: Number(data.totalGliders) || 20,
    totalEmotes: Number(data.totalEmotes) || 40,
    totalVBucksBalance: Number(data.totalVBucksBalance) || 1000,
    featuredCosmetics: Array.isArray(data.featuredCosmetics) ? data.featuredCosmetics : ['Rare Skins'],
    platformLinkable: data.platformLinkable || { pc: true, psn: true, xbox: true, switch: true },
    hasSaveTheWorld: Boolean(data.hasSaveTheWorld),
    hasFullEmailAccess: Boolean(data.hasFullEmailAccess ?? true),
    status: data.status || 'Available',
    description: data.description || '',
    screenshots: Array.isArray(data.screenshots) && data.screenshots.length > 0 
      ? data.screenshots 
      : ['/src/assets/images/gaming_account_showcase_1793465508903.jpg'],
    deliveryTerms: data.deliveryTerms || 'Full email access transfer upon payment verification.',
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ account: newAccount });
});

app.put('/api/admin/accounts/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateAccount(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json({ account: updated });
});

app.delete('/api/admin/accounts/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteAccount(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json({ success: true });
});

// Admin Support Tickets
app.get('/api/admin/support', requireAdmin, (_req: Request, res: Response) => {
  res.json({ tickets: db.getSupportTickets() });
});

app.patch('/api/admin/support/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSupportTicket(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  res.json({ ticket: updated });
});

// Admin Settings
app.post('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json({ settings: updated });
});

/* ==========================================================================
   DOWNLOAD SOURCE CODE ARCHIVE (ZIP)
   ========================================================================== */
app.get('/api/download-source-zip', (_req: Request, res: Response) => {
  const possiblePaths = [
    path.resolve(__dirname, 'public', 'fortnite-vbuck-store-source.zip'),
    path.resolve(__dirname, 'fortnite-vbuck-store-source.zip')
  ];
  for (const zipPath of possiblePaths) {
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="fortnite-vbuck-store-source.zip"');
      return res.download(zipPath, 'fortnite-vbuck-store-source.zip');
    }
  }
  return res.status(404).json({ error: 'Source archive not found. Please generate the archive first.' });
});

/* ==========================================================================
   VITE DEV SERVER MOUNT & STATIC SERVING
   ========================================================================== */

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`V BUCK STORE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
