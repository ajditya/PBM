/**
 * Curated placeholder assets for the UI build.
 *
 * All hotlinks. Real photography swaps in here later — keep this file as the
 * single source of truth so swaps are centralized.
 *
 * Photo URLs use Unsplash's image CDN with a query string for size and quality.
 * Base form: https://images.unsplash.com/photo-{id}?w=1600&q=80&auto=format&fit=crop
 */

const u = (id: string, w = 1600, h?: number) =>
  `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ""}&q=80&auto=format&fit=crop`

/* ───────── Hero video ───────── */
export const heroVideo = {
  /** Self-hosted Mega Model Hunt rampwalk footage. */
  src: "/videos/hero-rampwalk.mp4",
  poster:
    "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=2000",
}

/* ───────── Runway / wide editorial shots ───────── */
export const runwayShots = [
  u("photo-1490481651871-ab68de25d43d"),
  u("photo-1469334031218-e382a71b716b"),
  u("photo-1558769132-cb1aea458c5e"),
  u("photo-1496747611176-843222e1e57c"),
  u("photo-1542295669297-4d352b042bca"),
  u("photo-1581338834647-b0fb40704e21"),
]

export type Board = "Mainboard" | "New Faces" | "Development" | "Digital"

export interface ModelStats {
  height: string
  bust: string
  waist: string
  hips: string
  hair: string
  eyes: string
  shoes: string
  location: string
  board: Board
}

export interface Model {
  slug: string
  name: string
  img: string
  stats: ModelStats
  /** Optional real-photo gallery. When present, the Model Detail page
   * renders these instead of falling back to the shared editorial pool. */
  gallery?: readonly string[]
}

/** Build an array of `/images/models/{slug}/{1..n}.png` paths. */
const localGallery = (slug: string, count: number): readonly string[] =>
  Array.from({ length: count }, (_, i) => `/images/models/${slug}/${i + 1}.png`)

const wStats = (
  height: number,
  bust: number,
  waist: number,
  hips: number,
  hair: string,
  eyes: string,
  shoes: number,
  location: string,
  board: Board,
): ModelStats => ({
  height: `${height} cm`,
  bust: `${bust}`,
  waist: `${waist}`,
  hips: `${hips}`,
  hair,
  eyes,
  shoes: `${shoes}`,
  location,
  board,
})

const mStats = (
  height: number,
  chest: number,
  waist: number,
  hips: number,
  hair: string,
  eyes: string,
  shoes: number,
  location: string,
  board: Board,
): ModelStats => ({
  height: `${height} cm`,
  bust: `${chest}`,
  waist: `${waist}`,
  hips: `${hips}`,
  hair,
  eyes,
  shoes: `${shoes}`,
  location,
  board,
})

/* ───────── Female model portraits (women board) ─────────
 * Real photos for the on-roster talents we have shoots for; the
 * remaining cards still use verified Unsplash editorial slugs. */
