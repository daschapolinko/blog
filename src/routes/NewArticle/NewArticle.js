import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Paper, Grid, Stack, TextField, Typography, Button } from '@mui/material';

import { createArticle } from '../../store/articlesSlice';

const validationSchema = Yup.object()
  .shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    text: Yup.string().required('Text is required'),
  })
  .required();

export default function NewArticle() {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      tag: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tag',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.articles.error);

  const onSubmit = (data) => {
    console.log(data);
    dispatch(
      createArticle(
        JSON.stringify({
          article: {
            title: data.title,
            description: data.description,
            body: data.text,
            tagList: data.tag
              .map((element) => element.value)
              .filter((element) => typeof element !== 'undefined')
              .filter((element) => element !== ''),
          },
        })
      )
    );
    if (error) setError('root.serverError', error);
    else navigate('/');
  };

  console.log(fields);

  return (
    <Paper sx={{ px: 3, py: 2 }}>
      <Typography variant="h6" align="center" margin="dense">
        Create new article
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            required
            autoFocus
            color="secondary"
            id="title"
            name="title"
            label="Title"
            autoComplete="title"
            fullWidth
            margin="dense"
            {...register('title')}
            error={!!errors.title || !!error?.title}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.title?.message}
            {error?.title && `Title ${error?.title}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="description"
            name="description"
            label="Short description"
            fullWidth
            color="secondary"
            margin="dense"
            {...register('description')}
            error={!!errors.description || !!error?.description}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.description?.message}
            {error?.description && `Description ${error?.description}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="text"
            name="text"
            label="Text"
            fullWidth
            multiline
            rows={4}
            color="secondary"
            margin="dense"
            {...register('text')}
            error={!!errors.text}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.text?.message}
          </Typography>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={1} mt={2}>
        <Stack width={2 / 3} spacing={1}>
          {fields.map((item, index) => (
            <Stack direction="row" key={item.id} alignItems="center" spacing={1}>
              <Controller
                name={`tag.${index}.value`}
                control={control}
                render={({ field }) => (
                  <TextField size="small" label="Tag" fullWidth color="secondary" margin="dense" {...field} />
                )}
              />
              <Button variant="outlined" color="error" size="large" type="button" onClick={() => remove(index)}>
                Delete
              </Button>
            </Stack>
          ))}
        </Stack>
        <Stack width={1 / 6} justifyContent="flex-end">
          <Button variant="outlined" color="secondary" size="large" type="button" onClick={() => append('')}>
            Add
          </Button>
        </Stack>
      </Stack>
      <Stack width={1 / 3}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleSubmit(onSubmit)}
          sx={{ mt: 2 }}
        >
          Send
        </Button>
      </Stack>
    </Paper>
  );
}
