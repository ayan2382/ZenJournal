import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../BASEURL";


const initialState = {
  entries : [{
    text: "",
    mood: "",
    tags: [""],
    id: null,
  }],
  loading: false,
  error: null,
  tempText: "",
  tempMood: "",
  allTags: [],
}


export const addEntry = createAsyncThunk(
  "addEntry/journals",
  async ({text, mood, tags}, { rejectWithValue }) => {
    try {
      const entryData = { text, mood, tags };
      console.log("Adding entry with data:", entryData);
      console.log("Using URL:", `${BASE_URL}/journals`);
      const response = await axios.post(`${BASE_URL}/journals`, entryData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      console.log("Add entry response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Add entry error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

export const getAllJournals = createAsyncThunk(
  "journals/getAll",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      console.log("Getting all journals from:", `${BASE_URL}/journals`);
      const response = await axios.get(`${BASE_URL}/journals`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("Get all journals response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get all journals error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

export const findJournalById = createAsyncThunk(
  "journals/findById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/journals/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      console.log("Find journal by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Find journal by ID error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

export const updateEntry = createAsyncThunk(
  "journals/update",
  async ({ id, text, mood, tags }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/journals/${id}`, { text, mood, tags }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      console.log("Update entry response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update entry error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

export const deleteEntry = createAsyncThunk(
  "journals/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/journals/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      console.log("Delete entry response:", response.data);

      return { id }; // Return the id for state management
    } catch (error) {
      console.error("Delete entry error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    setTempText: (state, action) => {
      state.tempText = action.payload;
      console.log("Temp text updated to:", state.tempText);
    },
    setTempMood: (state, action) => {
      state.tempMood = action.payload;
      console.log("Temp mood updated to:", state.tempMood);
  },
  setAllTags: (state, action) => {
      state.allTags = action.payload;
      console.log("All tags updated to:", state.allTags);
  }, 
},
  extraReducers: (builder) => {
    builder
      // Add Entry
      .addCase(addEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.push(action.payload);
        state.id = action.payload._id;
        console.log("Push successful. Current entries after addition:", state.entries);
        
        // Update allTags with new tags from the added entry
        if (action.payload.tags && action.payload.tags.length > 0) {
          const newTags = action.payload.tags.filter(tag => !state.allTags.includes(tag));
          if (newTags.length > 0) {
            state.allTags = [...state.allTags, ...newTags];
            console.log("New tags added:", newTags, "All tags now:", state.allTags);
          }
        }
      })
      .addCase(addEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Add entry rejected with error:", action.payload);
      })
      // Get All Journals
      builder
      .addCase(getAllJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(getAllJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Find Journal By ID
      builder
      .addCase(findJournalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findJournalById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.entries.findIndex(entry => entry.id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        } else {
          state.entries.push(action.payload);
        }
      })
      .addCase(findJournalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Entry
      builder
      .addCase(updateEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEntry.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Updating entry with ID:", action.payload._id);
        console.log("Current entries before update:", state.entries);
        const index = state.entries.findIndex(entry => entry._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
          console.log("Update successful. Entry updated:", state.entries[index]);
        } else {
          console.warn("Entry not found in local state, adding it");
          state.entries.push(action.payload);
        }
        
        // Update allTags with new tags from the updated entry
        if (action.payload.tags && action.payload.tags.length > 0) {
          const newTags = action.payload.tags.filter(tag => !state.allTags.includes(tag));
          if (newTags.length > 0) {
            state.allTags = [...state.allTags, ...newTags];
            console.log("New tags added from update:", newTags, "All tags now:", state.allTags);
          }
        }
      })
      .addCase(updateEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Update entry rejected with error:", action.payload);
      })
      // Delete Entry
      builder
      .addCase(deleteEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Deleting entry with ID:", action.payload.id);
        console.log("Current entries before delete:", state.entries);
        state.entries = state.entries.filter(entry => entry._id !== action.payload.id);
        console.log("Delete successful. Current entries after deletion:", state.entries);
        
        // Recalculate allTags from remaining entries
        const remainingTags = Array.from(new Set(state.entries.flatMap(entry => entry.tags || [])));
        state.allTags = remainingTags;
        console.log("Tags recalculated after deletion:", state.allTags);
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {setTempText, setTempMood, setAllTags } = journalSlice.actions;

export default journalSlice.reducer;
