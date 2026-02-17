import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api'

export type Product = { id:number; code:string; name:string; price:number }

type State = { items: Product[]; loading:boolean; error?:string }
const initialState: State = { items: [], loading:false }

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await api.get<Product[]>('/products')
  return res.data
})

export const createProduct = createAsyncThunk('products/create', async (payload:{code:string;name:string;price:number}) => {
  const res = await api.post<Product>('/products', payload)
  return res.data
})

export const updateProduct = createAsyncThunk('products/update', async (payload:{id:number;code:string;name:string;price:number}) => {
  const res = await api.put<Product>(`/products/${payload.id}`, payload)
  return res.data
})

export const deleteProduct = createAsyncThunk('products/delete', async (id:number) => {
  await api.delete(`/products/${id}`)
  return id
})

const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers(builder){
    builder
      .addCase(fetchProducts.pending,(s)=>{s.loading=true;s.error=undefined})
      .addCase(fetchProducts.fulfilled,(s,a)=>{s.loading=false;s.items=a.payload})
      .addCase(fetchProducts.rejected,(s,a)=>{s.loading=false;s.error=a.error.message})
      .addCase(createProduct.fulfilled,(s,a)=>{s.items.push(a.payload)})
      .addCase(updateProduct.fulfilled,(s,a)=>{s.items=s.items.map(p=>p.id===a.payload.id?a.payload:p)})
      .addCase(deleteProduct.fulfilled,(s,a)=>{s.items=s.items.filter(p=>p.id!==a.payload)})
  }
})

export default slice.reducer
