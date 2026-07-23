"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart, Leaf, GlassWater, Pill, Fuel, ShoppingBag,
  Plus, Minus, X, CheckCircle2, MapPin, ChevronRight, Trash2,
  Shield, Zap, Clock, ArrowRight, PackageCheck, Car, Gem,
  Search,
  Eye,
} from "lucide-react";

type ShopCategory = "grocery" | "alcohol" | "pharmacy" | "fuel";
type Product = {
  id: string; name: string; category: ShopCategory; price: number;
  salePrice?: number; salePriceFrom?: string; salePriceTo?: string;
  unit: string; description: string; inStock: boolean;
  requiresAgeVerification: boolean; vendorName: string; imageUrl?: string;
};
type CartItem = { product: Product; qty: number };

// A sale is active when a salePrice is set and today falls within the optional date window.
function isOnSale(p: Product): boolean {
  if (!p.salePrice || p.salePrice >= p.price) return false;
  const now = Date.now();
  if (p.salePriceFrom && now < new Date(p.salePriceFrom).getTime()) return false;
  if (p.salePriceTo && now > new Date(p.salePriceTo).getTime()) return false;
  return true;
}

function effectivePrice(p: Product): number {
  return isOnSale(p) ? p.salePrice! : p.price;
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: "p1",  name: "Nammilk Full Cream Milk", category: "grocery",  price: 41.99, unit: "per 2L",      description: "Fresh full cream milk from Namibia Dairies, a familiar everyday choice for Namibian homes.", inStock: true, requiresAgeVerification: false, vendorName: "Food Lover's Windhoek", imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p2",  name: "Waldschmidt Medium Eggs", category: "grocery",  price: 64.99, salePrice: 59.99, unit: "18 pack", description: "Quality eggs for breakfast, baking and everyday family meals.", inStock: true, requiresAgeVerification: false, vendorName: "Local supplier", imageUrl: "/images/waldschmidt-medium-eggs.png" },
  { id: "p3",  name: "Fresh Brown Bread", category: "grocery", price: 18.99, unit: "per loaf", description: "Freshly baked brown bread, soft, sliced and ready for the family table.", inStock: true, requiresAgeVerification: false, vendorName: "Shoprite Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p4",  name: "Nola Sunflower Oil", category: "grocery", price: 68.99, unit: "per 2L", description: "Pure sunflower oil for frying, baking and everyday Namibian cooking.", inStock: true, requiresAgeVerification: false, vendorName: "Shoprite Namibia", imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p5",  name: "Windhoek Draught Cans", category: "alcohol", price: 79.99, unit: "6 x 500ml", description: "Premium Namibian beer with a crisp, refreshing taste. Serve chilled.", inStock: true, requiresAgeVerification: true, vendorName: "Shoprite Liquor", imageUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p6",  name: "Hunters Dry Cider", category: "alcohol", price: 94.99, unit: "4 pack", description: "A crisp apple cider for relaxed occasions. Best served ice cold.", inStock: true, requiresAgeVerification: true, vendorName: "Checkers Liquor", imageUrl: "https://images.unsplash.com/photo-1560526860-1f0e56046c85?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p7",  name: "Tassenberg Dry Red Wine", category: "alcohol", price: 92.99, salePrice: 87.99, unit: "per 2L", description: "A familiar Southern African dry red wine for the table and braai.", inStock: true, requiresAgeVerification: true, vendorName: "Shoprite Liquor", imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p8",  name: "Panado 500mg (24s)",       category: "pharmacy", price: 38,    unit: "per box",     description: "Trusted pain and fever relief. Each box contains 24 tablets of Paracetamol 500mg. Safe for adults and children.", inStock: true,  requiresAgeVerification: false, vendorName: "Dis-Chem Windhoek",  imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p9",  name: "Allergex (30 tabs)",       category: "pharmacy", price: 62,    unit: "per box",     description: "Antihistamine for seasonal allergy and hay fever relief. Non-drowsy formula, fast-acting. 30 tablets per box.", inStock: true,  requiresAgeVerification: false, vendorName: "Dis-Chem Windhoek",  imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p10", name: "Vitamin C 1000mg", category: "pharmacy", price: 85, unit: "per 20 tabs", description: "Orange-flavoured effervescent Vitamin C 1000mg tablets. Dissolves easily in water.", inStock: true, requiresAgeVerification: false, vendorName: "Local supplier", imageUrl: "/images/vitamin-c-1000mg.png" },
  { id: "p11", name: "Unleaded 95 Petrol", category: "fuel", price: 23.50, unit: "per litre", description: "Unleaded 95 octane petrol delivered directly to your vehicle or approved canister. Minimum 10L order.", inStock: true, requiresAgeVerification: false, vendorName: "Local supplier", imageUrl: "/images/unleaded-95-petrol.png" },
  { id: "p12", name: "Diesel 50ppm", category: "fuel", price: 21.80, unit: "per litre", description: "Low-sulphur 50ppm diesel delivered safely in an approved container. Minimum 10L order.", inStock: true, requiresAgeVerification: false, vendorName: "Local supplier", imageUrl: "/images/diesel-50ppm.png" },
  { id: "p13", name: "Top Score Super Maize Meal", category: "grocery", price: 109.99, salePrice: 99.99, unit: "per 10kg", description: "Proudly Namibian fortified super maize meal for smooth, wholesome porridge.", inStock: true, requiresAgeVerification: false, vendorName: "Woermann Brock", imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p14", name: "Nice Rice White Rice", category: "grocery", price: 54.99, unit: "per 2kg", description: "Clean, fluffy white rice and a dependable pantry staple for family meals.", inStock: true, requiresAgeVerification: false, vendorName: "Shoprite Namibia", imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p15", name: "Marathon White Sugar", category: "grocery", price: 49.99, unit: "per 2.5kg", description: "White granulated sugar for tea, baking and everyday cooking.", inStock: true, requiresAgeVerification: false, vendorName: "Local supplier", imageUrl: "/images/marathon-white-sugar.png" },
  { id: "p16", name: "Bokomo Vetkoek Flour", category: "grocery", price: 84.99, unit: "per 5kg", description: "Locally milled wheat flour made for vetkoek, bread and home baking.", inStock: true, requiresAgeVerification: false, vendorName: "Woermann Brock", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p17", name: "Namibian Potatoes", category: "grocery", price: 39.99, unit: "per 2kg", description: "Fresh everyday potatoes for roasting, chips, stews and family meals.", inStock: true, requiresAgeVerification: false, vendorName: "Food Lover's Market", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop&auto=format&q=80" },
  { id: "p18", name: "Fresh Carrots", category: "grocery", price: 22.99, unit: "per 1kg", description: "Crisp fresh carrots selected for salads, stews and lunch boxes.", inStock: true, requiresAgeVerification: false, vendorName: "Fresh Produce Market", imageUrl: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800&h=600&fit=crop&auto=format&q=80" },
];

const SHOP_SPOTLIGHT = DEFAULT_PRODUCTS.find(p => p.id === "p13")!;
const SHOP_PICKS = DEFAULT_PRODUCTS.filter(p => ["p1", "p14", "p17"].includes(p.id));

// ── Hero category images — update these URLs anytime to change what shows on the shop hero ──
const CATEGORY_HERO_IMAGES: Record<string, string> = {
  grocery:  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&auto=format&q=85",
  alcohol:  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&auto=format&q=85",
  pharmacy: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=600&fit=crop&auto=format&q=85",
  fuel:     "https://images.unsplash.com/photo-1635108197534-23d9bbd8ae72?w=800&h=600&fit=crop&auto=format&q=85",
};

const CATEGORIES = [
  { value: "all" as const, label: "All Departments", Icon: ShoppingBag, color: "#0867B2", bg: "from-[#0867B2] to-[#102947]" },
  { value: "grocery" as const, label: "Food & Groceries", Icon: Leaf, color: "#199264", bg: "from-[#087A50] to-[#20A878]", desc: "Fresh produce and pantry favourites" },
  { value: "alcohol" as const, label: "Beer, Wine & Cider 18+", Icon: GlassWater, color: "#E39A10", bg: "from-[#C47706] to-[#EAAE23]", desc: "Cold drinks for adults" },
  { value: "pharmacy" as const, label: "Pharmacy", Icon: Pill, color: "#38BDF8", bg: "from-[#0284C7] to-[#38BDF8]", desc: "Medicine & health essentials" },
  { value: "fuel" as const, label: "Fuel", Icon: Fuel, color: "#F97316", bg: "from-[#EA580C] to-[#F97316]", desc: "Fuel delivered to you" },
];

const CAT_BG: Record<string, string> = {
  grocery: "from-[#059669] to-[#10B981]",
  alcohol: "from-[#D97706] to-[#F59E0B]",
  pharmacy: "from-[#0284C7] to-[#38BDF8]",
  fuel: "from-[#EA580C] to-[#F97316]",
};
const CAT_ICON: Record<string, React.ElementType> = {
  grocery: Leaf, alcohol: GlassWater, pharmacy: Pill, fuel: Fuel,
};

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0073FF]/20 focus:border-[#0073FF] transition-colors placeholder-gray-400";
const lbl = "block text-gray-700 text-sm font-semibold mb-1.5";

export default function ShopClient() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [active, setActive] = useState<ShopCategory | "all">("all");
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAge, setShowAge] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ name: string; category: ShopCategory; price: number } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const productsRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const url = active === "all" ? "/api/admin/shop" : `/api/admin/shop?category=${active}`;
    fetch(url)
      .then(r => r.json())
      .then((data: Product[]) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
        else setProducts(active === "all" ? DEFAULT_PRODUCTS : DEFAULT_PRODUCTS.filter(p => p.category === active));
      })
      .catch(() => {
        setProducts(active === "all" ? DEFAULT_PRODUCTS : DEFAULT_PRODUCTS.filter(p => p.category === active));
      });
  }, [active]);

  const displayed = (active === "all" ? products : products.filter(p => p.category === active))
    .filter(p => `${p.name} ${p.vendorName} ${p.description}`.toLowerCase().includes(search.toLowerCase()));

  function scrollToProducts() {
    const el = productsRef.current;
    if (!el) return;
    // Navbar (64px) + sticky filter bar (~76px) + breathing room (16px) = 156px offset
    const top = el.getBoundingClientRect().top + window.scrollY - 156;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function handleCatClick(val: ShopCategory | "all") {
    if (val === "alcohol" && !ageVerified) { setShowAge(true); return; }
    setActive(val);
    setTimeout(scrollToProducts, 60);
  }

  function addToCart(p: Product) {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === p.id);
      if (ex) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product: p, qty: 1 }];
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(id => id === p.id ? null : id), 1500);
    clearTimeout(toastTimerRef.current);
    setToast({ name: p.name, category: p.category, price: effectivePrice(p) });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  }

  const total = cart.reduce((s, i) => s + effectivePrice(i.product) * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  async function placeOrder() {
    if (!form.name || !form.phone || !form.email || !form.address) return;
    setPlacing(true);
    const ref = `ORD-${Date.now()}`;
    try {
      await fetch("/api/shop/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form.name, phone: form.phone, email: form.email, address: form.address, notes: form.notes, items: cart.map(i => ({ productId: i.product.id, productName: i.product.name, qty: i.qty, price: effectivePrice(i.product) })), total }),
      });
    } catch { /* keep local ref */ }
    setOrderRef(ref);
    setPlacing(false);
    setOrderDone(true);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
  }

  const activeCat = CATEGORIES.find(c => c.value === active);

  return (
    <div className="grocery-store min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="grocery-hero relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="grocery-pattern" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10">

            {/* Left: copy */}
            <div className="flex-1 lg:max-w-xl grocery-hero-copy">
              <div className="inline-flex items-center gap-2 bg-white/90 text-[#0867b2] text-xs font-black px-4 py-2 rounded-lg mb-5">
                <Zap className="w-3 h-3" strokeWidth={2.5} />
                Fresh, fast and delivered with care
              </div>

              <h1 className="text-white font-black text-4xl sm:text-5xl lg:text-[3.8rem] leading-[1.04] mb-5">
                We bring the store<br />
                <span>to your door.</span>
              </h1>

              <p className="grocery-hero-description text-lg leading-relaxed mb-8">
                Groceries, medicines, beverages and fuel. Order everything you need from one simple store.
              </p>

              <div className="flex flex-wrap gap-3">
                <button onClick={scrollToProducts} className="grocery-shop-btn">Shop now <ArrowRight /></button>
                <span className="grocery-delivery-note"><Clock /> Delivery in 30 to 60 min</span>
              </div>
            </div>

            {/* Right: full-bleed photo category cards */}
            <div className="hidden">
              {CATEGORIES.filter(c => c.value !== "all").map(({ value, label, bg, desc }) => {
                const heroImg = CATEGORY_HERO_IMAGES[value];
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleCatClick(value)}
                    className="relative rounded-xl overflow-hidden group cursor-pointer active:scale-[0.97] transition-transform duration-300 text-left"
                    style={{ height: "175px" }}
                  >
                    {/* Full-bleed photo */}
                    {heroImg && (
                      <img
                        src={heroImg}
                        alt={label}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    {/* Gradient fallback when no image loads */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${bg}`} style={{ opacity: heroImg ? 0.25 : 1 }} />
                    {/* Dark-to-transparent overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                    {/* Text at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-black text-base leading-tight">{label}</p>
                      <p className="text-white/65 text-[11px] font-medium mt-0.5">{desc}</p>
                    </div>
                    {/* Arrow appears on hover */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowRight className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── "All-in-one" service strip ────────────────────── */}
      <div className="bg-[#0D1526] border-y border-[#0073FF]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <p className="text-white font-bold text-sm shrink-0 text-center sm:text-left">
              One platform for every service you need in Namibia
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              {[
                { label: "Parcel Delivery", href: "/services/local-parcel", Icon: PackageCheck },
                { label: "Transport", href: "/services/transport", Icon: Car },
                { label: "Pawn Shop", href: "/pawn", Icon: Gem },
                { label: "Grocery Shop", href: "/shop", Icon: ShoppingBag },
              ].map(({ label, href, Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-[#0073FF]/15 text-gray-400 hover:text-[#4DA6FF] border border-white/8 hover:border-[#0073FF]/30 text-xs font-semibold px-3 py-1.5 rounded-full transition-all">
                  <Icon className="w-3 h-3" strokeWidth={1.75} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Shopping area (light bg) ──────────────────────── */}
      <div className="bg-gray-50">

        <section className="shop-old-showcase relative overflow-hidden" style={{ background: "linear-gradient(135deg,#f7faf8 0%,#fffaf0 52%,#f5f9f7 100%)", padding: "88px 0 96px" }}>
          {/* Soft decorative blobs, echoing the fresh-produce accents in the reference design */}
          <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 220, height: 220, left: -110, top: 100, background: "#d7edcf", filter: "blur(1px)", opacity: 0.7 }} />
          <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 180, height: 180, right: -85, bottom: 70, background: "#ffd5bd", filter: "blur(1px)", opacity: 0.7 }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
              <span className="block text-[#199264] text-[11px] font-black uppercase tracking-[0.16em] mb-3">Fresh choices, everyday</span>
              <h2 className="text-[#102947] font-black tracking-tight" style={{ fontSize: "clamp(34px,4.5vw,56px)", lineHeight: 1.06, letterSpacing: "-0.04em" }}>
                Everyday essentials,<br />made easy.
              </h2>
              <p className="text-[#697b87] text-sm leading-relaxed mt-4 max-w-md mx-auto">Fresh products and trusted favourites selected for your home, delivered with care.</p>
              <button
                type="button"
                onClick={() => handleCatClick("grocery")}
                className="inline-flex items-center gap-2 mt-6 bg-[#102947] hover:bg-[#0867b2] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-[#10294726] transition-colors"
              >
                Shop all groceries <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Product cards — circular photo overlapping a rounded card, one elevated & highlighted like the reference */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 max-w-4xl mx-auto items-end">
              {DEFAULT_PRODUCTS.filter(p => ["p13", "p1", "p14", "p17"].includes(p.id)).map((p, index) => {
                const selected = index === 1;
                const onSale = isOnSale(p);
                return (
                  <article
                    key={p.id}
                    className={`relative rounded-2xl text-center px-4 pb-5 transition-all duration-300 flex flex-col ${
                      selected
                        ? "shadow-[0_22px_44px_rgba(224,153,21,0.28)] -translate-y-4 hover:-translate-y-6"
                        : "bg-white shadow-[0_18px_40px_rgba(36,63,54,0.12)] hover:-translate-y-1"
                    }`}
                    style={{ paddingTop: 78, minHeight: 250, background: selected ? "#f7ad20" : "#fff" }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(p)}
                      aria-label={`View details for ${p.name}`}
                      className="absolute left-1/2 rounded-full overflow-hidden border-white"
                      style={{ top: -55, transform: "translateX(-50%)", width: 118, height: 118, borderWidth: 8, boxShadow: "0 12px 24px rgba(27,54,45,0.18)", background: selected ? "#fff8dd" : "#edf3ef" }}
                    >
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      {onSale && (
                        <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                          -N$ {(p.price - p.salePrice!).toFixed(0)}
                        </span>
                      )}
                    </button>

                    <div className="flex-1 flex flex-col">
                      <p className={`text-[9px] font-extrabold uppercase tracking-wide ${selected ? "text-[#654914]" : "text-[#809087]"}`}>Rider Africa selection</p>
                      <h3 className={`text-[13px] sm:text-[15px] font-black leading-snug mt-1 mb-1 ${selected ? "text-[#3a2a08]" : "text-[#183027]"}`} style={{ minHeight: 36 }}>
                        {p.name}
                      </h3>
                      <span className={`text-[10px] ${selected ? "text-[#654914]" : "text-[#8997a1]"}`}>{p.unit}</span>

                      <div className={`flex items-center justify-between mt-auto pt-3 ${selected ? "border-t border-[#d99617]" : "border-t border-[#e5ece7]"}`} style={{ marginTop: 14 }}>
                        <b className={`text-base sm:text-lg font-black ${selected ? "text-[#3a2a08]" : "text-[#183027]"}`}>N$ {effectivePrice(p).toFixed(2)}</b>
                        <button
                          type="button"
                          onClick={() => addToCart(p)}
                          aria-label={`Add ${p.name}`}
                          className={`w-8 h-8 rounded-lg grid place-items-center transition-transform hover:scale-110 shrink-0 ${selected ? "bg-white text-[#f7ad20]" : "bg-[#f7ad20] text-[#102947]"}`}
                        >
                          <Plus className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="shop-discover">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="shop-discover-head"><div><span>Picked for your basket</span><h2>Fresh finds for everyday life.</h2><p>Good food, useful essentials and simple shopping in one place.</p></div><button type="button" onClick={() => handleCatClick("grocery")}>Explore all groceries <ArrowRight /></button></div>
            <div className="shop-bento">
              <article className="shop-spotlight">
                <div className="shop-spotlight-copy"><span>Pantry favourite</span><h3>{SHOP_SPOTLIGHT.name}</h3><p>{SHOP_SPOTLIGHT.description}</p><div><b>N$ {effectivePrice(SHOP_SPOTLIGHT).toFixed(2)}</b><small>{SHOP_SPOTLIGHT.unit}</small></div><button type="button" onClick={() => addToCart(SHOP_SPOTLIGHT)}><ShoppingCart /> Add to basket</button></div>
                <button type="button" className="shop-spotlight-image" onClick={() => setSelectedProduct(SHOP_SPOTLIGHT)}><img src={SHOP_SPOTLIGHT.imageUrl} alt={SHOP_SPOTLIGHT.name} />{isOnSale(SHOP_SPOTLIGHT) && <span>Save N$ {(SHOP_SPOTLIGHT.price - SHOP_SPOTLIGHT.salePrice!).toFixed(0)}</span>}</button>
              </article>
              <div className="shop-quick-picks">{SHOP_PICKS.map(p => <article key={p.id}><button type="button" onClick={() => setSelectedProduct(p)}><img src={p.imageUrl} alt={p.name} /></button><div><span>Everyday essential</span><h3>{p.name}</h3><small>{p.unit}</small><div><b>N$ {effectivePrice(p).toFixed(2)}</b><button type="button" onClick={() => addToCart(p)} aria-label={`Add ${p.name}`}><Plus /></button></div></div></article>)}</div>
            </div>
          </div>
        </section>

        {/* Sticky category + cart bar */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-2 overflow-x-auto flex-1 no-scrollbar pb-0.5">
                {CATEGORIES.map(({ value, label, Icon, color }) => {
                  const isActiveTab = active === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleCatClick(value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap shrink-0 transition-all border ${
                        isActiveTab
                          ? "text-white shadow-lg border-transparent"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      style={isActiveTab ? { background: `linear-gradient(135deg, ${color}dd, ${color})`, boxShadow: `0 4px 14px ${color}40` } : {}}
                    >
                      <Icon className="w-4 h-4" strokeWidth={isActiveTab ? 2 : 1.75} />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Cart button — shows total when items in cart */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className={`relative flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shrink-0 ${
                  count > 0
                    ? "bg-[#0073FF] hover:bg-[#0055CC] text-white shadow-lg shadow-blue-500/30"
                    : "bg-[#0073FF] hover:bg-[#0055CC] text-white"
                }`}
              >
                <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                {count > 0 ? (
                  <>
                    <span className="font-black">{count} item{count !== 1 ? "s" : ""}</span>
                    <span className="hidden sm:inline text-blue-200">|</span>
                    <span className="hidden sm:inline font-black">N$ {total.toFixed(2)}</span>
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </>
                ) : (
                  <span className="hidden sm:block">Cart</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div ref={productsRef} className="grocery-catalog max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-32">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-gray-900 font-black text-2xl">{activeCat?.label ?? "All Products"}</h2>
              <p className="text-gray-500 text-sm mt-0.5">{displayed.length} items | Delivered in 30 to 60 min</p>
            </div>
            <label className="grocery-search">
              <Search />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, stores or categories…" />
              {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X /></button>}
            </label>
            {count > 0 && (
              <button type="button" onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 bg-[#0073FF]/10 text-[#0073FF] font-bold text-sm px-4 py-2 rounded-xl hover:bg-[#0073FF]/15 transition-colors">
                View cart ({count}) <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div className="grocery-product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {displayed.map(p => {
              const CatIcon = CAT_ICON[p.category] ?? ShoppingBag;
              const catBg = CAT_BG[p.category] ?? "from-[#0073FF] to-[#003EA6]";
              const inCart = cart.find(i => i.product.id === p.id);
              const justAdded = addedId === p.id;
              const onSale = isOnSale(p);
              return (
                <div key={p.id} className={`bg-white rounded-2xl overflow-hidden transition-all duration-200 group border flex flex-col ${
                  justAdded
                    ? "border-green-400 shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
                    : "border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                }`}>
                  {/* Thumbnail — click opens product detail */}
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(p)}
                    className={`relative h-56 w-full bg-gradient-to-br ${catBg} flex items-center justify-center overflow-hidden`}
                    aria-label={`View details for ${p.name}`}
                  >
                    {/* Real image when available, icon fallback */}
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-contain p-3"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <>
                        <CatIcon className="w-32 h-32 text-white/10 absolute" strokeWidth={1} />
                        <CatIcon className={`w-16 h-16 text-white/80 relative z-10 transition-transform duration-300 ${justAdded ? "scale-110" : "group-hover:scale-110"}`} strokeWidth={1.5} />
                      </>
                    )}

                    {/* Detail action without an image overlay */}
                    <span className="product-view-cta absolute left-1/2 bottom-4 z-20 opacity-0 group-hover:opacity-100">
                      <Eye /> View details <ArrowRight />
                    </span>

                    {justAdded && (
                      <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center z-30">
                        <div className="bg-green-500 text-white rounded-full p-2.5 shadow-lg">
                          <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                      </div>
                    )}
                    {p.requiresAgeVerification && !justAdded && (
                      <span className="absolute top-2 right-2 bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10">18+</span>
                    )}
                    {onSale && !justAdded && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10">ON SALE</span>
                    )}
                    {!p.inStock && (
                      <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center z-30">
                        <span className="text-white text-xs font-bold bg-red-500 px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                    {inCart && !justAdded && (
                      <div className={`absolute left-2 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 ${onSale ? "top-9" : "top-2"}`}>
                        ✓ {inCart.qty} in cart
                      </div>
                    )}
                  </button>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex-1">
                      <p className="text-gray-900 font-black text-base leading-snug mb-0.5">{p.name}</p>
                      <p className="text-gray-400 text-[11px] mb-2 capitalize">{p.category === "grocery" ? "Food & groceries" : p.category}</p>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{p.description}</p>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {onSale ? (
                          <>
                            <span className="text-red-500 font-black text-xl">N$ {p.salePrice!.toFixed(2)}</span>
                            <span className="text-gray-400 text-xs line-through ml-1.5">N$ {p.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-[#0073FF] font-black text-xl">N$ {p.price.toFixed(2)}</span>
                        )}
                        <span className="text-gray-400 text-[10px] ml-1 block">{p.unit}</span>
                      </div>
                      <span className={`flex items-center gap-1 text-[10px] font-bold ${p.inStock ? "text-green-600" : "text-red-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? "bg-green-500" : "bg-red-400"}`} />
                        {p.inStock ? "In Stock" : "Unavailable"}
                      </span>
                    </div>

                    {inCart ? (
                      <div className="flex items-center justify-between bg-[#0073FF]/8 rounded-xl px-3 py-2">
                        <button type="button" onClick={() => updateQty(p.id, -1)} className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                          <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                        <span className="text-[#0073FF] font-black text-sm">{inCart.qty}</span>
                        <button type="button" onClick={() => updateQty(p.id, 1)} className="w-8 h-8 bg-[#0073FF] rounded-lg flex items-center justify-center text-white hover:bg-[#0055CC] active:bg-[#003EA6] transition-colors">
                          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => p.inStock && addToCart(p)}
                        disabled={!p.inStock}
                        className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                          justAdded
                            ? "bg-green-500 text-white"
                            : "bg-[#0073FF] hover:bg-[#0055CC] active:bg-[#003EA6] text-white"
                        }`}
                      >
                        {justAdded ? (
                          <><CheckCircle2 className="w-4 h-4" strokeWidth={2.5} /> Added!</>
                        ) : (
                          <><ShoppingCart className="w-4 h-4" strokeWidth={2} /> Add to Cart</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {displayed.length === 0 && <div className="grocery-empty"><Search /><h3>No products found</h3><p>Try another search or select a different category.</p><button onClick={() => { setSearch(""); setActive("all"); }}>View all products</button></div>}
        </div>

        {/* Footer CTA strip */}
        <div className="bg-[#090E1A] border-t border-[#0073FF]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h3 className="text-white font-black text-2xl mb-2">Need more from Rider Africa?</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">We ship packages, transport passengers and accept pawned valuables, all on one platform across Namibia.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Parcel Delivery", desc: "Same-day local & international shipping", href: "/services/local-parcel", Icon: PackageCheck, color: "#0073FF" },
                { label: "Passenger Transport", desc: "Safe, verified rides across Windhoek", href: "/services/transport", Icon: Car, color: "#10B981" },
                { label: "Pawn Services", desc: "Valuables accepted, fast cash with no hassle", href: "/pawn", Icon: Gem, color: "#F59E0B" },
              ].map(({ label, desc, href, Icon, color }) => (
                <Link key={href} href={href}
                  className="flex flex-col items-center text-center p-6 bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/15 rounded-2xl transition-all group">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}25` }}>
                    <Icon className="w-6 h-6" style={{ color }} strokeWidth={1.75} />
                  </div>
                  <p className="text-white font-bold text-sm mb-1">{label}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{desc}</p>
                  <span className="flex items-center gap-1 text-xs font-semibold transition-colors group-hover:text-white" style={{ color: `${color}bb` }}>
                    Learn more <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Detail Modal ──────────────────────────── */}
      {selectedProduct && (() => {
        const SelIcon = CAT_ICON[selectedProduct.category] ?? ShoppingBag;
        const selCatBg = CAT_BG[selectedProduct.category] ?? "from-[#0073FF] to-[#003EA6]";
        const selCatColor = CATEGORIES.find(c => c.value === selectedProduct.category)?.color ?? "#0073FF";
        const inCart = cart.find(i => i.product.id === selectedProduct.id);
        const selOnSale = isOnSale(selectedProduct);
        const selPrice = effectivePrice(selectedProduct);
        return (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={e => { if (e.target === e.currentTarget) setSelectedProduct(null); }}
          >
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }}>
              {/* Visual header */}
              <div className={`relative flex-shrink-0 h-64 bg-gradient-to-br ${selCatBg} flex items-center justify-center overflow-hidden`}>
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="absolute inset-0 w-full h-full object-contain p-6"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <>
                    <SelIcon className="w-40 h-40 text-white/10 absolute" strokeWidth={1} />
                    <SelIcon className="w-20 h-20 text-white/80 relative z-10" strokeWidth={1.25} />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}
                  className="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
                {selectedProduct.requiresAgeVerification && (
                  <span style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10 }}
                    className="bg-amber-400 text-white text-xs font-black px-3 py-1 rounded-full">18+ Only</span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full capitalize" style={{ background: `${selCatColor}18`, color: selCatColor }}>
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.inStock
                    ? <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-full">In Stock</span>
                    : <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                  }
                </div>

                <h2 className="text-gray-900 font-black text-2xl leading-tight mb-1">{selectedProduct.name}</h2>
                <p className="text-gray-400 text-sm mb-4 capitalize">{selectedProduct.category === "grocery" ? "Food & groceries" : selectedProduct.category}</p>

                <div className="flex items-baseline gap-2 mb-5 flex-wrap">
                  <span className={`font-black text-3xl ${selOnSale ? "text-red-500" : "text-[#0073FF]"}`}>N$ {selPrice.toFixed(2)}</span>
                  {selOnSale && <span className="text-gray-400 text-lg line-through">N$ {selectedProduct.price.toFixed(2)}</span>}
                  <span className="text-gray-400 text-sm">{selectedProduct.unit}</span>
                  {selOnSale && <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-2.5 py-0.5 rounded-full">ON SALE</span>}
                </div>

                <p className="text-gray-600 leading-relaxed text-sm">{selectedProduct.description}</p>
              </div>

              {/* Action footer */}
              <div className="p-5 border-t border-gray-100 flex-shrink-0">
                {inCart ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2 flex-1">
                      <button type="button" onClick={() => updateQty(selectedProduct.id, -1)}
                        className="w-9 h-9 bg-white rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Minus className="w-4 h-4 text-gray-700" strokeWidth={2.5} />
                      </button>
                      <span className="font-black text-xl text-gray-900 flex-1 text-center">{inCart.qty}</span>
                      <button type="button" onClick={() => updateQty(selectedProduct.id, 1)}
                        className="w-9 h-9 bg-[#0073FF] rounded-xl flex items-center justify-center hover:bg-[#0055CC] transition-colors">
                        <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </button>
                    </div>
                    <button type="button" onClick={() => { setSelectedProduct(null); setCheckoutOpen(true); }}
                      className="flex items-center gap-2 bg-[#0073FF] hover:bg-[#0055CC] text-white font-black px-5 py-3 rounded-2xl text-sm transition-colors shrink-0">
                      Checkout <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { if (selectedProduct.inStock) { addToCart(selectedProduct); setSelectedProduct(null); } }}
                    disabled={!selectedProduct.inStock}
                    className="w-full flex items-center justify-center gap-2 bg-[#0073FF] hover:bg-[#0055CC] active:bg-[#003EA6] disabled:opacity-40 text-white font-black py-4 rounded-2xl text-sm transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                    Add to Cart | N$ {selPrice.toFixed(2)} {selectedProduct.unit}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Add-to-cart toast ─────────────────────────────── */}
      {toast && (
        <div
          style={{ position: "fixed", top: "76px", right: "16px", zIndex: 55, width: "288px" }}
          className="bg-[#0D1526] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
        >
          <div className="p-4 flex items-start gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${CAT_BG[toast.category]} flex items-center justify-center shrink-0`}>
              {(() => { const I = CAT_ICON[toast.category] ?? ShoppingBag; return <I className="w-5 h-5 text-white" strokeWidth={1.75} />; })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mb-0.5">
                <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} /> Added to cart!
              </p>
              <p className="text-white text-sm font-bold leading-snug truncate">{toast.name}</p>
              <p className="text-[#4DA6FF] text-xs font-semibold mt-0.5">N$ {toast.price.toFixed(2)}</p>
            </div>
            <button type="button" onClick={() => setToast(null)} className="text-gray-600 hover:text-white transition-colors mt-0.5 shrink-0">
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <div className="px-4 pb-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setToast(null); setCartOpen(true); }}
              className="bg-white/8 hover:bg-white/15 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              View Cart ({count})
            </button>
            <button
              type="button"
              onClick={() => { setToast(null); setCheckoutOpen(true); }}
              className="bg-[#0073FF] hover:bg-[#0055CC] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              Checkout →
            </button>
          </div>
          <div className="h-0.5 bg-white/5">
            <div className="h-full bg-[#0073FF] origin-left" style={{ animation: "shrink-bar 3.5s linear forwards" }} />
          </div>
        </div>
      )}

      {/* ── Cart Drawer ── inline styles so it never shows on slow CSS load ── */}
      {cartOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.55)" }}
          onClick={() => setCartOpen(false)}
        />
      )}
      <div
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          right: 0,
          zIndex: 50,
          width: "100%",
          maxWidth: "384px",
          background: "white",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 48px rgba(0,0,0,0.3)",
          transition: "transform 0.3s ease-in-out",
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* ── Cart header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingCart style={{ width: 20, height: 20, color: "#0073FF" }} strokeWidth={2} />
            <span style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>Your Cart</span>
            {count > 0 && <span style={{ background: "#0073FF", color: "white", fontSize: 11, fontWeight: 900, padding: "2px 8px", borderRadius: 999 }}>{count}</span>}
          </div>
          <button type="button" onClick={() => setCartOpen(false)} style={{ color: "#9ca3af", padding: 4, borderRadius: 8, cursor: "pointer", background: "none", border: "none", display: "flex" }}>
            <X style={{ width: 20, height: 20 }} strokeWidth={2} />
          </button>
        </div>

        {cart.length === 0 ? (
          /* ── Empty state ── */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", textAlign: "center" }}>
            <ShoppingBag style={{ width: 64, height: 64, color: "#e5e7eb", marginBottom: 16 }} strokeWidth={1} />
            <p style={{ fontWeight: 700, fontSize: 18, color: "#1f2937", marginBottom: 6 }}>Cart is empty</p>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>Add items from the shop to start your order</p>
            <button type="button" onClick={() => setCartOpen(false)}
              style={{ background: "#0073FF", color: "white", fontWeight: 700, padding: "10px 24px", borderRadius: 12, fontSize: 14, border: "none", cursor: "pointer" }}>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* ── CHECKOUT FIRST — always the first thing visible ── */}
            <div style={{ padding: "16px 20px", background: "#f0f7ff", borderBottom: "1px solid #dbeafe", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                style={{ width: "100%", background: "#0073FF", color: "white", fontWeight: 900, fontSize: 16, padding: "14px 20px", borderRadius: 16, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(0,115,255,0.35)" }}
              >
                <ShoppingCart style={{ width: 20, height: 20 }} strokeWidth={2} />
                Checkout | N$ {total.toFixed(2)}
                <ChevronRight style={{ width: 20, height: 20 }} strokeWidth={2.5} />
              </button>
              <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 8 }}>
                {count} item{count !== 1 ? "s" : ""} | Delivery fee added at checkout
              </p>
            </div>

            {/* ── Items list ── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Order Items</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cart.map(({ product: p, qty }) => {
                  const CIcon = CAT_ICON[p.category] ?? ShoppingBag;
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#f9fafb", borderRadius: 14, padding: 12, border: "1px solid #f3f4f6" }}>
                      {/* Product image or icon */}
                      <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <CIcon style={{ width: 24, height: 24, color: "#6b7280" }} strokeWidth={1.5} />
                        )}
                      </div>
                      {/* Name + price */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                        <p style={{ fontWeight: 900, fontSize: 15, color: isOnSale(p) ? "#ef4444" : "#0073FF", marginTop: 2 }}>N$ {(effectivePrice(p) * qty).toFixed(2)}</p>
                        <p style={{ fontSize: 11, color: "#9ca3af" }}>N$ {effectivePrice(p).toFixed(2)} {p.unit}</p>
                      </div>
                      {/* Qty controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <button type="button" onClick={() => updateQty(p.id, -1)} style={{ width: 28, height: 28, border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Minus style={{ width: 13, height: 13, color: "#374151" }} strokeWidth={2.5} />
                        </button>
                        <span style={{ fontWeight: 900, fontSize: 15, color: "#111827", minWidth: 20, textAlign: "center" }}>{qty}</span>
                        <button type="button" onClick={() => updateQty(p.id, 1)} style={{ width: 28, height: 28, background: "#0073FF", borderRadius: 8, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Plus style={{ width: 13, height: 13, color: "white" }} strokeWidth={2.5} />
                        </button>
                        {deleteConfirm === p.id ? (
                          <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
                            <button type="button" onClick={() => { updateQty(p.id, -qty); setDeleteConfirm(null); }} style={{ background: "#ef4444", color: "white", fontSize: 10, fontWeight: 900, padding: "3px 8px", borderRadius: 6, border: "none", cursor: "pointer" }}>Remove</button>
                            <button type="button" onClick={() => setDeleteConfirm(null)} style={{ background: "#f3f4f6", color: "#374151", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: "none", cursor: "pointer" }}>Keep</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => setDeleteConfirm(p.id)} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2 }}>
                            <Trash2 style={{ width: 14, height: 14, color: "#f87171" }} strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Compact total footer ── */}
            <div style={{ padding: "12px 20px", borderTop: "1px solid #f3f4f6", background: "#fafafa", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Subtotal ({count} item{count !== 1 ? "s" : ""})</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#111827" }}>N$ {total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Checkout modal ────────────────────────────────── */}
      {checkoutOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.6)" }} onClick={e => e.target === e.currentTarget && setCheckoutOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 font-black text-lg">Complete Order</h3>
              <button type="button" onClick={() => setCheckoutOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={lbl}>Full Name *</label>
                  <input className={inp} placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Phone *</label>
                  <input className={inp} type="tel" placeholder="+264 81 …" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Email *</label>
                  <input className={inp} type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className={lbl}><MapPin className="w-3.5 h-3.5 inline mr-1 text-[#0073FF]" />Delivery Address *</label>
                  <textarea className={inp} rows={2} placeholder="Street, suburb, city" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className={lbl}>Special Notes</label>
                  <textarea className={inp} rows={2} placeholder="Gate code, delivery instructions…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-gray-700 font-bold text-sm mb-3">Order Summary</p>
                {cart.map(({ product: p, qty }) => (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{p.name} × {qty}</span>
                    <span className="text-gray-800 font-semibold">N$ {(effectivePrice(p) * qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-black">
                  <span className="text-gray-800">Total</span>
                  <span className="text-[#0073FF] text-lg">N$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button type="button" onClick={placeOrder} disabled={placing || !form.name || !form.phone || !form.email || !form.address}
                className="w-full flex items-center justify-center gap-2 bg-[#0073FF] hover:bg-[#0055CC] active:bg-[#003EA6] text-white font-black py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                {placing ? "Placing Order…" : `Pay N$ ${total.toFixed(2)}`}
                {!placing && <ChevronRight className="w-4 h-4" strokeWidth={2.5} />}
              </button>
              <p className="text-gray-400 text-xs text-center mt-2">Secure payment | DPO Group</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Order success ─────────────────────────────────── */}
      {orderDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-20 h-20 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={1.75} />
            </div>
            <h2 className="text-gray-900 font-black text-xl mb-2">Order Placed!</h2>
            <p className="text-gray-500 text-sm mb-4">Your order is confirmed and a rider is being assigned.</p>
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-2">
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-0.5">Reference</p>
              <p className="text-gray-900 font-mono font-black">{orderRef}</p>
            </div>
            <p className="text-gray-400 text-xs mb-6">Estimated delivery: <strong className="text-gray-600">30 to 60 minutes</strong></p>
            <button type="button" onClick={() => { setOrderDone(false); setForm({ name: "", phone: "", email: "", address: "", notes: "" }); }}
              className="w-full bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold py-3 rounded-xl text-sm transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* ── Age Verification ──────────────────────────────── */}
      {showAge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Shield className="w-8 h-8 text-amber-500" strokeWidth={1.75} />
            </div>
            <h2 className="text-gray-900 font-black text-xl mb-2">Age Verification</h2>
            <p className="text-gray-500 text-sm mb-1">The Alcohol section is for adults only.</p>
            <p className="text-gray-800 font-bold text-sm mb-6">You must be <span className="text-amber-600">18 years or older</span> to view these products.</p>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => { setAgeVerified(true); setShowAge(false); setActive("alcohol"); }}
                className="w-full bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold py-3 rounded-xl text-sm transition-colors">
                I am 18 or older | Continue
              </button>
              <button type="button" onClick={() => setShowAge(false)}
                className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl text-sm transition-colors">
                I am under 18 | Go Back
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-4">By confirming you agree you are of legal drinking age in Namibia (18+).</p>
          </div>
        </div>
      )}
    </div>
  );
}
