import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please add MONGODB_URI in .env file");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;

    // 👇 AUTO-FIX: Assign slugs to existing products that have null or missing slugs
    try {
        const Product = mongoose.models.Product;
        if (Product) {
            const productsToFix = await Product.find({ 
                $or: [{ slug: null }, { slug: { $exists: false } }] 
            });
            
            for (const p of productsToFix) {
                p.slug = p.name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-") + "-" + Math.random().toString(36).substring(2, 7);
                await p.save();
            }
            if (productsToFix.length > 0) console.log(`✅ Fixed ${productsToFix.length} products with missing slugs.`);
        }
    } catch (e) {
        console.error("Migration error:", e);
    }

    return cached.conn;
}
