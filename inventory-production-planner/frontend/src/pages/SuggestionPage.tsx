import React from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchSuggestion } from '../store/productionSlice'

function money(v:number){
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v)
}

export default function SuggestionPage(){
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector(s=>s.production)

  return (
    <div className="card">
      <h1>Production Suggestion</h1>
      <p className="small">
        Calculates which products can be produced from current raw material stock, prioritizing higher price first.
        It does not change database stock values; it simulates consumption in memory.
      </p>

      <button className="primary" onClick={()=>dispatch(fetchSuggestion())} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate'}
      </button>

      {error ? <p className="small" style={{color:'#ffb3c1'}}>Error: {error}</p> : null}

      <div style={{marginTop:16, overflowX:'auto'}}>
        <table>
          <thead>
            <tr>
              <th>Product</th><th>Unit Price</th><th>Quantity</th><th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map(it=>(
              <tr key={it.productId}>
                <td>{it.productCode} — {it.productName}</td>
                <td>{money(it.unitPrice)}</td>
                <td>{it.quantity}</td>
                <td>{money(it.subtotal)}</td>
              </tr>
            ))}
            {data && data.items.length===0 ? (
              <tr><td colSpan={4} className="small">No products can be produced with current stock.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {data ? (
        <div style={{marginTop:16}}>
          <strong>Total revenue: {money(data.totalRevenue)}</strong>
        </div>
      ) : null}
    </div>
  )
}
