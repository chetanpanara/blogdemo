"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function blogsPage() {
  const [loading, setLoading] = useState(false);
  const [cards, setCard] = useState([]);
    // const cards = [
    //   {
    //     title: "Residential Interior Design",
    //     description:
    //       "Crafting warm and inviting living spaces that reflect your personality and ensure comfort with style.",
    //     image: "/img/p1.jpeg",
    //   },
    //   {
    //     title: "Commercial Interior Design",
    //     description:
    //       "Designing professional, functional, and visually appealing environments that enhance productivity and brand image.",
    //     image: "/img/p2.jpg",
    //   },
    //   {
    //     title: "Space Planning & Renovation",
    //     description:
    //       "Optimizing layouts and revamping interiors with smart design solutions to make the most of your available space.",
    //     image: "/img/p3.jpg",
    //   },
    // ];

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
      {/* Table */}
      <div className="overflow-x-auto">
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">
            Manage Blogs
          </h2>
          <p>
            Add, update, or remove blogs to keep your offerings up-to-date and
            organized for your clients.
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
                      Loading blogss...
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
                      <img
                        src={`/uploads/${item.image}`}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 flex items-center">
                      <Link
                        href={`/admin/blogs/addblogs/${item._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-square-pen-icon lucide-square-pen"
                        >
                          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handelDelete(item._id)}
                        className="text-red-600 hover:underline ml-4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-trash-icon lucide-trash"
                        >
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
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
