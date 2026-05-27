#!/bin/bash

echo "🚀 Building Next.js App..."
npm run build

echo "📂 Copying Environment Variables..."
cp .env .next/standalone/ 2>/dev/null || :

echo "🖼️  Copying Public Folder..."
cp -r public .next/standalone/

echo "🎨 Copying Static Assets (CSS/JS)..."
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/

echo "🔄 Restarting PM2 Server..."
pm2 restart hatimzone || pm2 start .next/standalone/server.js --name hatimzone

echo "✅ Deployment Successful!"
