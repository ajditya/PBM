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

import RequireAuth from "@/components/admin/RequireAuth"
import AdminLayout from "@/components/admin/AdminLayout"
import AdminLogin from "@/pages/admin/AdminLogin"
import AdminResetPassword from "@/pages/admin/AdminResetPassword"
import AdminHome from "@/pages/admin/AdminHome"
import Inbox from "@/pages/admin/Inbox"
import ComingSoon from "@/pages/admin/ComingSoon"

export default function App() {
  return (
    <Routes>
      {/* Public site — unchanged, wrapped in the public Layout (Nav/Footer). */}
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

      {/* Admin — sibling tree, no public chrome. Login is unguarded; the rest
          sits behind RequireAuth and renders inside the admin shell. */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
      <Route path="/admin" element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="models" element={<ComingSoon section="Models" />} />
          <Route path="events" element={<ComingSoon section="Events" />} />
          <Route path="media" element={<ComingSoon section="Media" />} />
          <Route path="*" element={<ComingSoon section="Not found" />} />
        </Route>
      </Route>
    </Routes>
  )
}
