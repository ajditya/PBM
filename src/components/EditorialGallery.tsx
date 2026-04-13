import { useMemo, useState } from "react"
import { motion } from "framer-motion"

import Lightbox from "@/components/Lightbox"
import { modelGalleryPool } from "@/lib/placeholder-assets"
import { easeOutExpo } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
 * EditorialGallery — asymmetric portfolio layout for Screen 3.
 *
 * Adaptive: takes a `pool` of any size and lays it out in a
 * cycling block sequence:
 *
 *   hero (1)  →  two-up (2)  →  centered 60% (1)  →  three-up (3)
 *
 * Every photo in the pool gets exactly one slot — no repeats, no
 * gaps. Trailing remainders fall into the smallest block that fits
 * (1 → hero, 2 → two-up, 3 → three-up). 4px gutters. No section
 * title — the work speaks for itself.
 * ──────────────────────────────────────────────────────────── */

const GAP = "0.25rem" // 4px gutters

type BlockType = "hero" | "twoup" | "centered" | "threeup"

interface Block {
  type: BlockType
  images: string[]
}

const BLOCK_ORDER: readonly BlockType[] = [
  "hero",
  "twoup",
  "centered",
  "threeup",
]

const BLOCK_SIZE: Record<BlockType, number> = {
  hero: 1,
  twoup: 2,
  centered: 1,
  threeup: 3,
}

/** Lay out an arbitrary-sized pool into block groups. */
function buildLayout(pool: readonly string[]): Block[] {
  const blocks: Block[] = []
  let cursor = 0
  let i = 0

  while (cursor < pool.length) {
    const remaining = pool.length - cursor
    const next = BLOCK_ORDER[i % BLOCK_ORDER.length]
    const need = BLOCK_SIZE[next]

    if (remaining >= need) {
      blocks.push({ type: next, images: pool.slice(cursor, cursor + need) })
      cursor += need
      i++
    } else {
      // Trailing remainder — pick a block that exactly fits the leftovers.
      const fallback: BlockType =
        remaining === 3 ? "threeup" : remaining === 2 ? "twoup" : "hero"
      blocks.push({ type: fallback, images: pool.slice(cursor) })
      cursor = pool.length
    }
  }

  return blocks
}

interface TileProps {
  src: string
  alt?: string
  className?: string
  delay?: number
  onOpen?: () => void
}

function Tile({
  src,
  alt = "Editorial portrait",
  className = "",
  delay = 0,
  onOpen,
}: TileProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: easeOutExpo, delay }}
      className={`relative overflow-hidden bg-ink/5 ${className}`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 block h-full w-full cursor-zoom-in focus:outline-none"
        aria-label="View image"
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]"
        />
      </button>
    </motion.figure>
  )
}

interface BlockProps {
  block: Block
  startIndex: number
  onOpen: (i: number) => void
}

function HeroBlock({ block, startIndex, onOpen }: BlockProps) {
  return (
    <div className="flex justify-center">
      <Tile
        src={block.images[0]}
        className="aspect-[5/7] w-full sm:w-[55%] lg:w-[42%]"
        onOpen={() => onOpen(startIndex)}
      />
    </div>
  )
}

function TwoUpBlock({ block, startIndex, onOpen }: BlockProps) {
  return (
    <div
      className="mx-auto grid w-full max-w-[70%] grid-cols-1 sm:grid-cols-2"
      style={{ gap: GAP }}
    >
      {block.images.map((src, i) => (
        <Tile
          key={src + i}
          src={src}
          className="aspect-[5/7]"
          delay={i * 0.05}
          onOpen={() => onOpen(startIndex + i)}
        />
      ))}
    </div>
  )
}

function CenteredBlock({ block, startIndex, onOpen }: BlockProps) {
  return (
    <div className="flex justify-center">
      <Tile
        src={block.images[0]}
        className="aspect-[5/7] w-full sm:w-[45%] lg:w-[32%]"
        onOpen={() => onOpen(startIndex)}
      />
    </div>
  )
}

function ThreeUpBlock({ block, startIndex, onOpen }: BlockProps) {
  return (
    <div
      className="mx-auto grid w-full max-w-[85%] grid-cols-1 sm:grid-cols-3"
      style={{ gap: GAP }}
    >
      {block.images.map((src, i) => (
        <Tile
          key={src + i}
          src={src}
          className="aspect-[5/7]"
          delay={i * 0.05}
          onOpen={() => onOpen(startIndex + i)}
        />
      ))}
    </div>
  )
}

const RENDERERS: Record<BlockType, (b: BlockProps) => React.JSX.Element> = {
  hero: HeroBlock,
  twoup: TwoUpBlock,
  centered: CenteredBlock,
  threeup: ThreeUpBlock,
}

interface Props {
  /** Source images. Falls back to the shared editorial pool when omitted. */
  pool?: readonly string[]
}

export default function EditorialGallery({ pool }: Props) {
  const source = pool && pool.length > 0 ? pool : modelGalleryPool
  const layout = useMemo(() => buildLayout(source), [source])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Pre-compute starting flat indices per block for the lightbox
  const startIndices = useMemo(() => {
    const out: number[] = []
    let cursor = 0
    for (const b of layout) {
      out.push(cursor)
      cursor += b.images.length
    }
    return out
  }, [layout])

  return (
    <section
      aria-label="Editorial gallery"
      className="bg-paper py-24 sm:py-32 lg:py-40"
    >
      <div
        className="mx-auto flex w-full max-w-[1600px] flex-col px-6 sm:px-10 lg:px-14"
        style={{ gap: GAP }}
      >
        {layout.map((block, i) => {
          const Renderer = RENDERERS[block.type]
          return (
            <Renderer
              key={`${block.type}-${i}`}
              block={block}
              startIndex={startIndices[i]}
              onOpen={(idx) => setLightboxIndex(idx)}
            />
          )
        })}
      </div>

      <Lightbox
        open={lightboxIndex !== null}
        images={source}
        index={lightboxIndex ?? 0}
        onIndexChange={(i) => setLightboxIndex(i)}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  )
}
