import axios from "axios";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mern_auth_project");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error(`Error: ${error.response?.data?.message}`);
        } else if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        process.exit(1);
    }
};

export default connectDB;
