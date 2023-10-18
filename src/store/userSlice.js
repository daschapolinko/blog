/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const url = 'https://api.realworld.io/api';
const options = {
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    accept: 'application/json',
  },
};

export const getUser = createAsyncThunk('user/getUser', async (_, { getState, rejectWithValue }) => {
  const { token } = getState().user;
  const updateOptions = { method: 'GET', headers: { Authorization: `Token ${token}`, ...options.headers } };
  try {
    const response = await fetch(`${url}/user`, updateOptions);
    if (!response.ok && response.status !== 422) throw new Error(response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const registerUser = createAsyncThunk('user/registerUser', async (user, { rejectWithValue }) => {
  const registerOptions = { method: 'POST', ...options, body: user };
  try {
    const response = await fetch(`${url}/users`, registerOptions);
    if (!response.ok && response.status !== 422) throw new Error(response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const loginUser = createAsyncThunk('user/loginUser', async (user, { rejectWithValue }) => {
  const loginOptions = { method: 'POST', ...options, body: user };
  try {
    const response = await fetch(`${url}/users/login`, loginOptions);
    if (!response.ok && response.status !== 422) throw new Error(response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUser = createAsyncThunk('user/updateUser', async (user, { getState, rejectWithValue }) => {
  const { token } = getState().user;
  const updateOptions = { method: 'PUT', headers: { Authorization: `Token ${token}`, ...options.headers }, body: user };
  try {
    const response = await fetch(`${url}/user`, updateOptions);
    if (!response.ok && response.status !== 422) throw new Error(response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    token: null,
    status: null,
    error: null,
  },
  reducers: {
    logOut: (state) => {
      state.currentUser = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith('user') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          const data = action.payload;
          if (data.errors) {
            state.status = 'rejected';
            state.error = data.errors;
          } else {
            state.status = 'resolved';
            state.currentUser = data.user;
            state.token = data.user.token;
          }
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('user') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'rejected';
          state.error = action.payload;
        }
      );
  },
});

export const { logOut } = userSlice.actions;

export default userSlice.reducer;
