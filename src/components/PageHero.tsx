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

export default function PageHero({ tagline, title, titleHighlight, subtitle, imageSrc, imageAlt = "", imagePosition = "center", rightContent }: Props) {
  return (
    <section className={`ra-page-hero ${imageSrc ? "has-image" : "no-image"}`}>
      {imageSrc && <>
        <motion.img src={imageSrc} alt={imageAlt} className="ra-page-hero-image" style={{ objectPosition: imagePosition }} initial={{ scale: 1.04 }} animate={{ scale: 1 }} transition={{ duration: 3 }} />
        <div className="ra-page-hero-overlay" />
      </>}
      <div className="ra-page-dots" />
      <div className="ra-shell ra-page-hero-inner">
        <div className="ra-page-hero-copy">
          <span className="ra-page-tag"><i />{tagline}</span>
          <h1>{title}{titleHighlight && <><br /><em>{titleHighlight}</em></>}</h1>
          {subtitle && <p>{subtitle}</p>}
          <div className="ra-page-line" />
        </div>
        {rightContent && <div className="ra-page-hero-extra">{rightContent}</div>}
      </div>
    </section>
  );
}
