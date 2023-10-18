import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PersistGate } from 'redux-persist/integration/react';

import ErrorPage from './ErrorPage';
import App from './routes/App';
import Article from './routes/Article';
import List from './routes/List';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import Profile from './routes/Profile';
import NewArticle from './routes/NewArticle';
import EditArticle from './routes/EditArticle';
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
        },
        {
          path: '/newArticle',
          element: <NewArticle />,
        },
        {
          path: 'articles/:slug',
          element: <Article />,
          loader: async ({ params }) => dispatch(fetchArticle(params.slug)),
        },
        {
          path: 'articles/:slug/edit',
          element: <EditArticle />,
          loader: async ({ params }) => dispatch(fetchArticle(params.slug)),
        },
        {
          path: '/signIn',
          element: <SignIn />,
        },
        {
          path: '/signUp',
          element: <SignUp />,
        },
        {
          path: '/profile',
          element: <Profile />,
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
