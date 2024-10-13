import { Schema, model, models } from 'mongoose';

// Define the message schema
const messageSchema = new Schema({
  content: { type: String, required: true },   // The message content
  sender: { type: String, enum: ['user', 'bot'], required: true },   // Who sent the message
  timestamp: { type: Date, default: Date.now }   // Timestamp of the message
});

// Define the chat history schema
const chatHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // User reference
  messages: [messageSchema],   // Array of messages in the conversation
  createdAt: { type: Date, default: Date.now },   // When the chat was created
  updatedAt: { type: Date, default: Date.now },   // When the chat was last updated
});

// Middleware to update the `updatedAt` field on message insertion
chatHistorySchema.pre('save', function (next) {
    this.updatedAt = new Date();    // Update `updatedAt` on each save
  next();
});

// Check if the model exists to avoid re-compiling
const ChatHistory = models.ChatHistory || model('ChatHistory', chatHistorySchema);

export default ChatHistory;
