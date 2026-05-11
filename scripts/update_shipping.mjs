import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://arafatnayem01_db_user:01516540037%40Arafat@prottu.criihzd.mongodb.net/?appName=Prottu"; 

const SettingsSchema = new mongoose.Schema({
    shippingInsideDhaka: Number,
    shippingOutsideDhaka: Number,
}, { strict: false, collection: 'settings' });

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

async function updateSettings() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGODB_URI);
        
        const result = await Settings.findOneAndUpdate(
            {}, 
            { 
                shippingInsideDhaka: 70, 
                shippingOutsideDhaka: 130 
            }, 
            { upsert: true, new: true }
        );
        
        console.log("Updated Settings Successfully:", result);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

updateSettings();
