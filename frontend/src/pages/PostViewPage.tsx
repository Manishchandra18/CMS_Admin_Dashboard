import { useParams } from 'react-router-dom';
import { useGetPostByIdQuery } from '../api/postsApi';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Container
} from '@mui/material';

const PostViewPage = () => {
  const { id } = useParams();
  const { data , isLoading, isError } = useGetPostByIdQuery(id!);

  if (isLoading) return <CircularProgress />;
  if (isError || !data) {
    return <Typography color="error">Post not found or failed to load.</Typography>;
  }

  return (
    <Container maxWidth="md">
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{data.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          By {data.author} • {new Date(data.date).toLocaleDateString()}
        </Typography>
        <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>
          Status: {data.status}
        </Typography>
        {data.imageUrl && (
          <Box mt={3} mb={3}>
            <img
              src={data.imageUrl}
              alt="Post visual"
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
            />
          </Box>
        )}
        <Typography variant="body1">{data.content}</Typography>
      </Paper>
    </Box>
    </Container>
  );
};

export default PostViewPage;
