"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const photos = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Rider Africa delivery team unloading packages from a van",
    caption: "Same-day delivery",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Driver-partners reviewing shipments at the warehouse",
    caption: "Driver-partner network",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Rider Africa driver delivering food to a customer's door",
    caption: "Food & parcel delivery",
  },
  {
    src: "/images/gallery-4.jpg",
    alt: "Package dropped safely at customer doorstep",
    caption: "Doorstep delivery",
  },
  {
    src: "/images/gallery-5.jpg",
    alt: "Happy customers using the Rider Africa app",
    caption: "Happy customers",
  },
  {
    src: "/images/gallery-6.jpg",
    alt: "Fresh groceries delivered on demand",
    caption: "Grocery delivery",
  },
];

export default function Gallery() {
  return (
    <section className="py-20 sm:py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ y: 16 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[#4DA6FF] font-semibold text-sm uppercase tracking-widest">
            In Action
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-4">
            Rider Africa on the Ground
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
            Real people, real deliveries — across Namibia every day.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-800 group"
              initial={{ scale: 0.97 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
              />
              {/* Hover overlay with caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                <span className="text-white text-xs sm:text-sm font-semibold">
                  {photo.caption}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
