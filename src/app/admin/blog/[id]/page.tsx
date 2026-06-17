"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";

const CATEGORIES = ["Company News", "Driver Stories", "Product Update", "Industry", "Community", "Safety", "Announcement"];

type Form = {
  title: string; excerpt: string; content: string;
  category: string; author: string; published: boolean;
};

const empty: Form = { title: "", excerpt: "", content: "", category: "Company News", author: "Rider Africa Team", published: false };

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const isNew = !id || id === "new";

  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) return;
    fetch("/api/admin/blog").then(r => r.json()).then((posts: (Form & { id: string })[]) => {
      const post = posts.find(p => p.id === id);
      if (post) setForm({ title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, author: post.author, published: post.published });
      setLoading(false);
    });
  }, [id, isNew]);

  const set = (field: keyof Form, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }));

  const save = async () => {
    if (!form.title.trim() || !form.excerpt.trim()) return alert("Title and excerpt are required.");
    setSaving(true);
    if (isNew) {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { id: newId } = await res.json();
      setSaved(true);
      setSaving(false);
      setTimeout(() => router.push(`/admin/blog/${newId}`), 800);
    } else {
      await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 text-sm">Loading…</div>;

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-white font-black text-xl">{isNew ? "New Post" : "Edit Post"}</h2>
            <p className="text-gray-500 text-xs mt-0.5">{isNew ? "Create a new blog post" : "Update existing post"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => set("published", !form.published)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              form.published
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}>
            {form.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {form.published ? "Published" : "Draft"}
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 bg-[#0073FF] hover:bg-[#0055CC] disabled:opacity-60 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : saved ? "Saved!" : "Save Post"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main content — 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0D1526] border border-white/5 rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1.5 font-medium uppercase tracking-wide">Title *</label>
              <input
                value={form.title}
                onChange={e => set("title", e.target.value)}
                placeholder="Post title…"
                className="w-full bg-[#131C30] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-base font-bold focus:outline-none focus:border-[#0073FF]"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1.5 font-medium uppercase tracking-wide">Excerpt / Summary *</label>
              <textarea
                value={form.excerpt}
                onChange={e => set("excerpt", e.target.value)}
                rows={3}
                placeholder="A short summary shown on the blog listing page…"
                className="w-full bg-[#131C30] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#0073FF] resize-none"
              />
            </div>
          </div>

          <div className="bg-[#0D1526] border border-white/5 rounded-2xl p-5">
            <label className="text-gray-400 text-xs block mb-1.5 font-medium uppercase tracking-wide">Full Content</label>
            <p className="text-gray-600 text-xs mb-3">Supports basic markdown: **bold**, *italic*, ## Heading, - list item</p>
            <textarea
              value={form.content}
              onChange={e => set("content", e.target.value)}
              rows={18}
              placeholder="Write the full article content here…"
              className="w-full bg-[#131C30] border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-[#0073FF] resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-4">
          <div className="bg-[#0D1526] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-white font-bold text-sm">Post Settings</h3>
            <div>
              <label className="text-gray-400 text-xs block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className="w-full bg-[#131C30] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0073FF]"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1.5">Author</label>
              <input
                value={form.author}
                onChange={e => set("author", e.target.value)}
                className="w-full bg-[#131C30] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0073FF]"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-gray-400 text-sm">Published</span>
              <button onClick={() => set("published", !form.published)}
                className={`w-10 h-5 rounded-full relative transition-colors ${form.published ? "bg-emerald-500" : "bg-white/10"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.published ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          </div>

          <div className="bg-[#0D1526] border border-white/5 rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-3">Tips</h3>
            <ul className="space-y-1.5 text-gray-500 text-xs">
              <li>• Toggle <span className="text-amber-400">Draft</span> to save without publishing</li>
              <li>• Toggle <span className="text-emerald-400">Published</span> to make live on the website</li>
              <li>• Posts appear on <span className="text-[#4DA6FF]">/blog</span> immediately when published</li>
              <li>• The first published post shows as the featured article</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
