import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // could be username or email
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [CommentSchema],
});

const Blogs = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export default Blogs;
