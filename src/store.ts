import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.ts";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
