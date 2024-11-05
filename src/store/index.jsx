import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userSlice from "./slices/UserSlice";
import utilitySlice from "./slices/UtilitySlice";
import uiStoreSlice from "./slices/UIStoreSlice";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false, // Disable the ImmutableStateInvariantMiddleware
});

const persistedState = localStorage.getItem('reduxState')
  ? JSON.parse(localStorage.getItem('reduxState'))
  : {};

let initialState = {
  // cart: {
  //   cartItems: localStorage.getItem("cartItems")
  //     ? JSON.parse(localStorage.getItem("cartItems"))
  //     : [],
  //   shippingInfo: localStorage.getItem("shippingInfo")
  //     ? JSON.parse(localStorage.getItem("shippingInfo"))
  //     : {},
  // },

}
const store = configureStore({
  middleware: customizedMiddleware,
  reducer: {
    user: userSlice,
    utility: utilitySlice,
    uiStore: uiStoreSlice
  },
  initialState,
  preloadedState: persistedState,
})

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export default store;