export const femaleModels: readonly Model[] = [
  {
    slug: "amber",
    name: "Amber",
    img: "/images/models/amber/1.png",
    gallery: localGallery("amber", 17),
    stats: wStats(176, 82, 60, 88, "Black", "Brown", 38, "Bengaluru", "Mainboard"),
  },
  { slug: "ananya-v", name: "Ananya V.", img: u("photo-1574015974293-817f0ebebb74", 1200, 1500), stats: wStats(178, 84, 60, 89, "Black", "Brown", 39, "Bengaluru", "Mainboard") },
  { slug: "ishani-d", name: "Ishani D.", img: u("photo-1580478491436-fd6a937acc9e", 1200, 1500), stats: wStats(176, 82, 59, 88, "Brown", "Hazel", 38, "Mumbai", "Mainboard") },
  { slug: "meher-r", name: "Meher R.", img: u("photo-1538329972958-465d6d2144ed", 1200, 1500), stats: wStats(180, 83, 61, 90, "Dark Brown", "Brown", 40, "Delhi", "Mainboard") },
  { slug: "priya-k", name: "Priya K.", img: u("photo-1645561305502-63a9ba09ab09", 1200, 1500), stats: wStats(179, 84, 60, 89, "Black", "Brown", 39, "Bengaluru", "Mainboard") },
  { slug: "zara-shah", name: "Zara Shah", img: u("photo-1613915617430-8ab0fd7c6baf", 1200, 1500), stats: wStats(177, 81, 58, 87, "Black", "Green", 38, "Mumbai", "Mainboard") },
  { slug: "elena-gupta", name: "Elena Gupta", img: u("photo-1524504388940-b1c1722653e1", 1200, 1500), stats: wStats(174, 82, 60, 88, "Blonde", "Blue", 38, "Goa", "New Faces") },
  { slug: "aisha-khanna", name: "Aisha Khanna", img: u("photo-1562572159-4efc207f5aff", 1200, 1500), stats: wStats(178, 84, 60, 89, "Black", "Brown", 39, "Bengaluru", "Mainboard") },
  { slug: "neha-r", name: "Neha R.", img: u("photo-1531746020798-e6953c6e8e04", 1200, 1500), stats: wStats(173, 80, 58, 86, "Brown", "Brown", 37, "Pune", "New Faces") },
  { slug: "isha-mehra", name: "Isha Mehra", img: u("photo-1526510747491-58f928ec870f", 1200, 1500), stats: wStats(175, 82, 59, 87, "Auburn", "Green", 38, "Delhi", "Development") },
  { slug: "tara-singh", name: "Tara Singh", img: u("photo-1564485377539-4af72d1f6a2f", 1200, 1500), stats: wStats(180, 84, 61, 90, "Brown", "Brown", 40, "Chandigarh", "Mainboard") },
  { slug: "maya-iyer", name: "Maya Iyer", img: u("photo-1529626455594-4ff0802cfb7e", 1200, 1500), stats: wStats(176, 82, 60, 88, "Black", "Brown", 38, "Chennai", "Development") },
  { slug: "kavya-n", name: "Kavya N.", img: u("photo-1541519481457-763224276691", 1200, 1500), stats: wStats(175, 81, 59, 87, "Black", "Brown", 38, "Hyderabad", "Digital") },
]

/* ───────── Male model portraits (men board) ─────────
 * Real photos for talents we have shoots for; rest use verified
 * Unsplash editorial slugs. */
export const maleModels: readonly Model[] = [
  {
    slug: "rana",
    name: "Rana",
    img: "/images/models/rana/1.png",
    gallery: localGallery("rana", 9),
    stats: mStats(186, 98, 78, 93, "Black", "Brown", 43, "Mumbai", "Mainboard"),
  },
  { slug: "arjun-k", name: "Arjun K.", img: u("photo-1625698457101-fec2f565a8f0", 1200, 1500), stats: mStats(187, 99, 78, 94, "Black", "Brown", 43, "Bengaluru", "Mainboard") },
  { slug: "rohan-s", name: "Rohan S.", img: u("photo-1519058082700-08a0b56da9b4", 1200, 1500), stats: mStats(189, 101, 80, 96, "Brown", "Hazel", 44, "Mumbai", "Mainboard") },
  { slug: "vikram-m", name: "Vikram M.", img: u("photo-1531891570158-e71b35a485bc", 1200, 1500), stats: mStats(186, 98, 78, 93, "Black", "Brown", 43, "Delhi", "Mainboard") },
  { slug: "aditya-r", name: "Aditya R.", img: u("photo-1534030347209-467a5b0ad3e6", 1200, 1500), stats: mStats(188, 100, 79, 95, "Dark Brown", "Brown", 43, "Pune", "Mainboard") },
  { slug: "kabir-d", name: "Kabir D.", img: u("photo-1453396450673-3fe83d2db2c4", 1200, 1500), stats: mStats(185, 97, 77, 92, "Black", "Brown", 42, "Bengaluru", "Mainboard") },
  { slug: "rishi-p", name: "Rishi P.", img: u("photo-1475403614135-5f1aa0eb5015", 1200, 1500), stats: mStats(190, 101, 80, 96, "Brown", "Green", 44, "Goa", "New Faces") },
  { slug: "yash-v", name: "Yash V.", img: u("photo-1480429370139-e0132c086e2a", 1200, 1500), stats: mStats(184, 96, 76, 91, "Brown", "Brown", 42, "Chennai", "New Faces") },
  { slug: "kunal-t", name: "Kunal T.", img: u("photo-1513956589380-bad6acb9b9d4", 1200, 1500), stats: mStats(186, 98, 78, 93, "Black", "Brown", 43, "Hyderabad", "Development") },
  { slug: "dev-malhotra", name: "Dev Malhotra", img: u("photo-1679217125041-6f81624038d4", 1200, 1500), stats: mStats(188, 99, 79, 94, "Black", "Brown", 43, "Mumbai", "Development") },
  { slug: "samar-i", name: "Samar I.", img: u("photo-1603189343302-e603f7add05a", 1200, 1500), stats: mStats(185, 97, 77, 92, "Black", "Brown", 42, "Kolkata", "Digital") },
]

