/**
 * Reusable placeholder for admin sections that aren't built yet. Each lives at
 * a real, guarded child route so routing + the protected shell are proven now.
 */
export default function ComingSoon({ section }: { section: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p className="pbm-eyebrow-mute mb-4">{section}</p>
      <h1 className="pbm-display-s">Coming soon</h1>
    </div>
  )
}
