# my-app

A robust Next.js application with a built-in admin dashboard and product management system.

## 📂 Directory Structure

```text
my-app/
├── app/                  # App Router
│   ├── admin/            # Admin Panel (Dashboard, Products, Orders)
│   ├── api/              # Backend API routes
│   └── layout.js         # Global Layout
├── models/               # Mongoose Schemas (Admin, Product)
├── lib/                  # Utilities & Database config
├── public/               # Static Assets
├── scratch/              # Maintenance scripts
├── middleware.js         # Authentication/Routing Middleware
└── package.json          # Project Dependencies
```

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file and add your MongoDB URI:
   ```env
   MONGODB_URI=your_connection_string
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🛠 Features

- **Next.js App Router**: Modern file-based routing.
- **Admin Dashboard**: Full product management (Add/Edit) and order viewing.
- **Mongoose Integration**: Pre-defined models for Products and Admin users.
- **Middleware**: Integrated routing and security logic.

## 📜 Available Scripts

- `npm run dev` - Starts development server.
- `npm run build` - Builds the app for production.
- `npm start` - Starts production server.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```
