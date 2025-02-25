import { Schema, model } from "mongoose";
import { IBlogTag } from "../interfaces/blog_tag.interface";

const blogTagSchema: Schema<IBlogTag> = new Schema(
  {
    blog_id: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    tag_name: { type: String, required: true },
  },
  { timestamps: true }
);

export const BlogTag = model<IBlogTag>("BlogTag", blogTagSchema);
