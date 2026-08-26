import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import SocialLinks from "../components/SocialLinks";

function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Subtle parallax: image moves slower than scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section className="hero" ref={heroRef} id="hero">
      <motion.div
        className="hero-bg"
        style={{ y: imageY }}
      />

      <div className="hero-gradient" />

      <motion.div
        className="hero-content"
        style={{ opacity: contentOpacity }}
      >
        <motion.p
          className="hero-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          EMBASSY OF THE REPUBLIC OF SIERRA LEONE
        </motion.p>

        <h1>
          <motion.span
            className="hero-line"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
          >
            Sierra Leone
          </motion.span>
          <motion.span
            className="hero-line hero-italic"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          >
            in Ethiopia.
          </motion.span>
        </h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        >
          Strengthening diplomatic relations, fostering cooperation,
          and connecting the people of Sierra Leone and Ethiopia.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: "easeOut" }}
        >
          <a href="#about" className="hero-button">
            Discover the Embassy
            <ArrowDown size={18} />
          </a>

          <SocialLinks wrapClassName="hero-socials" itemClassName="hero-social" />
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-location"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <span>ADDIS ABABA</span>
        <span>ETHIOPIA</span>
      </motion.div>

      <motion.div
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
      >
        <span className="hero-scroll-line" />
        <span className="hero-scroll-text">SCROLL</span>
      </motion.div>
    </section>
  );
}

export default Hero;
