import { Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import { HomePage } from "@/pages/HomePage"
import { BlogPage } from "@/pages/BlogPage"
import { BlogPostPage } from "@/pages/BlogPostPage"

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/*" element={<BlogPostPage />} />
      </Route>
    </Routes>
  )
}

export default App