/**
 * User Schema for MongoDB
 * This schema represents the user database model, defining the structure for how user data is stored.
 * A user can be registered, logged in, and have profile information, followers, and following relations.
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for User Document
 * Extends MongoDB Document interface to provide typing for user schema
 */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bio?: string;
  profile_picture?: string;
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
}

/**
 * User Schema Definition
 * - username: Unique identifier for the user
 * - email: User's email address
 * - password: Hashed password for the user
 * - bio: Optional user bio
 * - profile_picture: Optional URL to user's profile picture
 * - followers: List of users that follow this user
 * - following: List of users this user follows
 */
const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true }, // Unique username for the user
    email: { type: String, required: true, unique: true }, // User's email address
    password: { type: String, required: true }, // Hashed password
    bio: { type: String }, // Optional bio
    profile_picture: { type: String }, // Optional profile picture URL
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // List of follower user IDs
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }] // List of following user IDs
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Export the mongoose model
export default mongoose.model<IUser>('User', UserSchema);