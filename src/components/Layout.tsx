import { Link } from "react-router-dom"

export default function Layout({ children }: any) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black text-white p-4 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/raw-materials">Raw Materials</Link>
        <Link to="/production">Production Plan</Link>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  )
}
