import AnimateOnScroll from "@/components/AnimateOnScroll";

interface Props {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, subtitle, lastUpdated, children }: Props) {
  return (
    <div className="pt-16">
      <section className="ra-policy-hero py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="inline-block bg-[#0073FF]/15 border border-[#0073FF]/30 text-[#4DA6FF] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
              Legal
            </span>
            <h1 className="text-4xl font-black text-white mb-4">{title}</h1>
            {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
            {lastUpdated && <p className="text-gray-500 text-sm mt-3">Last updated: {lastUpdated}</p>}
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900
              [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2
              [&_h2]:border-b [&_h2]:border-[#0073FF]/15
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-800
              [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:text-gray-600 [&_ul]:space-y-2 [&_ul]:mb-4 [&_ul]:pl-5
              [&_li]:list-disc [&_li]:leading-relaxed
              [&_strong]:text-gray-900
            ">
              {children}
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