/* ───────── Lookup helper used by the Model Detail page ───────── */
export function findModelBySlug(
  slug: string,
): { model: Model; gender: "Women" | "Men" } | null {
  const fem = femaleModels.find((m) => m.slug === slug)
  if (fem) return { model: fem, gender: "Women" }
  const mal = maleModels.find((m) => m.slug === slug)
  if (mal) return { model: mal, gender: "Men" }
  return null
}

/* ───────── Editorial gallery pool (used by Model Detail) ─────────
 * Verified portrait IDs only — no runway/object shots. The detail
 * page cycles through this pool to fill its asymmetric layout. */
export const modelGalleryPool = [
  u("photo-1574015974293-817f0ebebb74", 1800),
  u("photo-1580478491436-fd6a937acc9e", 1800),
  u("photo-1538329972958-465d6d2144ed", 1800),
  u("photo-1645561305502-63a9ba09ab09", 1800),
  u("photo-1613915617430-8ab0fd7c6baf", 1800),
  u("photo-1524504388940-b1c1722653e1", 1800),
  u("photo-1562572159-4efc207f5aff", 1800),
  u("photo-1531746020798-e6953c6e8e04", 1800),
  u("photo-1526510747491-58f928ec870f", 1800),
  u("photo-1564485377539-4af72d1f6a2f", 1800),
  u("photo-1529626455594-4ff0802cfb7e", 1800),
  u("photo-1541519481457-763224276691", 1800),
] as const

/* ───────── General editorial pool (used in folds, dropdowns, collages) ───────── */
export const editorial = [
  u("photo-1515886657613-9f3515b0c78f", 1600),
  u("photo-1483985988355-763728e1935b", 1600),
  u("photo-1469334031218-e382a71b716b", 1600),
  u("photo-1496747611176-843222e1e57c", 1600),
  u("photo-1539109136881-3be0616acf4b", 1600),
  u("photo-1525507119028-ed4c629a60a3", 1600),
  u("photo-1571513722275-4b41940f54b8", 1600),
  u("photo-1521498542256-5aeb47ba2b36", 1600),
]

/* ───────── Founder portrait — real photo of Prasad Bidapa ───────── */
export const founderPortrait = "/images/founder/prasad-01.jpg"

