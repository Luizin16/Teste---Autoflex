import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Package, Boxes, BarChart3, Plus } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import ProductsPage from '@/pages/ProductsPage';
import RawMaterialsPage from '@/pages/RawMaterialsPage';
import ProductionAnalysisPage from '@/pages/ProductionAnalysisPage';
import '@/App.css';

function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="font-heading text-2xl font-black text-white uppercase tracking-tight">
            ForgeOS
          </h1>
          <p className="text-xs text-slate-400 mt-1">Production Management</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/production-analysis"
            data-testid="nav-production-analysis"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-sm transition-all ${
                isActive
                  ? 'bg-slate-800 text-white border-r-2 border-amber-500'
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`
            }
          >
            <BarChart3 size={18} strokeWidth={1.5} />
            <span className="text-sm font-medium">Production Analysis</span>
          </NavLink>
          
          <NavLink
            to="/products"
            data-testid="nav-products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-sm transition-all ${
                isActive
                  ? 'bg-slate-800 text-white border-r-2 border-amber-500'
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`
            }
          >
            <Package size={18} strokeWidth={1.5} />
            <span className="text-sm font-medium">Products</span>
          </NavLink>
          
          <NavLink
            to="/raw-materials"
            data-testid="nav-raw-materials"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-sm transition-all ${
                isActive
                  ? 'bg-slate-800 text-white border-r-2 border-amber-500'
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`
            }
          >
            <Boxes size={18} strokeWidth={1.5} />
            <span className="text-sm font-medium">Raw Materials</span>
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <p>Industrial Management System</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/production-analysis" replace />} />
            <Route path="/production-analysis" element={<ProductionAnalysisPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/raw-materials" element={<RawMaterialsPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
