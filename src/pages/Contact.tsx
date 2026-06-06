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

        {/* ── Right — embedded studio map ── */}
        <div className="relative min-h-[420px] border-t border-hairline lg:min-h-0 lg:border-l lg:border-t-0">
          <StudioMap />
        </div>
      </div>
    </section>
  )
}

/* ─── Embedded Google map of the Prasad Bidapa Associates studio ─── */
function StudioMap() {
  return (
    <iframe
      title="Prasad Bidapa Associates studio location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.5423476282454!2d77.56054259999999!3d13.1281532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae230050ad3915%3A0xf3a9aad61c18d5bf!2sPrasad%20Bidapa%20Associates!5e0!3m2!1sen!2sin!4v1780759807785!5m2!1sen!2sin"
      className="absolute inset-0 h-full w-full"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
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
