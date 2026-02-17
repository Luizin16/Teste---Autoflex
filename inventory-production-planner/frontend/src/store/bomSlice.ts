import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api'

export type BomItem = {
  id:number
  requiredQuantity:number
  rawMaterial: { id:number; code:string; name:string; stockQuantity:number }
}

type State = { productId?:number; items: BomItem[]; loading:boolean; error?:string }
const initialState: State = { items: [], loading:false }

export const fetchBom = createAsyncThunk('bom/fetch', async (productId:number) => {
  const res = await api.get<BomItem[]>(`/products/${productId}/bom`)
  return { productId, items: res.data }
})

export const addBomItem = createAsyncThunk('bom/add', async (payload:{productId:number; rawMaterialId:number; requiredQuantity:number}) => {
  const res = await api.post<BomItem>(`/products/${payload.productId}/bom`, payload)
  return res.data
})

export const updateBomItem = createAsyncThunk('bom/update', async (payload:{productId:number; bomItemId:number; rawMaterialId:number; requiredQuantity:number}) => {
  const res = await api.put<BomItem>(`/products/${payload.productId}/bom/${payload.bomItemId}`, {
    rawMaterialId: payload.rawMaterialId,
    requiredQuantity: payload.requiredQuantity,
  })
  return res.data
})

export const deleteBomItem = createAsyncThunk('bom/delete', async (payload:{productId:number; bomItemId:number}) => {
  await api.delete(`/products/${payload.productId}/bom/${payload.bomItemId}`)
  return payload.bomItemId
})

const slice = createSlice({
  name:'bom',
  initialState,
  reducers:{
    clearBom(state){ state.productId=undefined; state.items=[]; state.error=undefined; state.loading=false }
  },
  extraReducers(builder){
    builder
      .addCase(fetchBom.pending,(s)=>{s.loading=true;s.error=undefined})
      .addCase(fetchBom.fulfilled,(s,a)=>{s.loading=false;s.productId=a.payload.productId;s.items=a.payload.items})
      .addCase(fetchBom.rejected,(s,a)=>{s.loading=false;s.error=a.error.message})
      .addCase(addBomItem.fulfilled,(s,a)=>{s.items.push(a.payload)})
      .addCase(updateBomItem.fulfilled,(s,a)=>{s.items=s.items.map(i=>i.id===a.payload.id?a.payload:i)})
      .addCase(deleteBomItem.fulfilled,(s,a)=>{s.items=s.items.filter(i=>i.id!==a.payload)})
  }
})

export const { clearBom } = slice.actions
export default slice.reducer
