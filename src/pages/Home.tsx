import HomeHero from "@/components/sections/HomeHero"
import HomeAbout from "@/components/sections/HomeAbout"
import HomeModelsTeaser from "@/components/sections/HomeModelsTeaser"
import HomeAssociatesTeaser from "@/components/sections/HomeAssociatesTeaser"
import HomeClientsMarquee from "@/components/sections/HomeClientsMarquee"
import HomeEventsScroll from "@/components/sections/HomeEventsScroll"

export default function Home() {
  return (
    <main>
      <HomeHero />
      <HomeAbout />
      <HomeModelsTeaser />
      <HomeAssociatesTeaser />
      <HomeClientsMarquee />
      <HomeEventsScroll />
    </main>
  )
}
