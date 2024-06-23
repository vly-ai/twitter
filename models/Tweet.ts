import { Schema, Document, model, Types } from 'mongoose';

/**
 * Tweet Schema
 * 
 * The Tweet schema for storing tweet details. This includes necessary information such as the text content,
 * author, likes, and retweets. This schema allows for the creation, retrieval, and interaction with tweets.
 */

export interface ITweet extends Document {
  text: string; // Text content of the tweet
  author: Types.ObjectId; // User ID of the tweet's author
  likes: number; // Number of likes on the tweet
  retweets: number; // Number of retweets
}

const TweetSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    retweets: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default model<ITweet>('Tweet', TweetSchema);