// models/ChatHistory.js
import { Schema, model, models } from 'mongoose';

const messageSchema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: { type: String, enum: ['user', 'bot'], required: true }
});

const chatHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

const ChatHistory = models.ChatHistory || model('ChatHistory', chatHistorySchema);
export default ChatHistory;
