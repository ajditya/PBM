// Phase B1 — image optimization (no upload, no DB).
// Resizes masters to max 2000px long edge, WebP q80, into a work dir OUTSIDE
// the repo. PNG masters are never modified. Prints a before/after size report.
//
//   node scripts/optimize-phase-b1.mjs
//
import sharp from "sharp"
import { mkdir, writeFile, readFile, stat, rm } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"

const MASTERS = "C:/Users/Pc/Desktop/4AM Projects/PBM"
const WORK = "C:/Users/Pc/Desktop/4AM Projects/PBM/.migrate-work"

const MAX_EDGE = 2000
const QUALITY = 80

// slug -> { dir, count } ; cover = source "1.png"
const MODELS = {
  amber: { dir: path.join(MASTERS, "Amber"), count: 17 },
  rana: { dir: path.join(MASTERS, "Rana"), count: 9 },
}

// event cover source URLs (from placeholder-assets.ts events[])
const u = (id, w = 1600, h) =>
  `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ""}&q=80&auto=format&fit=crop`
const EVENTS = {
  "mega-model-hunt-2026": u("photo-1469334031218-e382a71b716b", 1600, 2000),
  "india-mens-fashion-week": u("photo-1539109136881-3be0616acf4b", 1600, 2000),
  "colombo-fashion-week": u("photo-1496747611176-843222e1e57c", 1600, 2000),
  "rajasthan-heritage-week": u("photo-1581338834647-b0fb40704e21", 1600, 2000),
  "luxo-luxury-weeks": u("photo-1542295669297-4d352b042bca", 1600, 2000),
  "kingfisher-fashion-awards": u("photo-1490481651871-ab68de25d43d", 1600, 2000),
}

const toWebp = (buf) =>
  sharp(buf)
    .rotate() // honor EXIF orientation
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer()

const kb = (n) => `${(n / 1024).toFixed(0)} KB`
const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`

async function emit(outPath, buf) {
  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, buf)
}

async function run() {
  if (existsSync(WORK)) await rm(WORK, { recursive: true, force: true })
  let srcTotal = 0
  let outTotal = 0
  const report = []

  // Models: cover (1.png) + gallery (1..n)
  for (const [slug, { dir, count }] of Object.entries(MODELS)) {
    let mSrc = 0
    let mOut = 0
    // cover from 1.png
    const coverBuf = await readFile(path.join(dir, "1.png"))
    const coverOut = await toWebp(coverBuf)
    await emit(path.join(WORK, "models", slug, "cover.webp"), coverOut)
    mSrc += (await stat(path.join(dir, "1.png"))).size
    mOut += coverOut.length
    // gallery 1..n
    for (let i = 1; i <= count; i++) {
      const srcPath = path.join(dir, `${i}.png`)
      const buf = await readFile(srcPath)
      const out = await toWebp(buf)
      await emit(path.join(WORK, "models", slug, "gallery", `${i}.webp`), out)
      mSrc += (await stat(srcPath)).size
      mOut += out.length
    }
    srcTotal += mSrc
    outTotal += mOut
    report.push({
      item: `model/${slug}`,
      files: count + 1,
      src: mb(mSrc),
      out: mb(mOut),
      ratio: `${((1 - mOut / mSrc) * 100).toFixed(1)}%`,
    })
  }

  // Events: download + optimize cover
  for (const [slug, url] of Object.entries(EVENTS)) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetch ${slug}: ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const out = await toWebp(buf)
    await emit(path.join(WORK, "events", slug, "cover.webp"), out)
    srcTotal += buf.length
    outTotal += out.length
    report.push({
      item: `event/${slug}`,
      files: 1,
      src: kb(buf.length),
      out: kb(out.length),
      ratio: `${((1 - out.length / buf.length) * 100).toFixed(1)}%`,
    })
  }

  console.log("\n=== Per-item ===")
  for (const r of report)
    console.log(`${r.item.padEnd(34)} ${String(r.files).padStart(3)} files   src ${r.src.padStart(9)} -> out ${r.out.padStart(9)}  (-${r.ratio})`)
  console.log("\n=== TOTAL ===")
  console.log(`source masters : ${mb(srcTotal)}`)
  console.log(`optimized webp : ${mb(outTotal)}`)
  console.log(`reduction      : ${((1 - outTotal / srcTotal) * 100).toFixed(1)}%`)
  console.log(`\noptimized files written to: ${WORK}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
