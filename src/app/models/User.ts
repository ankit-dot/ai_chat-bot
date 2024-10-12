// models/User.js
import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  chats: [{ type: Schema.Types.ObjectId, ref: 'ChatHistory' }]
});

const User = models.User || model('User', userSchema);
export default User;
