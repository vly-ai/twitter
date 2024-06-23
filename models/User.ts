import { Schema, model, Document, Model } from 'mongoose';

/**
 * @description The User Schema defines the structure of the user document in the MongoDB database.
 * It includes necessary information like username, email, password, profile details, and followers/following relationships.
 */

// Interface for User Document with TypeScript
export interface IUser extends Document {
    username: string; // Username chosen by the user
    email: string; // User's email address
    password: string; // Hashed password of the user
    profilePicture: string; // URL of the user's profile picture
    bio: string; // Short biography of the user
    followers: Schema.Types.ObjectId[]; // List of user IDs that follow this user
    following: Schema.Types.ObjectId[]; // List of user IDs that this user follows
}

// Mongoose User Schema Definition
const UserSchema: Schema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: 160
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true // Automatically manage createdAt and updatedAt timestamps
});

// User Model Creation
export const User: Model<IUser> = model<IUser>('User', UserSchema);
