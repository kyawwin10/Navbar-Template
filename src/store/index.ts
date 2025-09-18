import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './feature/cartSlice';
import favouriteReducer from './feature/favouriteSlice'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistCartConfig = {key: "cart", storage,};
const PersistFavouriteConfig = {key: "favourite", storage,};

const persistedCartReducer = persistReducer (persistCartConfig, cartReducer);
const persistedFavouriteReducer = persistReducer (PersistFavouriteConfig, favouriteReducer )

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    favourite: persistedFavouriteReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store);