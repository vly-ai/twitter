import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  author: Types.ObjectId;
  tweet: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tweet: {
      type: Types.ObjectId,
      ref: 'Tweet',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 280,
    },
  },
  { timestamps: true }
);

export default model<IComment>('Comment', CommentSchema);