import { configureStore } from "@reduxjs/toolkit";
import journalReducer from "../features/journal/journalSlice";

export const store = configureStore({
  reducer: {
    journal: journalReducer,
  },
});
