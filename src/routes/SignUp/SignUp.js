import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Paper, Grid, TextField, Typography, FormControlLabel, Checkbox, Button, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { registerUser } from '../../store/userSlice';
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
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    repeatPassword: Yup.string()
      .required('Repeat Password is required')
      .oneOf([Yup.ref('password'), null], 'Repeat Password does not match'),
    acceptTerms: Yup.bool().required().oneOf([true], 'You must agree to the processing of personal information'),
  })
  .required();

export default function SignUp() {
  const {
    register,
    control,
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
    dispatch(
      registerUser(JSON.stringify({ user: { username: data.username, email: data.email, password: data.password } }))
    );
    if (error) setError('root.serverError', error);
  };

  return (
    <Paper sx={{ px: 3, py: 2, w: 400 }}>
      <Typography variant="h6" align="center" margin="dense">
        Create new account
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            required
            autoFocus
            color="secondary"
            id="username"
            name="username"
            label="Username"
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
        <Grid item xs={12}>
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
            error={!!errors.email || !!error?.email}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.email?.message}
            {error?.email && `Email ${error?.email}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
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
            error={!!errors.password}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.password?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="repeatPassword"
            name="repeatPassword"
            label="Repeat Password"
            type="password"
            fullWidth
            color="secondary"
            margin="dense"
            {...register('repeatPassword')}
            error={!!errors.repeatPassword}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.repeatPassword?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="acceptTerms"
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={<Checkbox checked={value} onChange={onChange} color="secondary" />}
                label={
                  <Typography color={errors.acceptTerms ? 'error' : 'inherit'}>
                    I agree to the processing of my personal information
                  </Typography>
                }
              />
            )}
          />
          <br />
          <Typography variant="inherit" color="textSecondary">
            {errors.acceptTerms && `${errors.acceptTerms.message}`}
          </Typography>
        </Grid>
      </Grid>
      <Stack mt={3} spacing={2}>
        <Button type="submit" fullWidth variant="contained" color="secondary" onClick={handleSubmit(onSubmit)}>
          Create
        </Button>
        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <Link to="/signUp" color="secondary">
            Sign In
          </Link>
        </Typography>
      </Stack>
    </Paper>
  );
}
