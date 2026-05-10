const mongoose = require('mongoose');

// Use your connection string
const MONGODB_URI = 'mongodb+srv://arafatnayem01_db_user:01516540037%40Arafat@prottu.criihzd.mongodb.net/?appName=Prottu';

async function runCleanup() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // 1. Cleanup ADMINS collection
        const adminCollection = mongoose.connection.collection('admins');
        console.log('\n--- Cleaning Admins ---');
        try {
            await adminCollection.dropIndex('phone_1');
            console.log('🚀 Dropped index: phone_1');
        } catch (e) {
            console.log('ℹ️ phone_1 index skipped');
        }
        try {
            await adminCollection.dropIndex('username_1');
            console.log('🚀 Dropped index: username_1');
        } catch (e) {
            console.log('ℹ️ username_1 index skipped');
        }

        // 2. Cleanup PRODUCTS collection
        const productCollection = mongoose.connection.collection('products');
        console.log('\n--- Cleaning Products ---');
        try {
            await productCollection.dropIndex('slug_1');
            console.log('🚀 Dropped index: slug_1');
        } catch (e) {
            console.log('ℹ️ slug_1 index skipped');
        }

        // Verify remaining indexes
        const pIndexes = await productCollection.indexes();
        console.log('Remaining Product Indexes:', pIndexes.map(i => i.name));

        console.log('\n✅ ALL CLEANUP TASKS FINISHED SUCCESSFULLY');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ CRITICAL ERROR:', err);
        process.exit(1);
    }
}

runCleanup();