/* ───────── Events ───────── */
export const events = [
  {
    slug: "mega-model-hunt-2026",
    title: "Mega Model Hunt 2026",
    date: "15 · 03 · 2026",
    city: "Bengaluru",
    type: "flagship" as const,
    cover: u("photo-1469334031218-e382a71b716b", 1600, 2000),
  },
  {
    slug: "india-mens-fashion-week",
    title: "India Men's Fashion Week",
    date: "22 · 04 · 2026",
    city: "Mumbai",
    type: "upcoming" as const,
    cover: u("photo-1539109136881-3be0616acf4b", 1600, 2000),
  },
  {
    slug: "colombo-fashion-week",
    title: "Colombo Fashion Week",
    date: "10 · 05 · 2026",
    city: "Colombo",
    type: "upcoming" as const,
    cover: u("photo-1496747611176-843222e1e57c", 1600, 2000),
  },
  {
    slug: "rajasthan-heritage-week",
    title: "Rajasthan Heritage Week",
    date: "18 · 11 · 2025",
    city: "Jaipur",
    type: "past" as const,
    cover: u("photo-1581338834647-b0fb40704e21", 1600, 2000),
  },
  {
    slug: "luxo-luxury-weeks",
    title: "LUXO Luxury Weeks",
    date: "02 · 12 · 2025",
    city: "Delhi",
    type: "past" as const,
    cover: u("photo-1542295669297-4d352b042bca", 1600, 2000),
  },
  {
    slug: "kingfisher-fashion-awards",
    title: "Kingfisher Fashion Awards",
    date: "20 · 09 · 2025",
    city: "Mumbai",
    type: "recurring" as const,
    cover: u("photo-1490481651871-ab68de25d43d", 1600, 2000),
  },
] as const

/* ───────── Brand logos (real, self-hosted) ───────── */
export const brandLogos = {
  associates: "/images/logos/pb-associates.png",
  models: "/images/logos/pb-models.png",
} as const

/* ───────── Client logos (text wordmarks — no real brand logos) ───────── */
export const clientLogos = [
  "Sabyasachi",
  "Manish Malhotra",
  "Tarun Tahiliani",
  "Ritu Kumar",
  "Anita Dongre",
  "Raghavendra Rathore",
  "Rohit Bal",
  "Falguni Shane Peacock",
  "Gauri & Nainika",
  "Rahul Mishra",
] as const

/* ───────── Press logos (for E1) ───────── */
export const pressLogos = ["Vogue", "Elle", "GQ", "Harper's Bazaar", "Femina"] as const

/* ───────── Past discoveries (for E1 — supermodels Prasad has discovered) ───────── */
export const pastDiscoveries = [
  { name: "Deepika Padukone", img: u("photo-1488161628813-04466f872be2", 800, 1000) },
  { name: "Anushka Sharma", img: u("photo-1494790108377-be9c29b29330", 800, 1000) },
  { name: "Lara Dutta", img: u("photo-1521577352947-9bb58764b69a", 800, 1000) },
] as const

/* ───────── Properties / IPs (used on About Section 4) ─────────
 * Mirrors the events list but adds the editorial taglines + year
 * established that the About-page card spec needs. */
export const properties = [
  {
    slug: "mega-model-hunt",
    title: "Mega Model Hunt",
    tagline: "India's longest-running supermodel discovery platform.",
    year: "EST. 2002",
    cover: u("photo-1469334031218-e382a71b716b", 1200, 1500),
  },
  {
    slug: "india-mens-fashion-week",
    title: "India Men's Fashion Week",
    tagline: "The country's first dedicated menswear runway.",
    year: "EST. 2009",
    cover: u("photo-1539109136881-3be0616acf4b", 1200, 1500),
  },
  {
    slug: "colombo-fashion-week",
    title: "Colombo Fashion Week",
    tagline: "South Asia's regional fashion summit.",
    year: "EST. 2003",
    cover: u("photo-1496747611176-843222e1e57c", 1200, 1500),
  },
  {
    slug: "rajasthan-heritage-week",
    title: "Rajasthan Heritage Week",
    tagline: "A celebration of artisanal craft and royal textile.",
    year: "EST. 2014",
    cover: u("photo-1581338834647-b0fb40704e21", 1200, 1500),
  },
  {
    slug: "luxo-luxury-weeks",
    title: "LUXO Luxury Weeks",
    tagline: "A curated luxury runway across India's metros.",
    year: "EST. 2017",
    cover: u("photo-1542295669297-4d352b042bca", 1200, 1500),
  },
  {
    slug: "kingfisher-fashion-awards",
    title: "Kingfisher Fashion Awards",
    tagline: "Honouring two decades of Indian fashion excellence.",
    year: "EST. 2003",
    cover: u("photo-1490481651871-ab68de25d43d", 1200, 1500),
  },
] as const

