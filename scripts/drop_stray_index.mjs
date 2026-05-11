import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://arafatnayem01_db_user:01516540037%40Arafat@prottu.criihzd.mongodb.net/?appName=Prottu"; 

async function dropStrayIndex() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");

        const db = mongoose.connection.db;
        const collection = db.collection('orders');

        console.log("Checking indexes...");
        const indexes = await collection.indexes();
        console.log("Current indexes:", JSON.stringify(indexes, null, 2));

        const orderNumberIndex = indexes.find(idx => idx.name === 'orderNumber_1');
        
        if (orderNumberIndex) {
            console.log("Dropping index: orderNumber_1");
            await collection.dropIndex('orderNumber_1');
            console.log("Index dropped successfully.");
        } else {
            console.log("Index orderNumber_1 not found.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Operation failed:", err);
        process.exit(1);
    }
}

dropStrayIndex();
