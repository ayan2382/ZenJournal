import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../BASEURL';

// Configure axios for CORS
axios.defaults.withCredentials = false; // Try without credentials first
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export const initialState = {
  user: null,
  name: null,
  token: null,
  isSignedIn: false,
  loading: false,
  error: null,
  howManyLogins: 0, // New state field to track login count
  tokensAndLogins: [], // Array to track tokens and their login counts
};

export const login = createAsyncThunk(
    "auth/login",
    async(credentials, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, credentials, {
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            return response.data;
        } catch(error) {
            console.log("Login error:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)
export const logout = createAsyncThunk(
    "auth/logout",
    async(_, {rejectWithValue, getState}) => {
        try {
            const { auth } = getState();
            const token = auth.token || localStorage.getItem('authToken');
            
            // If there's a token, make the logout API call
            if (token) {
                await axios.post(`${BASE_URL}/auth/logout`, {}, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
            }
            localStorage.removeItem('authToken');
            return { success: true };
        } catch(error) {
            console.log("Logout error:", error);
            localStorage.removeItem('authToken');
            return { success: true }; 
        }
    }
)
export const checkForRegistration = createAsyncThunk(
    "check4Registration/register",
    async(_, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                return rejectWithValue('No auth token found');
            }
            const response = await axios.get(`${BASE_URL}/auth/user`, {
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            console.log("Check for registration response:", response.data);
            return response.data;
        } catch(error) {
            console.log(error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)
export const registration = createAsyncThunk(
    "auth/register",
    async(credentials, {rejectWithValue}) => {
        try {
            console.log("Attempting registration with:", credentials);
            console.log("Using BASE_URL:", BASE_URL);
            const response = await axios.post(`${BASE_URL}/auth/register`, credentials, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            });
            console.log("Registration successful:", response.data);
            return response.data;
            
        } catch(error) {
            console.error("Registration error:", error);
            return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState, 
    reducers: {
        updateLoginCount: (state, action) => {
            console.log("Updating login count for token:", action.payload, "Current state:", state.tokensAndLogins);
            const entry = state.tokensAndLogins.find(entry => entry.token === action.payload);
            console.log("Found entry for token:", entry, entry?.token, entry?.count);
            if (entry) {
                entry.count += 1;
                state.howManyLogins = entry.count;
            } else {
                state.tokensAndLogins.push({token: action.payload, count: 1});
                state.howManyLogins = 1;
            }
            
            console.log("Login count updated to:", state.howManyLogins);
        },
        // Immediate logout without API call
        logoutImmediate: (state) => {
            state.user = null;
            state.name = null;
            state.token = null;
            state.isSignedIn = false;
            state.isAdmin = false;
            state.isAuthor = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('authToken');
        },
        // Register immediate (if registered) 
        registerImmediate: (state, action) => {
            state.user = action.payload;
            state.isSignedIn = true;
            state.loading = false;
            state.error = null;
            console.log("Immediate registration set with payload:", action.payload);
        }
    }, 
    extraReducers: (builder) => {
        // Login
        builder
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.name = action.payload.user.name;
            localStorage.setItem('authToken', action.payload.token);
            console.log("Login successful:", action.payload);
            state.isSignedIn = true;
            // const existingTokenEntry = state.tokensAndLogins.find(entry => entry.token === action.payload.token);
            // if (existingTokenEntry) {
            //     existingTokenEntry.count += 1;
            //     state.howManyLogins = state.tokensAndLogins.reduce((acc, entry) => acc + entry.count, 0);
            // } else {
            //     state.tokensAndLogins.push({token: action.payload.token, count: 1});
            //     state.howManyLogins = state.tokensAndLogins.reduce((acc, entry) => acc + entry.count, 0);   
            // }
            
            // console.log("Token logins:", state.tokensAndLogins);
            // console.log("Total login count updated:", state.howManyLogins);
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            console.error("Login failed:", action.payload);
        })
        // Registration
        builder
        .addCase(registration.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registration.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.name = action.payload.name;
            localStorage.setItem('authToken', action.payload.token);
            console.log("Registration successful:", action.payload);
            state.isSignedIn = true;
        })
        .addCase(registration.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            console.error("Registration failed:", action.payload);
        });
        // Check For Registration
        builder
        .addCase(checkForRegistration.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(checkForRegistration.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.name = action.payload.name;
            state.isSignedIn = true;
            console.log("Check for registration successful:", action.payload, ". Initial state:", state);
        })
        .addCase(checkForRegistration.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            console.error("Check for registration failed:", action.payload);
            localStorage.removeItem('authToken');
            state.isSignedIn = false;
        });
        // Logout
        builder
        .addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
            state.name = null;
            state.token = null;
            localStorage.removeItem('authToken');
            console.log("Logout successful");
            state.isSignedIn = false;
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            console.error("Logout failed:", action.payload);
        });
    }
})
export const { logoutImmediate, registerImmediate, updateLoginCount } = authSlice.actions;
export default authSlice.reducer;
