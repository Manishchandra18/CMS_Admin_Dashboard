import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { useGetPostsQuery } from '../api/postsApi';
import { useNavigate } from 'react-router-dom';
import { Edit } from '@mui/icons-material';

const PostTable = () => {
  const { data, isLoading, isError } = useGetPostsQuery({ page: 1, limit: 10 });
  const navigate = useNavigate();

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load posts.</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.status}</TableCell>
              <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <IconButton onClick={() => navigate(`/posts/edit/${post.id}`)}>
                  <Edit />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostTable;
