import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Grid, Stack, TextField, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { loginUser } from '../../store/userSlice';
import LoadingPage from '../../LoadingPage';

const validationSchema = Yup.object()
  .shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
  })
  .required();

export default function SignIn() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const statusUser = useSelector((state) => state.user.status);
  if (statusUser === 'loading') return <LoadingPage />;

  const onSubmit = (data) => {
    dispatch(loginUser(JSON.stringify({ user: { email: data.email, password: data.password } })));
    if (error) setError('root.serverError', error);
  };

  return (
    <Paper sx={{ px: 3, py: 2 }}>
      <Typography variant="h6" align="center" margin="dense">
        Sign In
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="email"
            name="email"
            label="Email address"
            fullWidth
            autoComplete="email"
            color="secondary"
            margin="dense"
            {...register('email')}
            error={!!errors.email || !!error}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.email?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            autoComplete="new-password"
            color="secondary"
            margin="dense"
            {...register('password')}
            error={!!errors.password || !!error}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.password?.message}
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="inherit" color="textSecondary">
        {error && 'Email or password is invalid'}
      </Typography>
      <Stack mt={3} spacing={2}>
        <Button type="submit" fullWidth variant="contained" color="secondary" onClick={handleSubmit(onSubmit)}>
          Login
        </Button>
        <Typography variant="body2" align="center">
          Don&apos;t have an account?{' '}
          <Link to="/signUp" color="secondary">
            Sign Up
          </Link>
        </Typography>
      </Stack>
    </Paper>
  );
}
