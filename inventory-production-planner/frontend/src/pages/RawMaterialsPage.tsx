import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createRawMaterial, deleteRawMaterial, fetchRawMaterials, updateRawMaterial, RawMaterial } from '../store/rawMaterialsSlice'

export default function RawMaterialsPage(){
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector(s=>s.rawMaterials)
  const [form, setForm] = useState({ id:0, code:'', name:'', stockQuantity:0 })

  useEffect(()=>{ dispatch(fetchRawMaterials()) },[dispatch])

  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    if(form.id){
      await dispatch(updateRawMaterial(form)).unwrap()
    } else {
      await dispatch(createRawMaterial({ code:form.code, name:form.name, stockQuantity:Number(form.stockQuantity) })).unwrap()
    }
    setForm({ id:0, code:'', name:'', stockQuantity:0 })
    dispatch(fetchRawMaterials())
  }

  const onEdit = (rm:RawMaterial) => setForm({ id:rm.id, code:rm.code, name:rm.name, stockQuantity:rm.stockQuantity })

  const onDelete = async (id:number) => {
    if(!confirm('Delete this raw material?')) return
    await dispatch(deleteRawMaterial(id)).unwrap()
  }

  return (
    <div className="card">
      <h1>Raw Materials</h1>

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
          <label className="small">Stock Quantity</label>
          <input type="number" min={0} value={form.stockQuantity} onChange={e=>setForm(f=>({...f, stockQuantity:Number(e.target.value)}))} required />
        </div>
        <div className="col" style={{display:'flex', alignItems:'end', gap:10}}>
          <button className="primary" type="submit">{form.id ? 'Update' : 'Create'}</button>
          {form.id ? <button type="button" onClick={()=>setForm({id:0,code:'',name:'',stockQuantity:0})}>Cancel</button> : null}
        </div>
      </form>

      <div style={{marginTop:16, overflowX:'auto'}}>
        <table>
          <thead>
            <tr><th>Code</th><th>Name</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(rm=>(
              <tr key={rm.id}>
                <td>{rm.code}</td>
                <td>{rm.name}</td>
                <td>{rm.stockQuantity}</td>
                <td style={{display:'flex', gap:8}}>
                  <button onClick={()=>onEdit(rm)}>Edit</button>
                  <button className="danger" onClick={()=>onDelete(rm.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length===0 && !loading ? <tr><td colSpan={4} className="small">No raw materials yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
