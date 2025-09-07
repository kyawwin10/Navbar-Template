import type { cartPayload } from "@/api/cart/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  items: cartPayload[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCarts: (state, action: { payload: cartPayload & { qty: number } }) => {
      const { productId, qty, ...rest } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.stockQTY += qty;
      } else {
        state.items.push({ ...rest, productId, stockQTY: qty });
      }
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) item.stockQTY += 1;
    },

    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item && item.stockQTY > 1) {
        item.stockQTY -= 1;
      } else {
        state.items = state.items.filter((i) => i.productId !== action.payload);
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCarts,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart
} = cartSlice.actions;
export default cartSlice.reducer;
