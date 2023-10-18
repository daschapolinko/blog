import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import { fetchArticles } from '../../store/articlesSlice';
import LoadingPage from '../../LoadingPage';

function List() {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles.articles);
  const pageCount = useSelector((state) => state.articles.pageCount);
  const currentPage = useSelector((state) => state.articles.currentPage);
  const statusArticle = useSelector((state) => state.articles.status);
  if (statusArticle === 'loading') return <LoadingPage />;
  const articlesList = articles.map((article) => <ListItem article={article} key={article.slug} />);
  return (
    <>
      <Stack spacing={2}>{articlesList}</Stack>
      <Pagination
        count={pageCount}
        defaultPage={currentPage}
        onChange={(e, page) => dispatch(fetchArticles(page))}
        shape="rounded"
        color="secondary"
        sx={{ pb: 2 }}
      />
    </>
  );
}

function ListItem({ article }) {
  const { author, createdAt, description, favorited, favoritesCount, slug, tagList, title } = article;
  const tags = tagList.map((tag) => <Chip label={tag} key={tag} variant="outlined" />);
  return (
    <Card sx={{ maxWidth: 675 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Stack sx={{ maxWidth: 475 }}>
            <Stack direction="row">
              <Link to={`/articles/${slug}`}>
                <Typography variant="h5" component="div" color="secondary">
                  {title}
                </Typography>
              </Link>
              <IconButton aria-label="add to favorites" size="small">
                {favorited ? <FavoriteRoundedIcon color="warning" /> : <FavoriteBorderRoundedIcon />}
                {favoritesCount}
              </IconButton>
            </Stack>
            <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1} mb={1}>
              {tags}
            </Stack>
            <Typography variant="body2">{description}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Stack alignItems="flex-end">
              <Typography>{author.username}</Typography>
              <Typography variant="body2">{format(parseISO(createdAt), 'MMMM dd, yyyy')}</Typography>
            </Stack>
            <Avatar alt={author.username} src={author.image} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default List;
