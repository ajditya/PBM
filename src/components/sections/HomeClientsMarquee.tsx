import { motion } from "framer-motion"

import { clientLogos } from "@/lib/placeholder-assets"

/* ────────────────────────────────────────────────────────────
 * Homepage fold 5 — "Trusted by".
 *
 * White background, 120px tall, hairline above + below, centered
 * tracked label, infinite-linear marquee row of grayscale wordmark
 * "logos" (just the brand names rendered in tracked Inter caps).
 *
 * The marquee is two copies of the list translated -50% on a loop
 * for a seamless infinite scroll.
 * ──────────────────────────────────────────────────────────── */

export default function HomeClientsMarquee() {
  return (
    <section
      aria-label="Trusted by"
      className="relative overflow-hidden border-y border-hairline bg-paper py-10"
    >
      <p className="pbm-eyebrow-mute mb-8 text-center">Trusted by</p>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-16 whitespace-nowrap will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 48,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...clientLogos, ...clientLogos].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="pbm-display-xs uppercase tracking-[0.18em] text-ink/55"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
