# 🛍️ Hatim Zone - Premium E-commerce Platform

Hatim Zone is a high-performance, full-stack e-commerce solution built with **Next.js 16**, **React 19**, and **MongoDB**. It features a modern storefront and a comprehensive administrative dashboard for seamless business management.

---

## ✨ Core Features

### 🛒 Customer Storefront
- **Dynamic Product Discovery**: Advanced shop page with real-time search, category filtering, and optimized pagination.
- **Localized Experience**: Fully localized interface in **Bengali**, tailored for the Bangladesh market.
- **Responsive Design**: Mobile-first architecture ensuring a premium experience on all devices.
- **Shopping Experience**: Integrated Cart and Wishlist systems with persistent state.
- **Seamless Checkout**: Streamlined order placement workflow with **Cash on Delivery** support.
- **Success Tracking**: Dedicated order success pages with tracking IDs and local storage persistence.

### 🔐 Administrative Dashboard
- **Executive Overview**: Real-time statistics and business performance metrics.
- **Inventory Management**: Comprehensive CRUD operations for products, including multi-image support and stock tracking.
- **Order Processing**: Centralized management of customer orders, status tracking, and shipping updates.
- **Category Control**: Dynamic categorization system to organize products efficiently.
- **System Settings**: Global configuration for site-wide banners, contact info, and business policies.

### 🚀 Marketing & SEO
- **Dynamic SEO Landing Pages**: Generate high-converting marketing pages automatically via `/landing/[keyword]`.
- **Keyword Targeting**: Each landing page fetches products and settings based on the URL keyword, perfect for FB Ads or Google Search.
- **Optimized Sales Funnel**: Landing pages feature a streamlined one-page checkout to maximize conversion rates.

### 🎨 UI/UX & Design Philosophy
- **Premium Aesthetics**: High-end design with **Glassmorphism**, smooth transitions, and custom micro-animations.
- **Responsive Layouts**: Seamless transitions between desktop, tablet, and mobile views.
- **Custom Components**: Hand-crafted UI elements built with Vanilla CSS and Tailwind 4 for maximum performance.
- **Visual Feedback**: Real-time loading states, success modals, and error handling for a polished feel.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens) using `jose` and `jsonwebtoken`
- **Image Optimization**: [Sharp](https://sharp.pixelplumbing.com/) for high-performance image processing
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

---

## 📡 API Reference

### 🔓 Public Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/products` | `GET` | Fetch all active products |
| `/api/product/[slug]` | `GET` | Get detailed product information |
| `/api/landing` | `GET` | Fetch landing page specific content |
| `/api/order` | `POST` | Place a new customer order |
| `/api/reviews` | `GET/POST` | Product reviews and ratings |

### 🔒 Admin Endpoints (Protected)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/admin/login` | `POST` | Admin authentication & JWT issue |
| `/api/admin/dashboard` | `GET` | Fetch sales statistics & metrics |
| `/api/admin/products` | `GET/POST/PUT/DELETE` | Full product lifecycle management |
| `/api/admin/orders` | `GET/PUT` | Order tracking and status updates |
| `/api/admin/categories`| `GET/POST/PUT/DELETE` | Category tree management |
| `/api/admin/settings` | `GET/PUT` | Site-wide configuration |

---

## 🗄️ Database Architecture

The system uses **MongoDB** with strict schema validation via **Mongoose**:

- **Product**: Handles inventory, pricing (base & discount), categories, and multi-image galleries.
- **Order**: Stores customer details, item snapshots, shipping calculations, and status history.
- **Admin**: Stores encrypted credentials and profile settings.
- **Category**: Hierarchical structure for product organization.
- **Review**: Customer feedback, ratings, and moderation states.
- **Settings**: Global state for banners, contact info, and shipping fees.

---

## 📂 Project Structure

```text
my-app/
├── app/                  # Next.js App Router (Pages & API)
│   ├── admin/            # Administrative Dashboard pages
│   ├── api/              # Backend API endpoints (Auth, Products, Orders)
│   ├── shop/             # Main storefront browse page
│   ├── product/          # Individual product detail pages
│   └── landing/          # SEO-optimized marketing landing pages
├── components/           # Reusable UI components (Navbar, Footer, Cart)
├── models/               # Mongoose Schemas (Admin, User, Product, Order, etc.)
├── lib/                  # Core utilities (DB connection, Auth logic, API helpers)
├── public/               # Static assets (images, logos, icons)
├── scripts/              # Automation & Maintenance scripts
├── middleware.js         # Security & Authentication middleware
└── package.json          # Dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (Latest LTS version recommended)
- MongoDB (Local instance or Atlas cluster)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

### 4. Initialize Admin Account
Run the custom script to create your first superuser:
```bash
npm run createsuperuser
```

### 5. Start Development
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the store.
Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 🔧 Maintenance Scripts

Located in the `scripts/` directory:
- `create-admin.mjs`: Utility to bootstrap admin users.
- `drop_stray_index.mjs`: Database optimization tool to remove redundant indices.
- `update_shipping.mjs`: Bulk update tool for order shipping statuses.
- `test_order_perf.mjs`: Benchmarking script for order processing speed.

---

## 📦 Production Deployment

Build the optimized application:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

---

## 📜 License
This project is proprietary and confidential. Unauthorized copying of this file via any medium is strictly prohibited.

```