/* ───────── Team members (used on About — The Team) ─────────
 * The real core team. Bios are final copy. Founder uses the real
 * portrait; Rana reuses his on-roster shoot; Arry is a placeholder
 * editorial portrait until a real headshot is supplied. */
export interface TeamMember {
  name: string
  /** Role / credential line shown under the name. */
  role: string
  /** Editorial bio paragraph. */
  bio: string
  img: string
}

export const teamMembers: readonly TeamMember[] = [
  {
    name: "Prasad Bidapa",
    role: "Founder",
    bio: "A pioneering force in Indian fashion, Prasad Bidapa has spent decades shaping the country's style landscape through runway direction, talent discovery, and fashion entrepreneurship. Widely regarded as one of the architects of modern fashion presentation in India, he has played a defining role in elevating fashion shows into world-class experiences that blend creativity, discipline, and commercial relevance. His influence spans fashion weeks, luxury showcases, pageants, talent platforms, and model development. Through his vision, mentorship, and commitment to excellence, he has helped launch countless careers while continuing to inspire generations of talent and industry leaders.",
    img: founderPortrait,
  },
  {
    name: "Arry Dabas",
    role: "Mr India 2012 · Choreography, Business & Creative Direction",
    bio: "Mr India 2012 Arry Dabas, is a multifaceted industry professional who brings together business acumen, creative direction, and fashion expertise. A respected choreographer, he has conceptualised and executed several top-tier fashion shows, luxury showcases, and large-scale productions across the industry. With extensive experience in talent management, brand collaborations, and event execution, he plays a key role in creating impactful partnerships and expanding new business opportunities. His modern outlook and hands-on leadership make him an important force in contemporary fashion ventures.",
    img: u("photo-1507003211169-0a1dd7228f2d", 800, 1000),
  },
  {
    name: "Shamsher Singh Rana",
    role: "Talent · 15+ Years Modelling",
    bio: "With over 15 years of modelling experience, Shamsher Singh Rana has built a strong reputation across the fashion and media industry. His expertise lies in building platforms focused on print and digital mediums, creating relevant opportunities for emerging and established talent alike. Combining industry knowledge with a deep understanding of brand requirements, he has contributed to campaigns, talent initiatives, and media-driven projects that reflect the changing dynamics of modern fashion. His experience and strategic insight continue to add strength to talent-focused ventures.",
    img: "/images/models/rana/1.png",
  },
]

/* ───────── About-page services lists ───────── */
export const associatesServices = [
  "Fashion Week Production",
  "Talent Hunt Shows",
  "Brand Partnerships",
  "Government & Tourism",
  "Editorial Direction",
  "Heritage Programming",
] as const

export const modelsServices = [
  "Mainboard Bookings",
  "Editorial Castings",
  "Runway & Lookbook",
  "Brand Campaigns",
  "Development Roster",
  "Digital & Influencer",
] as const

/* ───────── About-page Associates / Models stacked photo trios ───────── */
export const aboutAssociatesPhotos = [
  u("photo-1469334031218-e382a71b716b", 1000, 1250),
  u("photo-1542295669297-4d352b042bca", 1000, 1250),
  u("photo-1581338834647-b0fb40704e21", 1000, 1250),
] as const

export const aboutModelsPhotos = [
  u("photo-1496747611176-843222e1e57c", 1000, 1250),
  u("photo-1490481651871-ab68de25d43d", 1000, 1250),
  u("photo-1539109136881-3be0616acf4b", 1000, 1250),
] as const
