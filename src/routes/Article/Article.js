import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Avatar, Card, CardContent, Button, IconButton, Chip, Stack, Typography, Popover, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import Markdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { deleteArticle, favoriteArticle } from '../../store/articlesSlice';
import LoadingPage from '../../LoadingPage';

export default function Article() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const article = useSelector((state) => state.articles.currentArticle) || useLoaderData().payload.article;
  const { author, body, createdAt, description, favorited, favoritesCount, tagList, title, slug } = article;
  const tags = Array.from(new Set(tagList)).map((tag) => <Chip label={tag} key={tag} variant="outlined" />);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const statusArticle = useSelector((state) => state.articles.status);
  if (statusArticle === 'loading') return <LoadingPage />;
  return (
    <Card sx={{ maxWidth: 675 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Stack sx={{ maxWidth: 475 }}>
            <Stack direction="row">
              <Typography variant="h5" component="div" color="secondary">
                {title}
              </Typography>
              <IconButton
                aria-label="add to favorites"
                size="small"
                onClick={() => dispatch(favoriteArticle(slug))}
                disabled={!user}
              >
                {favorited ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}
                {favoritesCount}
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {tags}
            </Stack>
            <Typography variant="caption">{description}</Typography>
            <Typography component="div" variant="body2">
              <Markdown>{body}</Markdown>
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Stack alignItems="flex-end">
                <Typography>{author.username}</Typography>
                <Typography variant="body2">{format(parseISO(createdAt), 'MMMM dd, yyyy')}</Typography>
              </Stack>
              <Avatar alt={author.username} src={author.image} />
            </Stack>
            {user && author.username === user.username && (
              <Stack direction="row" justifyContent="space-evenly" spacing={1}>
                <Button aria-describedby={id} variant="outlined" color="error" onClick={handleClick}>
                  Delete
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <Paper sx={{ p: 2 }}>
                    <Stack direction="row">
                      <ErrorIcon fontSize="small" color="warning" />
                      <Typography variant="body1" gutterBottom>
                        Are you sure to delete this article?
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="end" spacing={1}>
                      <Button aria-describedby={id} size="small" color="info" variant="outlined" onClick={handleClose}>
                        No
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          dispatch(deleteArticle(slug));
                          navigate('/');
                        }}
                      >
                        Yes
                      </Button>
                    </Stack>
                  </Paper>
                </Popover>
                <Link to={`/articles/${slug}/edit`}>
                  <Button variant="outlined" color="success">
                    Edit
                  </Button>
                </Link>
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
