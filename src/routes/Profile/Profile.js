import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Paper, Grid, TextField, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { updateUser } from '../../store/userSlice';
import LoadingPage from '../../LoadingPage';

const validationSchema = Yup.object()
  .shape({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid')
      .matches(/\b[a-z]*\b/, 'Email must not start with capital letter'),
    newPassword: Yup.string()
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    avatarSrc: Yup.string().url().nullable(),
  })
  .required();

export default function SignUp() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const error = useSelector((state) => state.user.error);

  const statusUser = useSelector((state) => state.user.status);
  if (statusUser === 'loading') return <LoadingPage />;

  const onSubmit = (data) => {
    const user = { username: data.username, email: data.email };
    if (data.password) user.password = data.password;
    if (data.image) user.image = data.image;
    dispatch(updateUser(JSON.stringify({ user })));
    if (error) setError('root.serverError', error);
  };

  return (
    <Paper sx={{ px: 3, py: 2 }}>
      <Typography variant="h6" align="center" margin="dense">
        Edit profile
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            autoFocus
            color="secondary"
            id="username"
            name="username"
            label="Username"
            defaultValue={currentUser.username}
            autoComplete="username"
            fullWidth
            margin="dense"
            {...register('username')}
            error={!!errors.username || !!error?.username}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.username?.message}
            {error?.username && `Username ${error?.username}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="email"
            name="email"
            label="Email address"
            defaultValue={currentUser.email}
            fullWidth
            autoComplete="email"
            color="secondary"
            margin="dense"
            {...register('email')}
            error={!!errors.email || !!error?.email}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.email?.message}
            {error?.email && `Email ${error?.email}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="newPassword"
            name="newPassword"
            label="New password"
            type="password"
            fullWidth
            autoComplete="new-password"
            color="secondary"
            margin="dense"
            {...register('newPassword')}
            error={!!errors.newPassword}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.newPassword?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="avatarSrc"
            name="avatarSrc"
            label="Avatar image (url)"
            defaultValue={currentUser.image}
            type="url"
            fullWidth
            color="secondary"
            margin="dense"
            {...register('avatarSrc')}
            error={!!errors.avatarSrc}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.avatarSrc?.message}
          </Typography>
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        onClick={handleSubmit(onSubmit)}
        sx={{ mt: 2 }}
      >
        Save
      </Button>
    </Paper>
  );
}
