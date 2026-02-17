import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './store/productsSlice'
import rawMaterialsReducer from './store/rawMaterialsSlice'
import bomReducer from './store/bomSlice'
import productionReducer from './store/productionSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    bom: bomReducer,
    production: productionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
