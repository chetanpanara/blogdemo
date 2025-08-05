"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogsForm() {

  const {id} = useParams();
  const router = useRouter();

  
  const fetchData = async (id) => { 
    const res = await axios.get(`/api/admin/blogs/${id}`);
    if (res.data.success) { 
      setFormData(res.data.data);
    }
  }

  useEffect(() => { 
    fetchData(id);
  },[])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }

    setLoading(true);
    try {
      const response = await axios.put(`/api/admin/blogs/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.message) {
        setMessage("blogs Updated successfully!");
        router.push("/admin/blogs");
        setFormData({ title: "", description: "", image: null });
      } else {
        setMessage("Failed to add blogs. Please try again.");
      }
    } catch (error) {
      console.error("Error adding blogs:", error);
      setMessage("An error occurred while adding the blogs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Update blogs</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter blogs title"
            name="title"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter blogs description"
            rows="4"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          ></textarea>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-center text-green-600">{message}</p>
      )}
    </div>
  );
}
