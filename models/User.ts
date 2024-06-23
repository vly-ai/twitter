import { Schema, Document, model, Types } from 'mongoose';

/**
 * User Schema
 * 
 * The User schema for storing user details. This includes necessary information such as the username,
 * email, hashed password, profile details, and relationships like followers and following.
 * This schema allows for user registration, login, profile management, and social interactions.
 */

export interface IUser extends Document {
  username: string; // Username chosen by the user
  email: string; // User's email address
  password: string; // Hashed password of the user
  profilePicture: string; // URL of the user's profile picture
  bio: string; // Short biography of the user
  followers: Types.ObjectId[]; // List of user IDs that follow this user
  following: Types.ObjectId[]; // List of user IDs that this user follows
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
    },
    followers: [{
      type: Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: Types.ObjectId,
      ref: 'User'
    }]
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);