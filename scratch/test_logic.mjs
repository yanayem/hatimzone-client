import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const password = "admin";
const hash = "$2b$10$uS0lp5tNfRhAFljoy39fo.Vg0llnTwrvPmtSilwR8gsPO1VvxlZbS";

async function test() {
    try {
        console.log("Testing bcrypt.compare...");
        const isMatch = await bcrypt.compare(password, hash);
        console.log("isMatch:", isMatch);

        console.log("Testing jwt.sign...");
        const token = jwt.sign({ id: "test", email: "test@test.com" }, "secret", { expiresIn: "7d" });
        console.log("token created:", !!token);
        
        process.exit(0);
    } catch (e) {
        console.error("Test failed:", e);
        process.exit(1);
    }
}

test();
