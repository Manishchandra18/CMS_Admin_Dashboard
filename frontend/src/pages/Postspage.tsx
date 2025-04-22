import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useGetPostsQuery, useDeletePostMutation } from '../api/postsApi';
import { useNavigate } from 'react-router-dom';

const PostsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetPostsQuery({ page, limit });
  const [deletePost] = useDeletePostMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null); 

  const posts = data?.data ?? [];

  // Extract dynamic filters
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(posts.map((post) => post.category)));
    return uniqueCategories;
  }, [posts]);

  const authors = useMemo(() => {
    const uniqueAuthors = Array.from(new Set(posts.map((post) => post.author)));
    return uniqueAuthors;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return (
        (filterCategory ? post.category === filterCategory : true) &&
        (filterAuthor ? post.author === filterAuthor : true)
      );
    });
  }, [posts, filterCategory, filterAuthor]);

  const handleDelete = async () => {
    if (selectedPostId) {
      try {
        await deletePost(selectedPostId).unwrap();
        enqueueSnackbar('Post deleted successfully!', { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to delete post.', { variant: 'error' });
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Posts
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2}>
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={filterAuthor}
          onChange={(e) => setFilterAuthor(e.target.value)}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Authors</MenuItem>
          {authors.map((author) => (
            <MenuItem key={author} value={author}>
              {author}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Loading/Error States */}
      {isLoading && <CircularProgress />}
      {isError && <Typography color="error">Failed to load posts.</Typography>}

      {/* Posts Table */}
      {!isLoading && !isError && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.status}</TableCell>
                    <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/posts/view/${post.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => navigate(`/posts/edit/${post.id}`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedPostId(post.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={Math.ceil((data?.total ?? 0) / limit)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsPage;
