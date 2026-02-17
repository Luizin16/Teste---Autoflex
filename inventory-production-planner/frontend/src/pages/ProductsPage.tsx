import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createProduct, deleteProduct, fetchProducts, updateProduct, Product } from '../store/productsSlice'
import { fetchRawMaterials } from '../store/rawMaterialsSlice'
import { addBomItem, deleteBomItem, fetchBom, updateBomItem, BomItem, clearBom } from '../store/bomSlice'

function money(v:number){
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v)
}

export default function ProductsPage(){
  const dispatch = useAppDispatch()
  const { items: products, loading } = useAppSelector(s=>s.products)
  const rawMaterials = useAppSelector(s=>s.rawMaterials.items)
  const bomState = useAppSelector(s=>s.bom)

  const [form, setForm] = useState({ id: 0, code:'', name:'', price:0 })
  const [selected, setSelected] = useState<Product | null>(null)

  const [bomForm, setBomForm] = useState({ rawMaterialId: 0, requiredQuantity: 1 })

  useEffect(()=>{
    dispatch(fetchProducts())
    dispatch(fetchRawMaterials())
  },[dispatch])

  useEffect(()=>{
    if(selected){
      dispatch(fetchBom(selected.id))
    } else {
      dispatch(clearBom())
    }
  },[dispatch, selected])

  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    if(form.id){
      await dispatch(updateProduct(form)).unwrap()
    } else {
      await dispatch(createProduct({ code: form.code, name: form.name, price: Number(form.price) })).unwrap()
    }
    setForm({ id:0, code:'', name:'', price:0 })
    dispatch(fetchProducts())
  }

  const onEdit = (p:Product) => {
    setForm({ id:p.id, code:p.code, name:p.name, price:p.price })
  }

  const onDelete = async (id:number) => {
    if(!confirm('Delete this product?')) return
    await dispatch(deleteProduct(id)).unwrap()
    if(selected?.id === id) setSelected(null)
  }

  const bomItems = bomState.items

  const addBom = async (e:React.FormEvent) => {
    e.preventDefault()
    if(!selected) return
    await dispatch(addBomItem({ productId: selected.id, rawMaterialId: Number(bomForm.rawMaterialId), requiredQuantity: Number(bomForm.requiredQuantity) })).unwrap()
    dispatch(fetchBom(selected.id))
  }

  const rmOptions = useMemo(()=> rawMaterials, [rawMaterials])

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <h1>Products</h1>

          <form onSubmit={onSubmit} className="row">
            <div className="col">
              <label className="small">Code</label>
              <input value={form.code} onChange={e=>setForm(f=>({...f, code:e.target.value}))} required />
            </div>
            <div className="col">
              <label className="small">Name</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />
            </div>
            <div className="col">
              <label className="small">Price</label>
              <input type="number" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f, price:Number(e.target.value)}))} required />
            </div>
            <div className="col" style={{display:'flex', alignItems:'end', gap:10}}>
              <button className="primary" type="submit">{form.id ? 'Update' : 'Create'}</button>
              {form.id ? <button type="button" onClick={()=>setForm({id:0,code:'',name:'',price:0})}>Cancel</button> : null}
            </div>
          </form>

          <div style={{marginTop:16, overflowX:'auto'}}>
            <table>
              <thead>
                <tr>
                  <th>Code</th><th>Name</th><th>Price</th><th></th>
                </tr>
              </thead>
              <tbody>
                {products.map(p=>(
                  <tr key={p.id}>
                    <td>{p.code}</td>
                    <td>
                      <button className="badge" style={{marginRight:8}} onClick={()=>setSelected(p)}>
                        {selected?.id===p.id ? 'Selected' : 'Select'}
                      </button>
                      {p.name}
                    </td>
                    <td>{money(p.price)}</td>
                    <td style={{display:'flex', gap:8}}>
                      <button onClick={()=>onEdit(p)}>Edit</button>
                      <button className="danger" onClick={()=>onDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {products.length===0 && !loading ? (
                  <tr><td colSpan={4} className="small">No products yet.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <div className="col">
        <div className="card">
          <h2>Bill of Materials (BOM)</h2>
          {!selected ? (
            <p className="small">Select a product to manage its BOM.</p>
          ) : (
            <>
              <p className="small">Product: <strong>{selected.code}</strong> — {selected.name}</p>

              <form onSubmit={addBom} className="row">
                <div className="col">
                  <label className="small">Raw Material</label>
                  <select
                    value={bomForm.rawMaterialId}
                    onChange={e=>setBomForm(f=>({...f, rawMaterialId:Number(e.target.value)}))}
                    style={{width:'100%', padding:10, borderRadius:10, border:'1px solid #262a35', background:'#0b0c10', color:'#e9eef6'}}
                    required
                  >
                    <option value={0} disabled>Select...</option>
                    {rmOptions.map(rm=>(
                      <option key={rm.id} value={rm.id}>{rm.code} — {rm.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <label className="small">Required Quantity</label>
                  <input type="number" min={1} value={bomForm.requiredQuantity}
                    onChange={e=>setBomForm(f=>({...f, requiredQuantity:Number(e.target.value)}))} required />
                </div>
                <div className="col" style={{display:'flex', alignItems:'end'}}>
                  <button className="primary" type="submit">Add</button>
                </div>
              </form>

              <div style={{marginTop:16, overflowX:'auto'}}>
                <table>
                  <thead>
                    <tr>
                      <th>Raw Material</th>
                      <th>Required</th>
                      <th>In Stock</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomItems.map(item=>(
                      <BomRow key={item.id} item={item} productId={selected.id} />
                    ))}
                    {bomItems.length===0 ? (
                      <tr><td colSpan={4} className="small">No BOM items for this product yet.</td></tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function BomRow({ item, productId }:{ item:BomItem; productId:number }){
  const dispatch = useAppDispatch()
  const [editQty, setEditQty] = useState<number>(item.requiredQuantity)

  const save = async () => {
    await dispatch(updateBomItem({ productId, bomItemId: item.id, rawMaterialId: item.rawMaterial.id, requiredQuantity: Number(editQty) })).unwrap()
    dispatch(fetchBom(productId))
  }

  const remove = async () => {
    if(!confirm('Remove this BOM item?')) return
    await dispatch(deleteBomItem({ productId, bomItemId: item.id })).unwrap()
    dispatch(fetchBom(productId))
  }

  return (
    <tr>
      <td>{item.rawMaterial.code} — {item.rawMaterial.name}</td>
      <td style={{minWidth:160}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input style={{maxWidth:120}} type="number" min={1} value={editQty} onChange={e=>setEditQty(Number(e.target.value))} />
          <button onClick={save}>Save</button>
        </div>
      </td>
      <td>{item.rawMaterial.stockQuantity}</td>
      <td><button className="danger" onClick={remove}>Remove</button></td>
    </tr>
  )
}
