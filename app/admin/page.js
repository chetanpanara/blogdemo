"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Images } from "lucide-react";

export default function AdminHome() {
  const [blogsCount, setBlogsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);

        // Fetch blogss
        const blogs = await axios.get("/api/admin/blogs");
      
        // Assuming API returns array of records
        setBlogsCount(blogs.data.data.length || 0);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div>
      {/* Header */}
      <h2 className="text-xl font-bold mb-2 text-blue-600">Admin Dashboard</h2>

      <p className="mb-6 text-gray-600">
        Welcome to the admin panel. Use the sidebar to navigate.
      </p>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* blogs Card */}
        <div className="bg-white shadow-sm rounded-xl p-6 flex items-center justify-between hover:shadow-md">
          <div>
            <p className="text-sm text-gray-500">Total Blogs</p>
            <h3 className="text-3xl font-semibold text-gray-800">
              {loading ? "..." : blogsCount}
            </h3>
          </div>
          <div className="bg-blue-100 p-4 rounded-full">
            <Images size={28} className="text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
