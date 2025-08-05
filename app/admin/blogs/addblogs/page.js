"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";

export default function AddBlogsPage() {
  const [loading, setLoading] = useState(false);
  const [cards, setCard] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/blogs");
      if (res.data.success) {
        setCard(res.data.data);
      } else {
        throw new Error(res.data.message || "Failed to fetch blogs");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handelDelete = async (id) => {
    await axios.delete(`/api/admin/blogs/${id}`);
    fetchData();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">
            Manage Blogs
          </h2>
          <p>
            Add, update, or remove blogs to keep your offerings up-to-date and
            organized.
          </p>
        </div>

        <div className="mb-6">
          <Link
            href={"/admin/blogs/addblogs"}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New Blogs
          </Link>
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-50 text-blue-600">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold">
                Title
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold">
                Description
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold">
                Image
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">
                  <div className="flex justify-center items-center py-10">
                    <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                    <span className="ml-2 text-blue-600 text-sm font-medium">
                      Loading blogs...
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {cards.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">
                      <Image
                        src={`/uploads/${item.image}`}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 flex items-center">
                      <Link
                        href={`/admin/blogs/addblogs/${item._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handelDelete(item._id)}
                        className="text-red-600 hover:underline ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
