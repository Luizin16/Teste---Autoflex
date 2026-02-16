import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import ProductsPage from "./pages/ProductsPage"
import RawMaterialsPage from "./pages/RawMaterialsPage"
import ProductionPlan from "./pages/ProductionPlan"
import NotFound from "./pages/NotFound"
import Layout from "./components/Layout"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/raw-materials" element={<RawMaterialsPage />} />
          <Route path="/production" element={<ProductionPlan />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
