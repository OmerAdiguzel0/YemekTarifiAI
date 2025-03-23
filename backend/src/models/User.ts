import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  diyetTercihleri: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  profilePhoto: String,
  diyetTercihleri: [{
    type: String,
    enum: ['vejeteryan', 'vegan', 'glutensiz', 'keto', 'dusuk_kalorili']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema); 