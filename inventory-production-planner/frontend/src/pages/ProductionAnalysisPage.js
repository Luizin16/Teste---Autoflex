import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProductionAnalysisPage() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${API}/production-analysis`);
      setAnalysis(response.data);
    } catch (error) {
      toast.error('Failed to load production analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="p-12 text-center text-slate-500">Loading analysis...</div>
        </div>
      </div>
    );
  }

  if (!analysis || analysis.producible_products.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading text-4xl font-black tracking-tight uppercase text-slate-900 mb-8">
            Production Analysis
          </h1>
          <div className="bg-white border border-slate-200 rounded-sm p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
            <p className="text-slate-500 mb-2">No production capacity available</p>
            <p className="text-sm text-slate-400">
              Add products with recipes and raw materials with stock to see production analysis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = analysis.producible_products.map((item) => ({
    name: item.product.name,
    quantity: item.max_quantity,
    value: item.total_value,
  }));

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-black tracking-tight uppercase text-slate-900">
            Production Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Optimized production capacity based on current inventory
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-sm p-6" data-testid="summary-products-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Producible Products
              </span>
              <Package size={18} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {analysis.producible_products.length}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-sm p-6" data-testid="summary-units-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Total Units
              </span>
              <TrendingUp size={18} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {analysis.producible_products.reduce((sum, p) => sum + p.max_quantity, 0)}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-sm p-6" data-testid="summary-value-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Total Production Value
              </span>
              <DollarSign size={18} className="text-amber-600" strokeWidth={1.5} />
            </div>
            <div className="text-3xl font-black text-slate-900">
              ${analysis.total_production_value.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Production Chart */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 mb-8" data-testid="production-chart">
          <h2 className="font-heading text-2xl font-bold tracking-tight mb-6 border-b border-slate-100 pb-4">
            Production Capacity by Product
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '0.125rem',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="quantity" fill="#0F172A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Production Table */}
        <div className="bg-white border border-slate-200 rounded-sm mb-8">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              Production Details
            </h2>
          </div>
          <table className="w-full border-collapse text-sm" data-testid="production-details-table">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                  Product
                </th>
                <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                  Max Quantity
                </th>
                <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                  Unit Value
                </th>
                <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                  Total Value
                </th>
                <th className="text-left h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                  Materials Used
                </th>
              </tr>
            </thead>
            <tbody>
              {analysis.producible_products.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  data-testid={`production-row-${item.product.code}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{item.product.code}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-lg">
                    {item.max_quantity}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    ${item.product.value.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-amber-600">
                    ${item.total_value.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {item.materials_used.map((mat, i) => (
                        <div key={i} className="text-xs">
                          <span className="text-slate-600">{mat.material_name}:</span>
                          <span className="font-mono ml-1">
                            {mat.quantity_used.toFixed(2)} units
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remaining Stock */}
        <div className="bg-white border border-slate-200 rounded-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              Remaining Stock After Production
            </h2>
          </div>
          <table className="w-full border-collapse text-sm" data-testid="remaining-stock-table">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                  Material
                </th>
                <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                  Original Stock
                </th>
                <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                  Remaining Stock
                </th>
                <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody>
              {analysis.remaining_stock.map((item, idx) => {
                const utilized = item.original_quantity - item.remaining_quantity;
                const utilizationPct = item.original_quantity > 0
                  ? (utilized / item.original_quantity) * 100
                  : 0;
                return (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors h-12"
                    data-testid={`stock-row-${item.material_id}`}
                  >
                    <td className="px-4 py-2">
                      <div className="font-medium">{item.material_name}</div>
                      <div className="text-xs text-slate-500 font-mono">{item.material_id}</div>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {item.original_quantity.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {item.remaining_quantity.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <span
                        className={`inline-block px-2 py-1 rounded-sm text-xs font-bold ${
                          utilizationPct >= 80
                            ? 'bg-green-50 text-green-700'
                            : utilizationPct >= 50
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-50 text-slate-700'
                        }`}
                      >
                        {utilizationPct.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductionAnalysisPage;
