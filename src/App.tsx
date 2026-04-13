import { Routes, Route } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import Home from "@/pages/Home"
import StyleGuide from "@/pages/StyleGuide"
import ModelsList from "@/pages/ModelsList"
import ModelDetail from "@/pages/ModelDetail"
import Events from "@/pages/Events"
import EventDetail from "@/pages/EventDetail"
import About from "@/pages/About"
import BecomeAModel from "@/pages/BecomeAModel"
import Contact from "@/pages/Contact"
import NotFound from "@/pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="style-guide" element={<StyleGuide />} />
        <Route path="models" element={<ModelsList />} />
        <Route path="models/female" element={<ModelsList />} />
        <Route path="models/male" element={<ModelsList />} />
        <Route path="models/:slug" element={<ModelDetail />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:slug" element={<EventDetail />} />
        <Route path="about" element={<About />} />
        <Route path="become-a-model" element={<BecomeAModel />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
