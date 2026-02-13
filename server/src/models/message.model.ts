import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    readBy: mongoose.Types.ObjectId[];
    isDeletedForEveryone: boolean;
    deletedForUsers: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    readBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isDeletedForEveryone: {
        type: Boolean,
        default: false
    },
    deletedForUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Indexes for performance
MessageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
