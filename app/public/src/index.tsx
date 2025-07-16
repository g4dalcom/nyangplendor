import { Main } from "./pages/Main"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense } from "react"

const container = document.getElementById("root")
const root = createRoot(container!)

root.render(
  <Suspense fallback="loading">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  </Suspense>
)
