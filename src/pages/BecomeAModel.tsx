import { useRef } from "react"
import { motion } from "framer-motion"

import ApplicationForm from "@/components/forms/ApplicationForm"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * Screen 6 — Become a Model.
 *
 * 70vh editorial hero with a "Be / Discovered." headline, then
 * the multi-step application form below. UI only — no submit
 * handler, no validation library, no Supabase.
 * ──────────────────────────────────────────────────────────── */

export default function BecomeAModel() {
  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main className="bg-paper text-ink">
      {/* ─── Hero — 70vh ─── */}
      <section
        aria-label="Be discovered — open call 2026"
        className="relative flex min-h-[70vh] items-end bg-paper"
      >
        <div className="mx-auto w-full max-w-[1600px] px-6 pb-20 pt-32 sm:px-10 sm:pb-24 sm:pt-40 lg:px-14 lg:pb-32 lg:pt-48">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOutExpo }}
            className="pbm-eyebrow mb-12"
          >
            Open Call · 2026
          </motion.p>

          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12">
            {/* Headline — left 6 cols */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.1 }}
              className="pbm-display-xl lg:col-span-6"
            >
              Be
              <br />
              Discovered.
            </motion.h1>

            {/* Manifesto — right 5 cols offset down */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: easeOutExpo, delay: 0.4 }}
              className="lg:col-span-5 lg:col-start-8 lg:pt-32"
            >
              <p className="pbm-body max-w-[40ch]">
                Mega Model Hunt has discovered Deepika Padukone, Anushka
                Sharma, Lara Dutta and dozens of working faces over twenty-two
                editions. We look for presence, proportion and a quiet that
                photographs — not a portfolio. The application takes ten
                minutes.
              </p>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.button
            type="button"
            onClick={scrollToForm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.8 }}
            className="pbm-link mt-20 inline-flex text-ink sm:mt-28 lg:mt-36"
          >
            Begin Application <span aria-hidden>↓</span>
          </motion.button>
        </div>
      </section>

      {/* ─── Form ─── */}
      <div ref={formRef} className="bg-paper">
        <ApplicationForm />
      </div>
    </main>
  )
}
