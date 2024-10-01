import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  cartQuantity: number;
  option: string;
  optionIndex: number;
}

interface CartState {
  cartItems: CartItem[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
}

const initialState: CartState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { id, colors, selectedColorIndex, price } = action.payload;
      const selectedColor = colors[selectedColorIndex];
      const itemIndex = state.cartItems.findIndex((item) => item.id === id);
      
      if (itemIndex === -1) {
        state.cartItems.push({ id, cartQuantity: 1, option: selectedColor, optionIndex: selectedColorIndex });
      } else {
        state.cartItems[itemIndex].cartQuantity += 1;
        state.cartItems[itemIndex].option = selectedColor;
        state.cartItems[itemIndex].optionIndex = selectedColorIndex;
      }
      state.cartTotalQuantity += 1;
      state.cartTotalAmount += price;
    },
    decreaseCart(state, action) {
      const { id, price } = action.payload;
      const itemIndex = state.cartItems.findIndex((item) => item.id === id);
      
      if (itemIndex !== -1) {
        const item = state.cartItems[itemIndex];
        if (item.cartQuantity > 1) {
          item.cartQuantity -= 1;
          state.cartTotalQuantity -= 1;
          state.cartTotalAmount -= price;
        }
      }
    },
    removeFromCart(state, action) {
      const { id, price } = action.payload;
      const itemIndex = state.cartItems.findIndex((item) => item.id === id);
      
      if (itemIndex !== -1) {
        const item = state.cartItems[itemIndex];
        state.cartTotalQuantity -= item.cartQuantity;
        state.cartTotalAmount -= item.cartQuantity * price;
        state.cartItems.splice(itemIndex, 1);
      }
    },
    clearCart(state) {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
    },
  },
});

export const { addToCart, decreaseCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
