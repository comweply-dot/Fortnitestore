# FORTNITE STORE · V BUCK STORE — Production Source Code

A complete, ultra-realistic, AAA gaming e-commerce marketplace built with **React 19**, **TypeScript**, **Tailwind CSS**, and an **Express.js** full-stack backend with persistent atomic JSON storage.

This source code package is completely production-ready and prepared for deployment on your own custom domain (e.g., via **GoDaddy**, **Vercel**, **GitHub**, **VPS**, or **cPanel**).

---

## 🌟 Key Features Included

- **Item Shop Daily Rotation**: Live countdown timer resetting at `00:00:00 UTC` with featured, daily, and bundle drop sections.
- **Dedicated V-Bucks Store (Exact USD Pricing)**:
  - 1,000 V-Bucks — $8.99 (Battle Pass Starter)
  - 2,400 V-Bucks — $11.50
  - 2,800 V-Bucks — $22.99
  - 4,500 V-Bucks — $18.50
  - 5,000 V-Bucks — $36.99
  - 12,500 V-Bucks — $45.00
  - 13,500 V-Bucks — $89.99
  - 20,000 V-Bucks — $72.00
  - 50,000 V-Bucks — $180.00
  - 100,000 V-Bucks — $360.00
- **105+ Authenticated Cosmetics Catalog**:
  - Outfits / Character Skins (Mythic, Legendary, Epic, Rare, Uncommon)
  - Pickaxes & Harvesting Tools
  - Gliders
  - Emotes & Dances
  - Back Blings
  - Weapon Wraps & Contrails
  - Music Packs & Loading Screens
  - Bundles & Themed Collections
- **Gifts Section**: Full locker gift dispatch flow with recipient Epic Games Display Name input, custom gift notes, and 48-hour Epic friend policy disclosure.
- **Gaming Accounts Marketplace**: Authenticated high-tier accounts with interactive multi-screenshot galleries, modal zoom, platform linkability badges, and full email access guarantee.
- **Shopping Cart & Checkout**: Slide-out cart drawer, unique order reference generation (`FS-XXXXXX`), and automated delivery email notifications.
- **Manual USDT Cryptocurrency Settlement**:
  - **USDT TRC20 (TRON Network)**: `THDha3vFBE4Lov5McPep6czmtqPsoLuAk5`
  - **USDT BEP20 (BNB Smart Chain)**: `0x70685190F17B71dFB0DACb802751dEA2dBd5fAFA`
  - Zero QR codes, zero credit cards/PayPal/banks, cross-chain loss warnings, and instant TxHash submission displaying *"Your payment has been submitted for verification."*
  - **Zero Password Guarantee**: Never requests customer passwords, 2FA codes, or private credentials.
- **Live Order Tracking (`/track`)**: 4-stage pipeline visualization (*Order Created → Payment Verification → Locker Dispatch → Completed*) with direct blockchain explorer links.
- **Customer Support Desk (`/support`)**: Support ticket submission, live FAQs, and policies.
- **Owner Admin Portal (`/admin`)**:
  - Protected with passcode: `FortniteAdmin2026!`
  - Real-time revenue, order queue, and ticket statistics.
  - One-click blockchain inspection on **Tronscan** and **BscScan**.
  - Order status updates and fulfillment note/voucher delivery.
  - Full product CRUD management + **Catalog JSON Import & Export**.
  - One-click source code archive export.

---

## 📁 Project Structure

```
├── data/
│   └── database.json          # Persistent database (products, accounts, orders, settings)
├── public/                    # Static public assets & source zip
├── server/
│   └── db.ts                  # Backend database controller & auto-seed system
├── src/
│   ├── assets/images/         # High-resolution gaming assets & banners
│   ├── components/            # React UI components (Navbar, Hero, VBucks, Shop, Admin, etc.)
│   ├── data/
│   │   └── initialCatalog.ts  # Master catalog with 105+ authentic items
│   ├── services/
│   │   └── api.ts             # API client with automatic client-side fallback
│   ├── types/
│   │   └── index.ts           # Complete TypeScript type definitions
│   ├── App.tsx                # Main SPA router & application state
│   ├── index.css              # Tailwind CSS styles & typography
│   └── main.tsx               # React DOM entry point
├── .env.example               # Safe environment configuration template
├── .gitignore                 # Git ignore configuration
├── index.html                 # Main HTML entry with SEO & Google Fonts
├── metadata.json              # Applet metadata & capability declarations
├── package.json               # Node dependencies & npm scripts
├── README.md                  # This documentation
├── server.ts                  # Express.js backend & Vite middleware server
├── tsconfig.json              # TypeScript compiler configuration
├── vercel.json                # Vercel deployment configuration
└── vite.config.ts             # Vite build configuration
```

---

## 🚀 Quickstart: Local Development

### 1. Requirements
- **Node.js**: version `20.x` or `22.x` (LTS recommended)
- **npm**: version `10.x` or higher

### 2. Installation
Extract your downloaded ZIP file, open a terminal in the project folder, and run:
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default values inside `.env`:
```env
PORT=3000
NODE_ENV=development
ADMIN_PASSWORD=FortniteAdmin2026!
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`. Both the Express REST API and the Vite frontend hot reload together on port 3000.

---

## 📦 Production Build

To build the optimized static production bundle:
```bash
npm run build
```
This generates the compiled assets in the `/dist` directory.

