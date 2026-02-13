import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { createServer } from "http";
import { initSocket } from "./socket";

dotenv.config();

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

connectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
