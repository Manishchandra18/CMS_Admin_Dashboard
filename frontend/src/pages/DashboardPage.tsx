import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton.tsx';
import { useGetStatsQuery } from '../api/dashboardApi';
import { useAppSelector } from '../hooks/useAppSelector';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetStatsQuery();
  const { user } = useAppSelector((state) => state.auth);

  if (isLoading) return <CircularProgress />;

  const stats = [
    { label: 'Total Posts', value: data?.stats.totalPosts },
    { label: 'Total Categories', value: data?.stats.totalCategories },
    { label: 'Total Users', value: data?.stats.totalUsers },
  ];

  return (
    <Box>
      <Box p={3}>
        {/* Header + Admin-only actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Dashboard Overview
          </Typography>

          <Box display="flex" gap={1}>
  {user?.role === 'admin' && (
    <>
      <Button variant="outlined" onClick={() => navigate('/users')}>
        Manage Users
      </Button>
      <Button variant="outlined" onClick={() => navigate('/posts')}>
        Manage Posts
      </Button>
      <Button variant="outlined" onClick={() => navigate('/categories')}>
        Manage Categories
      </Button>
    </>
  )}


        <Button variant="contained" onClick={() => navigate('/posts/create')}>
          Add New Post
        </Button>
        </Box>

        </Box>

    
        <Grid container spacing={3} mb={4}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={4} key={stat.label}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4">{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
       </Grid>
 
        
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Recent Posts
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List dense disablePadding>
              {data?.recentPosts.map((post) => (
                <ListItem
                  key={post.id}
                  divider
                  secondaryAction={
                    <>
                      <Chip
                        label={post.status}
                        color={post.status === 'Published' ? 'success' : 'warning'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="View Post">
                        <IconButton onClick={() => navigate(`/posts/view/${post.id}`)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                >
                  <ListItemText
                    primary={post.title}
                    secondary={`By ${post.author} • ${new Date(post.date).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>

            {user?.role === 'admin' && (
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="text" onClick={() => navigate('/posts')}>
                  View All Posts
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box px={3} py={2}>
        <LogoutButton />
      </Box>
    </Box>
  );
};

export default DashboardPage;