To run the production Node.js server:
```bash
npm run start
```

---

## 🌐 Deploying to GoDaddy with Your Custom Domain

You can deploy this project to your GoDaddy hosting account using any of the three options below depending on your GoDaddy plan.

### Option A: GoDaddy VPS / Dedicated Server (Recommended for Full-Stack)

1. **Connect via SSH** to your GoDaddy VPS:
   ```bash
   ssh root@your-godaddy-ip
   ```
2. **Install Node.js & Git**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get install -y nodejs nginx git
   npm install -g pm2 tsx
   ```
3. **Upload or Clone your code** to `/var/www/fortnite-store`:
   ```bash
   mkdir -p /var/www/fortnite-store
   cd /var/www/fortnite-store
   # Upload your unzipped files here
   npm install
   npm run build
   ```
4. **Start the server with PM2**:
   ```bash
   pm2 start "npx tsx server.ts" --name "fortnite-store"
   pm2 save
   pm2 startup
   ```
5. **Configure NGINX Reverse Proxy** (`/etc/nginx/sites-available/default`):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Reload NGINX:
   ```bash
   nginx -t && systemctl reload nginx
   ```
6. **Install Free SSL (Let's Encrypt)**:
   ```bash
   apt-get install -y certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

### Option B: GoDaddy cPanel "Setup Node.js App"

If your GoDaddy plan includes cPanel with the **Setup Node.js App** feature:

1. Log into your **GoDaddy cPanel**.
2. Click **Setup Node.js App** under the Software section.
3. Click **Create Application**:
   - **Node.js version**: Select `20.x` or latest available.
   - **Application mode**: `Production`.
   - **Application root**: `fortnite-store`.
   - **Application startup file**: `server.ts` (or compile via `tsc` to `dist/server.js`).
4. Upload your project files into the `fortnite-store` directory using **cPanel File Manager** or FTP.
5. In the cPanel Node.js interface, click **Run NPM Install**.
6. Click **Restart Application**.

---

### Option C: GoDaddy Shared Hosting (Static Frontend)

If you have traditional GoDaddy cPanel shared Linux hosting:

1. In your local terminal, build the project:
   ```bash
   npm install
   npm run build
   ```
2. Open the newly generated `dist` folder.
3. In GoDaddy cPanel, go to **File Manager** -> **public_html**.
4. Upload all files from inside `dist/` directly into `public_html`.
5. Create a file named `.htaccess` in `public_html` with these rewrite rules for single-page routing:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
*(Note: Because of our built-in client-side fallback in `src/services/api.ts`, all 105+ products, V-Bucks packages, item shop rotation, and accounts will display and function seamlessly even without a running Node backend!)*

---

### GoDaddy Domain DNS Configuration

To connect your GoDaddy domain name (e.g., `yourdomain.com`):
1. In GoDaddy, go to **My Products** -> **DNS Management** for your domain.
2. Edit the **A Record**:
   - **Type**: `A`
   - **Name**: `@`
   - **Value**: `Your VPS / Server IP Address`
   - **TTL**: `600 seconds` (or Default)
3. Edit the **CNAME Record**:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Value**: `@`
4. Changes typically propagate within 5–30 minutes worldwide.

---

## ⚡ Deploying to Vercel (1-Click)

The repository includes a pre-configured `vercel.json` file:

1. Push your code to a **GitHub** repository (see below).
2. Go to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Vercel automatically detects the **Vite** framework:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.
6. Once deployed, go to **Settings** -> **Domains** in Vercel and add your GoDaddy domain. Follow Vercel's instructions to add the CNAME record in your GoDaddy DNS!

---

## 🐙 Push to Your GitHub Account

1. Create a new empty repository on [GitHub](https://github.com/new) (e.g. `fortnite-vbuck-store`).
2. Run these commands from your local project root:
   ```bash
   git init
   git add .
   git commit -m "feat: complete production Fortnite Store & V-Bucks marketplace"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/fortnite-vbuck-store.git
   git push -u origin main
   ```

---

## 🔐 Admin Dashboard Access

- **URL**: Navigate to `/admin` or click **Owner Admin** in the store footer.
- **Default Password**: `FortniteAdmin2026!`
- **Capabilities**:
  - View incoming orders and verify submitted TxHashes.
  - Direct links to verify transactions on **Tronscan** (TRC20) and **BscScan** (BEP20).
  - Update payment status to `Confirmed`, dispatch fulfillment notes/vouchers, or cancel orders.
  - Add, edit, or delete catalog items.
  - Export and import catalog data in JSON.
  - Download full source code ZIP archive directly.

---

## 💰 Official Receiving Wallet Addresses

The store is pre-configured with the following official USDT receiving addresses:
- **USDT TRC20 (TRON Network)**:
  `THDha3vFBE4Lov5McPep6czmtqPsoLuAk5`
- **USDT BEP20 (BNB Smart Chain)**:
  `0x70685190F17B71dFB0DACb802751dEA2dBd5fAFA`

You can change these addresses anytime in `server/db.ts` or through the Admin Dashboard Settings panel.

---

## 📄 License & Legal Notice

FORTNITE STORE is an independent e-commerce gaming storefront. Fortnite, V-Bucks, and associated cosmetic trademarks are property of Epic Games, Inc. This application is designed for legitimate digital goods fulfillment and secure cryptocurrency settlements.
