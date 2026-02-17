import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api'

export type RawMaterial = { id:number; code:string; name:string; stockQuantity:number }

type State = { items: RawMaterial[]; loading:boolean; error?:string }
const initialState: State = { items: [], loading:false }

export const fetchRawMaterials = createAsyncThunk('rawMaterials/fetch', async () => {
  const res = await api.get<RawMaterial[]>('/raw-materials')
  return res.data
})

export const createRawMaterial = createAsyncThunk('rawMaterials/create', async (payload:{code:string;name:string;stockQuantity:number}) => {
  const res = await api.post<RawMaterial>('/raw-materials', payload)
  return res.data
})

export const updateRawMaterial = createAsyncThunk('rawMaterials/update', async (payload:{id:number;code:string;name:string;stockQuantity:number}) => {
  const res = await api.put<RawMaterial>(`/raw-materials/${payload.id}`, payload)
  return res.data
})

export const deleteRawMaterial = createAsyncThunk('rawMaterials/delete', async (id:number) => {
  await api.delete(`/raw-materials/${id}`)
  return id
})

const slice = createSlice({
  name: 'rawMaterials',
  initialState,
  reducers: {},
  extraReducers(builder){
    builder
      .addCase(fetchRawMaterials.pending,(s)=>{s.loading=true;s.error=undefined})
      .addCase(fetchRawMaterials.fulfilled,(s,a)=>{s.loading=false;s.items=a.payload})
      .addCase(fetchRawMaterials.rejected,(s,a)=>{s.loading=false;s.error=a.error.message})
      .addCase(createRawMaterial.fulfilled,(s,a)=>{s.items.push(a.payload)})
      .addCase(updateRawMaterial.fulfilled,(s,a)=>{s.items=s.items.map(r=>r.id===a.payload.id?a.payload:r)})
      .addCase(deleteRawMaterial.fulfilled,(s,a)=>{s.items=s.items.filter(r=>r.id!==a.payload)})
  }
})

export default slice.reducer
