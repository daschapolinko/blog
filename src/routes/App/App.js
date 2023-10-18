import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';

import { logOut } from '../../store/userSlice';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  return (
    <Stack spacing={3} alignItems="center" sx={{ backgroundColor: 'primary.dark', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">Realworld Blog</Link>
          </Typography>
          {currentUser ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Link to="/newArticle">
                <Button variant="outlined" size="small" color="success">
                  Create article
                </Button>
              </Link>
              <Typography variant="body1">{currentUser.username}</Typography>
              <Link to="/profile">
                <Avatar alt={currentUser.username} src={currentUser.image} />
              </Link>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  dispatch(logOut());
                  navigate(0);
                }}
              >
                Log out
              </Button>
            </Stack>
          ) : (
            <div>
              <Link to="/signIn">
                <Button variant="text" color="inherit">
                  Sign In
                </Button>
              </Link>
              <Link to="/signUp">
                <Button variant="outlined" color="success">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Stack>
  );
}

export default App;
