import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api'

export type SuggestionItem = {
  productId:number
  productCode:string
  productName:string
  unitPrice:number
  quantity:number
  subtotal:number
}
export type Suggestion = { items: SuggestionItem[]; totalRevenue:number }

type State = { data?:Suggestion; loading:boolean; error?:string }
const initialState: State = { loading:false }

export const fetchSuggestion = createAsyncThunk('production/fetch', async () => {
  const res = await api.get<Suggestion>('/production/suggestion')
  return res.data
})

const slice = createSlice({
  name:'production',
  initialState,
  reducers:{},
  extraReducers(builder){
    builder
      .addCase(fetchSuggestion.pending,(s)=>{s.loading=true;s.error=undefined})
      .addCase(fetchSuggestion.fulfilled,(s,a)=>{s.loading=false;s.data=a.payload})
      .addCase(fetchSuggestion.rejected,(s,a)=>{s.loading=false;s.error=a.error.message})
  }
})

export default slice.reducer
