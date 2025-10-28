import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  entries: []
};


const journalSlice = createSlice({
  name: "Zainjournal",
  initialState,
  reducers: {
    addEntry: {
      reducer(state, action) {
        state.entries.push(action.payload);
      },
      prepare(title, content) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString()
          }
        };
      }
    },
    updateEntry(state, action) {
      const { id, title, content } = action.payload;
      const existing = state.entries.find(e => e.id === id);
      if (existing) {
        existing.title = title;
        existing.content = content;
      }
    },
    deleteEntry(state, action) {
      state.entries = state.entries.filter(e => e.id !== action.payload);
    }
  }
});

export const { addEntry, updateEntry, deleteEntry } = journalSlice.actions;
export default journalSlice.reducer;
