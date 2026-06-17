"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

type Post = {
  id: string; title: string; excerpt: string; category: string;
  author: string; published: boolean; createdAt: string;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/blog").then(r => r.json()).then(data => { setPosts(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const toggle = async (post: Post) => {
    await fetch("/api/admin/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-xl">Blog & News</h2>
          <p className="text-gray-500 text-sm mt-0.5">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/blog/new"
          className="flex items-center gap-2 bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-sm mb-4">No blog posts yet.</p>
            <Link href="/admin/blog/new"
              className="inline-flex items-center gap-2 bg-[#0073FF]/20 hover:bg-[#0073FF]/40 border border-[#0073FF]/30 text-[#4DA6FF] px-4 py-2 rounded-xl text-sm transition-all">
              <Plus className="w-4 h-4" /> Write your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Title</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Author</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium truncate max-w-xs">{post.title}</p>
                      <p className="text-gray-600 text-xs truncate max-w-xs mt-0.5">{post.excerpt}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#0073FF]/10 text-[#4DA6FF] text-xs px-2 py-0.5 rounded-full">{post.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{post.author}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {new Date(post.createdAt).toLocaleDateString("en-NA", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        post.published
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blog/${post.id}`}
                          className="flex items-center gap-1 text-xs text-[#4DA6FF] hover:underline">
                          <Edit2 className="w-3 h-3" /> Edit
                        </Link>
                        <button onClick={() => toggle(post)}
                          className={`flex items-center gap-1 text-xs ${post.published ? "text-amber-400" : "text-emerald-400"} hover:underline`}>
                          {post.published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {post.published ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => remove(post.id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:underline">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
