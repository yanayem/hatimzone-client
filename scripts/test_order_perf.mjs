import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://arafatnayem01_db_user:01516540037%40Arafat@prottu.criihzd.mongodb.net/?appName=Prottu"; 

const UserSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true },
}, { strict: false });

const OrderSchema = new mongoose.Schema({
    orderId: String,
    items: Array,
    customer: Object,
    totalPrice: Number,
}, { strict: false });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

async function testOrder() {
    try {
        console.log("Connecting...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");

        const customer = {
            name: "Test User",
            phone: "01711111111",
            address: "Test Address",
            city: "Dhaka"
        };

        console.log("Finding user...");
        const start = Date.now();
        const user = await User.findOne({ phone: customer.phone });
        console.log("User found in", (Date.now() - start), "ms");

        console.log("Creating order...");
        const orderStart = Date.now();
        const newOrder = await Order.create({
            orderId: "TEST-" + Date.now(),
            items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
            customer,
            subTotal: 100,
            shippingCost: 70,
            totalPrice: 170,
            paymentMethod: "Cash on Delivery"
        });
        console.log("Order created in", (Date.now() - orderStart), "ms");

        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

testOrder();
