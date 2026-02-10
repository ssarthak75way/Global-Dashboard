import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
    title: string;
    description?: string;
    status: string; // ToDo, In Progress, Done, etc.
    priority: "Low" | "Medium" | "High";
    order: number;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String, required: true, default: "ToDo" },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
        order: { type: Number, default: 0 },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ITask>("Task", taskSchema);
