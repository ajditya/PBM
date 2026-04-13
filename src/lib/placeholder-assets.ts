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
  /** Pexels stock — runway / fashion catwalk loop. Update when real footage arrives.
   *  Note: pexels.com video-files endpoint is hotlink-protected; the <video> tag
   *  will fall back to the poster image if blocked, which is the intended behaviour
   *  during the placeholder phase. */
  src: "https://videos.pexels.com/video-files/4715117/4715117-hd_1920_1080_25fps.mp4",
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

/* ───────── Female model portraits (women board) ───────── */
export const femaleModels = [
  { slug: "ananya-v", name: "Ananya V.", img: u("photo-1488161628813-04466f872be2", 1200, 1500) },
  { slug: "ishani-d", name: "Ishani D.", img: u("photo-1494790108377-be9c29b29330", 1200, 1500) },
  { slug: "meher-r", name: "Meher R.", img: u("photo-1485875437342-9b39470b3d95", 1200, 1500) },
  { slug: "priya-k", name: "Priya K.", img: u("photo-1509631179647-0177331693ae", 1200, 1500) },
  { slug: "zara-shah", name: "Zara Shah", img: u("photo-1521577352947-9bb58764b69a", 1200, 1500) },
  { slug: "elena-gupta", name: "Elena Gupta", img: u("photo-1531746020798-e6953c6e8e04", 1200, 1500) },
  { slug: "aisha-khanna", name: "Aisha Khanna", img: u("photo-1573496359142-b8d87734a5a2", 1200, 1500) },
  { slug: "neha-r", name: "Neha R.", img: u("photo-1487412720507-e7ab37603c6f", 1200, 1500) },
  { slug: "isha-mehra", name: "Isha Mehra", img: u("photo-1554151228-14d9def656e4", 1200, 1500) },
  { slug: "tara-singh", name: "Tara Singh", img: u("photo-1541823709867-1b206113eafd", 1200, 1500) },
  { slug: "maya-iyer", name: "Maya Iyer", img: u("photo-1502823403499-6ccfcf4fb453", 1200, 1500) },
  { slug: "kavya-n", name: "Kavya N.", img: u("photo-1496359867436-cf7c87fbcd57", 1200, 1500) },
] as const

/* ───────── Male model portraits (men board) ───────── */
export const maleModels = [
  { slug: "arjun-k", name: "Arjun K.", img: u("photo-1531123897727-8f129e1688ce", 1200, 1500) },
  { slug: "rohan-s", name: "Rohan S.", img: u("photo-1500648767791-00dcc994a43e", 1200, 1500) },
  { slug: "vikram-m", name: "Vikram M.", img: u("photo-1521572163474-6864f9cf17ab", 1200, 1500) },
  { slug: "aditya-r", name: "Aditya R.", img: u("photo-1492562080023-ab3db95bfbce", 1200, 1500) },
  { slug: "kabir-d", name: "Kabir D.", img: u("photo-1539571696357-5a69c17a67c6", 1200, 1500) },
  { slug: "rishi-p", name: "Rishi P.", img: u("photo-1506794778202-cad84cf45f1d", 1200, 1500) },
  { slug: "yash-v", name: "Yash V.", img: u("photo-1504593811423-6dd665756598", 1200, 1500) },
  { slug: "kunal-t", name: "Kunal T.", img: u("photo-1463453091185-61582044d556", 1200, 1500) },
  { slug: "dev-malhotra", name: "Dev Malhotra", img: u("photo-1502823403499-6ccfcf4fb453", 1200, 1500) },
  { slug: "samar-i", name: "Samar I.", img: u("photo-1463453091185-61582044d556", 1200, 1500) },
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

/* ───────── Founder portrait (Prasad Bidapa placeholder — B&W feel) ───────── */
export const founderPortrait = u("photo-1507003211169-0a1dd7228f2d", 1200, 1600)

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
