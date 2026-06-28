import { Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import { HomePage } from "@/pages/HomePage"
import { BlogPage } from "@/pages/BlogPage"

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="blog" element={<BlogPage />} />
      </Route>
    </Routes>
  )
}

export default App