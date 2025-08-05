import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;
  const Blogs = await Blog.findById(id);
  return NextResponse.json({
    success: true,
    data: Blogs,
    message: "Blogs fetched successfully",
  });
}

export async function POST(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const body = await req.json(); // Expecting { action: "like" | "comment", user?, text? }
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // Handle Like Action
    if (body.action === "like") {
      blog.likes = (blog.likes || 0) + 1;
      await blog.save();
      return NextResponse.json({ success: true, data: blog });
    }

    // Handle Comment Action
    if (body.action === "comment") {
      if (!body.text) {
        return NextResponse.json(
          { message: "Comment text is required" },
          { status: 400 }
        );
      }

      const newComment = {
        user: body.user || "Anonymous",
        text: body.text,
      };

      if (!blog.comments) blog.comments = [];
      blog.comments.push(newComment);
      await blog.save();

      return NextResponse.json({ success: true, data: blog });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error liking/commenting on Blog:", error);
    return NextResponse.json(
      { message: "Error liking/commenting on Blog", error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Parse form data
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("image");

    let updateData = { title, description };

    // Handle image update
    if (imageFile && imageFile.size > 0) {
      // Get existing user to remove old image
      const existingblogs = await Blog.findById(id);
      if (existingblogs && existingblogs.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public/uploads",
          existingblogs.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Convert File to Buffer
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = imageFile.name.split(".").pop();
      const filename = `image-${uniqueSuffix}.${extension}`;

      // Save new file
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      updateData.image = filename;
    }

    const updatedblogs = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json({
      message: "Blog updated successfully",
      data: updatedblogs,
    });
  } catch (error) {
    console.error("Error updating Blog:", error);
    return NextResponse.json(
      { message: "Error updating Blog", error: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Get user data before deletion to remove image file
    const Blogs = await Blog.findById(id);

    if (Blogs && Blogs.image) {
      const imagePath = path.join(process.cwd(), "public/uploads", Blogs.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const deletedBlogs = await Blog.findByIdAndDelete(id);
    return NextResponse.json({
      message: "Blogs deleted successfully",
      data: deletedBlogs,
    });
  } catch (error) {
    console.error("Error deleting Blogs:", error);
    return NextResponse.json(
      { message: "Error deleting Blogs", error: error.message },
      { status: 500 }
    );
  }
}