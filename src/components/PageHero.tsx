"use client";
import { motion } from "framer-motion";

interface Props {
  tagline: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: string;
  gradient?: string;
  rightContent?: React.ReactNode;
}

export default function PageHero({
  tagline,
  title,
  titleHighlight,
  subtitle,
  imageSrc,
  imageAlt = "",
  imagePosition = "center",
  gradient = "from-[#003EA6] via-[#0055CC] to-[#0073FF]",
  rightContent,
}: Props) {
  const hasRightPanel = !imageSrc && !!rightContent;

  return (
    <section className="relative pt-16 min-h-[620px] flex items-end overflow-hidden">

      {/* ── Background ── */}
      {imageSrc ? (
        <>
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: imagePosition }}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090E1A] via-[#090E1A]/75 to-[#090E1A]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090E1A]/85 via-[#090E1A]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[600px] h-48 bg-gradient-to-tr from-[#0073FF]/25 to-transparent pointer-events-none" />
        </>
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
              `,
              backgroundSize: "52px 52px",
            }}
          />
          {/* Ambient blobs — smaller when right panel is present */}
          <motion.div
            className={`absolute ${hasRightPanel ? "top-20 left-8 w-48 h-48" : "top-16 right-16 w-72 h-72"} bg-white/10 rounded-full blur-3xl`}
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 w-52 h-52 bg-white/8 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </>
      )}

      {/* Decorative: top line + dot grid corner */}
      <div className="absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0073FF]/40 to-transparent pointer-events-none" />
      <div
        className="absolute bottom-8 right-8 w-40 h-40 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,115,255,0.8) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
        {hasRightPanel ? (
          /* Two-column layout: text left, animated visual right */
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
            {/* Left: text */}
            <div className="flex-1 page-enter">
              <TextContent tagline={tagline} title={title} titleHighlight={titleHighlight} subtitle={subtitle} />
            </div>
            {/* Right: animated visual (desktop only) */}
            <div className="hidden lg:flex w-[380px] shrink-0 items-center justify-center">
              {rightContent}
            </div>
          </div>
        ) : (
          /* Original single-column layout */
          <div className="page-enter">
            <TextContent tagline={tagline} title={title} titleHighlight={titleHighlight} subtitle={subtitle} />
          </div>
        )}
      </div>
    </section>
  );
}

function TextContent({ tagline, title, titleHighlight, subtitle }: {
  tagline: string; title: string; titleHighlight?: string; subtitle?: string;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2 bg-white/10 border border-white/25 backdrop-blur-sm text-blue-100 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 bg-[#0073FF] rounded-full animate-pulse" />
        {tagline}
      </span>
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-5">
        {title}
        {titleHighlight && (
          <>
            <br />
            <span className="gradient-text-light">{titleHighlight}</span>
          </>
        )}
      </h1>
      {subtitle && (
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl leading-relaxed">{subtitle}</p>
      )}
      <div className="mt-8 w-24 h-1 bg-gradient-to-r from-[#0073FF] to-[#4DA6FF] rounded-full" />
    </>
  );
}
