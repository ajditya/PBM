import { motion } from "framer-motion"

import { heroVideo } from "@/lib/placeholder-assets"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Homepage hero — Screen 1 fold 1.
 *
 * Full-bleed runway video, dark gradient overlay, bottom-left
 * editorial headline, bottom-right vertical SCROLL cue.
 *
 * The headline is intentionally massive (140px @ desktop, 56px
 * mobile, line-height 0.95) and the fade/stagger uses the
 * editorial easeOutExpo curve.
 * ──────────────────────────────────────────────────────────── */

const headlineParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.4 },
  },
}

const headlineChild = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: easeOutExpo },
  },
}

export default function HomeHero() {
  return (
    <section
      aria-label="Hero"
      className="relative h-screen w-full overflow-hidden bg-ink text-paper"
    >
      {/* ─── Background video ─── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={heroVideo.poster}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={heroVideo.src} type="video/mp4" />
      </video>

      {/* ─── Gradient overlay: bottom 60% → top 20% black ─── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.45) 35%, rgba(10,10,10,0.25) 70%, rgba(10,10,10,0.2) 100%)",
        }}
      />

      {/* ─── Bottom-left editorial content ─── */}
      <motion.div
        variants={headlineParent}
        initial="hidden"
        animate="visible"
        className="absolute inset-x-0 bottom-0 px-6 pb-16 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24"
      >
        <div className="max-w-[1600px] mx-auto">
          <motion.p variants={headlineChild} className="pbm-eyebrow mb-6">
            Est. 1985 · Bengaluru
          </motion.p>

          <motion.h1
            variants={headlineChild}
            className="pbm-display-xl text-paper"
          >
            Faces that
            <br />
            define fashion.
          </motion.h1>

          <motion.div variants={headlineChild} className="mt-10">
            <a
              href="#about"
              className="pbm-link text-paper"
              aria-label="Discover Prasad Bidapa"
            >
              Discover <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Bottom-right vertical SCROLL indicator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: easeOutExpo, delay: 1.2 }}
        className="absolute bottom-16 right-6 hidden flex-col items-center gap-4 sm:right-10 lg:right-14 md:flex"
      >
        <span className="pbm-meta-label text-paper [writing-mode:vertical-rl] rotate-180">
          Scroll
        </span>
        <span aria-hidden className="relative block h-16 w-px overflow-hidden bg-paper/20">
          <motion.span
            className="absolute inset-x-0 top-0 block h-1/2 bg-paper"
            animate={{ y: ["-100%", "200%"] }}
            transition={{
              duration: 2.4,
              ease: easeOutExpo,
              repeat: Infinity,
              repeatDelay: 0.4,
            }}
          />
        </span>
      </motion.div>
    </section>
  )
}
