"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
import { Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/api/admin/blogs/${id}`);
      setBlog(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    await axios.post(`/api/admin/blogs/${id}`, { action: "like" });
    fetchBlog();
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await axios.post(`/api/admin/blogs/${id}`, {
      text: comment,
      user: "Anonymous",
      action: "comment",
    });
    setComment("");
    fetchBlog();
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  }

  if (!blog) return <div className="text-center mt-20">Blog not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 mt-20">
      {/* Blog Image */}
      <motion.img
        src={`/uploads/${blog.image}`}
        alt={blog.title}
        className="w-full h-72 sm:h-96 object-cover rounded-xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Blog Title */}
      <h1 className="text-2xl sm:text-4xl font-bold mt-6 text-gray-900">
        {blog.title}
      </h1>
      <p className="text-gray-700 mt-4 leading-relaxed text-md sm:text-lg">
        {blog.description}
      </p>

      {/* Like & Share */}
      {/* Like & Share */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Heart className="w-5 h-5" /> Like ({blog.likes || 0})
        </button>

        {/* Social Share Buttons */}
        <div className="flex gap-3">
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Facebook
          </a>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              blog.title
            )}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
          >
            Twitter
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            LinkedIn
          </a>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              blog.title + " " + window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-10 bg-gray-50 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Comments ({blog.comments?.length || 0})
        </h2>

        {/* Add Comment */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="border border-gray-300 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleComment}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        {/* Display Comments */}
        <ul className="space-y-4">
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((c, i) => (
              <li
                key={i}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <p className="text-gray-800 font-semibold">{c.user}</p>
                <p className="text-gray-600 text-sm mt-1">{c.text}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
