"use client";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, MessageSquare } from "lucide-react";

export default function BlogList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/admin/blogs");
      if (res.data.success) {
        setCards(res.data.data);
      } else {
        throw new Error(res.data.message || "Failed to fetch blogs");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-20 bg-white">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Latest Blogs
        </h2>
        <p className="text-gray-600 text-md md:text-lg">
          Explore our latest articles and insights on various topics. Stay
          informed and inspired with our curated content.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <motion.div
            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className="rounded-xl overflow-hidden bg-white shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <img
                src={`/uploads/${card.image}`}
                alt={card.title}
                className="w-full h-64 object-cover"
              />
              <div className="bg-white px-6 py-4 flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-snug line-clamp-3">
                  {card.description}
                </p>

                {/* Like and Comment Section */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-4 text-gray-700">
                    {/* Like */}
                    <div className="flex items-center gap-1">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="text-sm">{card.likes || 0}</span>
                    </div>
                    {/* Comment */}
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">
                        {card.comments?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Read More */}
                  <Link
                    href={`/blogs/${card._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
