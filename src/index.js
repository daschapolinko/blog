import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, Navigate, redirect, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PersistGate } from 'redux-persist/integration/react';

import ErrorPage from './ErrorPage';
import NotFound from './NotFound';
import App from './routes/App';
import Article from './routes/Article';
import List from './routes/List';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import Profile from './routes/Profile';
import ChangeArticle from './routes/ChangeArticle';
import store, { persistor } from './store/store';
import { fetchArticles, fetchArticle } from './store/articlesSlice';

import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
      contrastText: '#000000D9',
    },
    secondary: {
      main: '#1890FF',
      contrastText: '#FFF',
    },
    success: {
      main: '#52C41A',
      contrastText: '#47008F',
    },
    error: {
      main: '#F5222D',
    },
    warning: {
      main: '#FAAD14',
    },
    info: {
      main: '#000',
    },
  },
  typography: {
    fontSize: 12,
  },
});

function Routers() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchArticles(1));
  });
  const user = useSelector((state) => state.user.currentUser);
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <List />,
          loader: async () => dispatch(fetchArticles()),
        },
        {
          path: '/articles',
          element: <List />,
          loader: async () => dispatch(fetchArticles()),
        },
        {
          path: '/newArticle',
          element: (
            <ProtectedRoute user={user}>
              <ChangeArticle />
            </ProtectedRoute>
          ),
        },
        {
          path: 'articles/:slug',
          element: <Article />,
          loader: async ({ params }) => dispatch(fetchArticle(params.slug)),
        },
        {
          path: 'articles/:slug/edit',
          element: (
            <ProtectedRoute user={user}>
              <ChangeArticle edit />
            </ProtectedRoute>
          ),
          loader: async ({ params }) => {
            const { article } = (await dispatch(fetchArticle(params.slug))).payload;
            if (user && user.username !== article.author.username) return redirect('/');
            return null;
          },
        },
        {
          path: '/signIn',
          element: (
            <ProtectedRoute user={user} afterAuth>
              <SignIn />
            </ProtectedRoute>
          ),
        },
        {
          path: '/signUp',
          element: (
            <ProtectedRoute user={user} afterAuth>
              <SignUp />
            </ProtectedRoute>
          ),
        },
        {
          path: '/profile',
          element: (
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routers />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

function ProtectedRoute({ user, afterAuth = false, redirectPath = '/', children }) {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  if (user && afterAuth) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}
