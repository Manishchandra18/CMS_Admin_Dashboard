import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from '../pages/LogoutButton';
import { useAppSelector } from '../hooks/useAppSelector';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box>
      {/* AppBar Navigation */}
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Admin Dashboard</Typography>
          <Box>
            <Button
              color={isActive('/dashboard') ? 'secondary' : 'inherit'}
              component={Link}
              to="/dashboard"
            >
              Dashboard
            </Button>

            {/* Posts visible to Admin & Editor */}
            <Button
              color={isActive('/posts') ? 'secondary' : 'inherit'}
              component={Link}
              to="/posts"
            >
              Posts
            </Button>

            {/* Categories and Users only for Admin */}
            {user?.role === 'admin' && (
              <>
                <Button
                  color={isActive('/categories') ? 'secondary' : 'inherit'}
                  component={Link}
                  to="/categories"
                >
                  Categories
                </Button>

                <Button
                  color={isActive('/users') ? 'secondary' : 'inherit'}
                  component={Link}
                  to="/users"
                >
                  Users
                </Button>
              </>
            )}

            <LogoutButton />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box p={3}>{children}</Box>
    </Box>
  );
};

export default AdminLayout;
