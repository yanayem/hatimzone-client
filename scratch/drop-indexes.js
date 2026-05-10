const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://arafatnayem01_db_user:01516540037%40Arafat@prottu.criihzd.mongodb.net/?appName=Prottu';

async function dropIndex() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        
        const collection = mongoose.connection.collection('admins');
        
        // Drop the phone index
        try {
            await collection.dropIndex('phone_1');
            console.log('Dropped index phone_1');
        } catch (e) {
            console.log('Index phone_1 might not exist or already dropped:', e.message);
        }

        // Drop the username index as well just in case they want freedom there too
        try {
            await collection.dropIndex('username_1');
            console.log('Dropped index username_1');
        } catch (e) {
            console.log('Index username_1 might not exist or already dropped:', e.message);
        }

        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

dropIndex();
