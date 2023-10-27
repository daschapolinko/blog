/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const url = 'https://api.realworld.io/api';
const pageSize = 5;
const options = {
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    accept: 'application/json',
  },
};

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (page, { getState, rejectWithValue }) => {
  const { token } = getState().user;
  const getOptions = token ? { headers: { Authorization: `Token ${token}` } } : options;
  const offset = (page - 1) * pageSize;
  try {
    const response = await fetch(`${url}/articles?limit=${pageSize}&offset=${offset}`, getOptions);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return { ...data, page };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchArticle = createAsyncThunk('articles/fetchArticle', async (slug, { getState, rejectWithValue }) => {
  const { token } = getState().user;
  const getOptions = token ? { headers: { Authorization: `Token ${token}` } } : options;
  try {
    const response = await fetch(`${url}/articles/${slug}`, getOptions);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (article, { getState, rejectWithValue }) => {
    const { token } = getState().user;
    const createOptions = {
      method: 'POST',
      headers: { Authorization: `Token ${token}`, ...options.headers },
      body: article,
    };
    try {
      const response = await fetch(`${url}/articles`, createOptions);
      if (!response.ok && response.status !== 422) throw new Error(response.status);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async (params, { getState, rejectWithValue }) => {
    const { slug, article } = params;
    const { token } = getState().user;
    const updateOptions = {
      method: 'PUT',
      headers: { Authorization: `Token ${token}`, ...options.headers },
      body: article,
    };
    try {
      const response = await fetch(`${url}/articles/${slug}`, updateOptions);
      if (!response.ok && response.status !== 422) throw new Error(response.status);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteArticle = createAsyncThunk('articles/deleteArticle', async (slug, { getState, rejectWithValue }) => {
  const { token } = getState().user;
  const deleteOptions = {
    method: 'DELETE',
    headers: { Authorization: `Token ${token}`, ...options.headers },
  };
  try {
    const response = await fetch(`${url}/articles/${slug}`, deleteOptions);
    if (!response.ok) throw new Error(`Error: ${response.message}`);
    return true;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const favoriteArticle = createAsyncThunk(
  'articles/favoriteArticle',
  async (slug, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().user;
    const { favorited } = (await dispatch(fetchArticle(slug))).payload.article;
    const method = favorited ? 'DELETE' : 'POST';
    const favOptions = {
      method,
      headers: { Authorization: `Token ${token}`, ...options.headers },
    };
    try {
      const response = await fetch(`${url}/articles/${slug}/favorite`, favOptions);
      if (!response.ok && response.status !== 422) throw new Error(response.status);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    articlesCount: 0,
    pageCount: 0,
    currentPage: 1,
    currentArticle: null,
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
        state.pageCount = Math.floor(action.payload.articlesCount / pageSize) + 1;
        state.currentPage = action.payload.page;
        state.status = 'resolved';
      })
      .addCase(deleteArticle.fulfilled, (state) => {
        state.status = 'resolved';
      })
      .addMatcher(
        (action) => action.type.startsWith('articles') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.currentArticle = action.payload.article;
          state.status = 'resolved';
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('articles') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
          state.status = 'rejected';
        }
      );
  },
});

export default articlesSlice.reducer;
