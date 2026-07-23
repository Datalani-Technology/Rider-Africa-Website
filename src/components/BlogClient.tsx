"use client";
import { useState, useEffect } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import Link from "next/link";
import Image from "next/image";
import { Rocket, Users, TrendingUp, Globe, BarChart3, Shield, FileText } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "Company News": Rocket, "Driver Stories": Users, "Industry": TrendingUp,
  "Product Update": Globe, "Community": BarChart3, "Safety": Shield,
};

const staticPosts = [
  {
    date: "June 2026",
    category: "Company News",
    title: "Rider Africa is Now Live on iOS and Android",
    excerpt:
      "After months of development and testing, Rider Africa has officially launched on the Apple App Store and Google Play. Here is everything you need to know about our launch.",
    readTime: "3 min read",
    Icon: Rocket,
    image: "/images/blog-hero.jpg",
  },
  {
    date: "May 2026",
    category: "Driver Stories",
    title: "Meet John: How Rider Africa Changed His Life",
    excerpt:
      "John Nghishekwa from Windhoek went from struggling to find work to earning N$ 12,000 a month as a Rider Africa driver. Here is his story.",
    readTime: "5 min read",
    Icon: Users,
    image: "/images/driver-hero.jpg",
  },
  {
    date: "May 2026",
    category: "Industry",
    title: "Why On-Demand Delivery is Namibia's Next Big Opportunity",
    excerpt:
      "With smartphone adoption growing rapidly and e-commerce emerging across the continent, Namibia is perfectly positioned for the on-demand logistics boom.",
    readTime: "6 min read",
    Icon: TrendingUp,
    image: "/images/gallery-4.jpg",
  },
  {
    date: "April 2026",
    category: "Product Update",
    title: "Introducing International Parcel Delivery",
    excerpt:
      "Rider Africa now supports international parcel delivery and container shipments — opening Namibia to the world. Here is how it works.",
    readTime: "4 min read",
    Icon: Globe,
    image: "/images/gallery-3.jpg",
  },
  {
    date: "April 2026",
    category: "Community",
    title: "50 Drivers. 1,000 Deliveries. Our First Month in Numbers.",
    excerpt:
      "We reflect on our first full month of operations — the wins, the lessons, and what is coming next for Rider Africa and Namibia.",
    readTime: "4 min read",
    Icon: BarChart3,
    image: "/images/gallery-6.jpg",
  },
  {
    date: "March 2026",
    category: "Safety",
    title: "How Rider Africa Vets Every Driver-Partner",
    excerpt:
      "Trust is everything. Here is our full driver verification and background check process — and why we never cut corners on safety.",
    readTime: "5 min read",
    Icon: Shield,
    image: "/images/gallery-5.jpg",
  },
];

const categories = ["All", "Company News", "Driver Stories", "Product Update", "Industry", "Community", "Safety", "Announcement"];

type FirestorePost = { id: string; title: string; excerpt: string; category: string; author: string; createdAt: string };

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [firestorePosts, setFirestorePosts] = useState<FirestorePost[]>([]);
  const [loadedFirestore, setLoadedFirestore] = useState(false);

  useEffect(() => {
    fetch("/api/blog").then(r => r.json()).then((data: FirestorePost[]) => {
      setFirestorePosts(data);
      setLoadedFirestore(true);
    }).catch(() => setLoadedFirestore(true));
  }, []);

  // Use Firestore posts if any exist, otherwise fall back to static posts
  const allPosts = loadedFirestore && firestorePosts.length > 0
    ? firestorePosts.map(p => ({
        date: new Date(p.createdAt).toLocaleDateString("en-NA", { month: "long", year: "numeric" }),
        category: p.category,
        title: p.title,
        excerpt: p.excerpt,
        readTime: "3 min read",
        Icon: CATEGORY_ICONS[p.category] ?? FileText,
        image: "/images/blog-hero.jpg",
      }))
    : staticPosts;

  const filtered = activeCategory === "All"
    ? allPosts
    : allPosts.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const FeaturedIcon = featured?.Icon;

  return (
    <section className="blog-editorial py-20 bg-[#F4F7FF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Category filter */}
        <AnimateOnScroll>
          <div className="blog-filters flex flex-wrap gap-2 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === c
                    ? "bg-[#0073FF] text-white border-transparent shadow-[0_4px_16px_rgba(0,115,255,0.35)]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#0073FF]/40 hover:text-[#0073FF]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No posts in this category yet.</p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-4 text-[#0073FF] font-semibold hover:underline"
            >
              View all posts →
            </button>
          </div>
        )}

        {/* Featured / first post in filtered results */}
        {featured && (
          <AnimateOnScroll className="mb-8" key={featured.title}>
            <div className="blog-featured rounded-3xl text-white relative overflow-hidden">
              <div className="blog-featured-image"><Image src={featured.image} alt="" fill sizes="(max-width:850px) 100vw,45vw" /></div>
              <div className="blog-featured-copy">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                {activeCategory === "All" ? "Latest Post" : featured.category}
              </span>
              {FeaturedIcon && (
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <FeaturedIcon className="w-7 h-7 text-white" strokeWidth={1.75} />
                </div>
              )}
              <p className="text-blue-200 text-sm mb-2">{featured.date} · {featured.readTime}</p>
              <h2 className="text-3xl font-black mb-4">{featured.title}</h2>
              <p className="text-blue-100 leading-relaxed mb-6 max-w-2xl">{featured.excerpt}</p>
              <Link
                href="/contact"
                className="inline-block bg-white text-[#0073FF] font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors"
              >
                Read More →
              </Link>
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <AnimateOnScroll key={post.title} delay={i * 0.08}>
                <article className="blog-card bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full">
                  <div className="blog-card-image"><Image src={post.image} alt="" fill sizes="(max-width:650px) 100vw,33vw" /><span><post.Icon /></span></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#0073FF]/10 text-[#0073FF] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-xs">{post.readTime}</span>
                    </div>
                    <h3 className="font-black text-gray-900 text-lg mb-3 leading-snug">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-5">
                      <span className="text-gray-400 text-xs">{post.date}</span>
                      <Link href="/contact" className="text-[#0073FF] font-semibold text-sm hover:underline">
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <AnimateOnScroll className="mt-16 text-center">
          <BlogNewsletter />
        </AnimateOnScroll>

      </div>
    </section>
  );
}

function BlogNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setStatus("done");
      setEmail("");
    } catch { setStatus("error"); }
  };
  return (
    <div className="bg-white border border-[#0073FF]/15 rounded-3xl p-10 max-w-2xl mx-auto shadow-sm">
      <h3 className="text-2xl font-black text-gray-900 mb-2">Stay Updated</h3>
      <p className="text-gray-500 mb-6">Get Rider Africa news, product updates, and driver insights direct to your inbox.</p>
      {status === "done" ? (
        <p className="text-[#0073FF] font-semibold">You&apos;re subscribed!</p>
      ) : (
        <form className="flex gap-3 max-w-md mx-auto" onSubmit={submit}>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/10 transition-all" />
          <button type="submit" disabled={status === "loading"}
            className="bg-[#0073FF] hover:bg-[#0055CC] disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl transition-colors shrink-0">
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
