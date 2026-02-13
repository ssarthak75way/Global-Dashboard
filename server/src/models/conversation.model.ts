import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
    updatedAt: Date;
    createdAt: Date;
}

const ConversationSchema: Schema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {
    timestamps: true
});

// Index for faster lookups of conversations for a user
ConversationSchema.index({ participants: 1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
