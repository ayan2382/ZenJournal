import {configureStore} from '@reduxjs/toolkit'
import journalReducer from './slices/JournalSlice'
import auth from './slices/authSlice'


const zenJournalStore = configureStore({
  reducer: {
    auth: auth,
    journal: journalReducer,
  },
});
export default zenJournalStore;