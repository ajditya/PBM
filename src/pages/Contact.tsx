import { motion } from "framer-motion"

import ContactForm from "@/components/forms/ContactForm"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Screen 7 — Contact.
 *
 * 50vh hero · 50/50 split (contact blocks left, mono SVG map
 * right) · centered ContactForm below.
 * ──────────────────────────────────────────────────────────── */

const CONTACT_BLOCKS = [
  {
    label: "Studio",
    lines: ["No. 14, 6th Cross, Yelahanka", "Bengaluru 560064", "Karnataka, India"],
  },
  {
    label: "General",
    lines: ["hello@prasadbidapa.com", "+91 80 2856 0014"],
  },
  {
    label: "Bookings",
    lines: ["bookings@prasadbidapa.com"],
  },
  {
    label: "Press",
    lines: ["press@prasadbidapa.com"],
  },
] as const

function ContactHero() {
  return (
    <section
      aria-label="Contact — get in touch"
      className="relative flex min-h-[50vh] items-end bg-paper text-ink"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-40 lg:px-14 lg:pb-24 lg:pt-48">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo }}
          className="pbm-eyebrow mb-10"
        >
          Bengaluru · Mumbai · Delhi
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.1 }}
          className="pbm-display-l"
        >
          Get in touch.
        </motion.h1>
      </div>
    </section>
  )
}

function ContactSplit() {
  return (
    <section
      aria-label="Studio details"
      className="bg-paper"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ── Left — contact info blocks ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
          className="border-t border-hairline px-6 py-20 sm:px-10 sm:py-28 lg:border-t-0 lg:px-14 lg:py-32"
        >
          <div className="space-y-14">
            {CONTACT_BLOCKS.map((block) => (
              <motion.div
                key={block.label}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, ease: easeOutExpo },
                  },
                }}
                className="border-b border-hairline pb-10"
              >
                <p className="pbm-eyebrow mb-4">{block.label}</p>
                {block.lines.map((line, i) => (
                  <p
                    key={line}
                    className={
                      i === 0
                        ? "pbm-display-xs text-ink"
                        : "pbm-meta-value mt-2 text-ink/70"
                    }
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}

            {/* Socials */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, ease: easeOutExpo },
                },
              }}
              className="flex flex-col gap-3"
            >
              <p className="pbm-meta-label mb-2">Follow</p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="pbm-link self-start text-ink"
              >
                Instagram <span aria-hidden>→</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="pbm-link self-start text-ink"
              >
                LinkedIn <span aria-hidden>→</span>
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Right — monochrome SVG map ── */}
        <div className="relative min-h-[420px] border-t border-hairline lg:min-h-0 lg:border-l lg:border-t-0">
          <MonoMap />
        </div>
      </div>
    </section>
  )
}

/* ─── Hand-drawn monochrome map of Bengaluru with a single ink pin ─── */
function MonoMap() {
  return (
    <svg
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Studio location map"
      className="absolute inset-0 h-full w-full bg-[#f0f0eb] text-ink"
    >
      {/* Light tint base */}
      <rect width="800" height="800" fill="#f0f0eb" />

      {/* Background road grid — very faint hairlines */}
      <g stroke="rgba(10,10,10,0.08)" strokeWidth="1" fill="none">
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 50}
            x2="800"
            y2={i * 50 - 80}
          />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 50}
            y1="0"
            x2={i * 50 + 60}
            y2="800"
          />
        ))}
      </g>

      {/* Major arterial roads */}
      <g
        stroke="rgba(10,10,10,0.22)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M 50 580 C 220 540, 360 540, 520 600 S 760 700, 800 720" />
        <path d="M 0 320 C 180 280, 320 360, 480 320 S 700 240, 800 280" />
        <path d="M 380 0 C 360 200, 440 360, 400 540 S 360 760, 380 800" />
        <path d="M 60 0 C 100 200, 60 380, 140 560 S 220 760, 260 800" />
      </g>

      {/* Secondary roads */}
      <g
        stroke="rgba(10,10,10,0.14)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M 200 100 C 240 180, 320 200, 400 240 S 540 320, 620 380" />
        <path d="M 100 480 C 240 520, 360 460, 480 500 S 640 540, 760 500" />
        <path d="M 540 60 L 720 220" />
        <path d="M 240 700 L 480 760" />
      </g>

      {/* Single ink pin marking the studio */}
      <g transform="translate(400 380)">
        <circle r="44" fill="rgba(10,10,10,0.06)" />
        <circle r="22" fill="rgba(10,10,10,0.12)" />
        <circle r="6" fill="#0a0a0a" />
        <line
          x1="0"
          y1="6"
          x2="0"
          y2="40"
          stroke="#0a0a0a"
          strokeWidth="1.5"
        />
      </g>

      {/* Tracked label */}
      <text
        x="400"
        y="460"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        letterSpacing="3"
        fill="#0a0a0a"
        opacity="0.7"
      >
        STUDIO · YELAHANKA
      </text>
    </svg>
  )
}

export default function Contact() {
  return (
    <main className="bg-paper text-ink">
      <ContactHero />
      <ContactSplit />
      <ContactForm />
    </main>
  )
}
