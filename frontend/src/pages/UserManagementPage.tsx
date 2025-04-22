import {
    Box, 
    CircularProgress,
    MenuItem,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
  } from '@mui/material';
  import { useSnackbar } from 'notistack';
  import {
    useGetUsersQuery,
    useUpdateUserRoleMutation,
    useUpdateUserStatusMutation,
  } from '../api/userApi';
  
  const UserManagementPage = () => {
    const { data: users, isLoading, isError } = useGetUsersQuery();
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [updateUserStatus] = useUpdateUserStatusMutation();
    const { enqueueSnackbar } = useSnackbar();
  
    const handleRoleChange = async (id: string, role: string) => {
      try {
        await updateUserRole({ id, role }).unwrap();
        enqueueSnackbar('User role updated', { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to update role', { variant: 'error' });
      }
    };
  
    const handleStatusToggle = async (id: string, active: boolean) => {
      try {
        await updateUserStatus({ id, active }).unwrap();
        enqueueSnackbar('User status updated', { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to update status', { variant: 'error' });
      }
    };
  
    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Failed to load users.</Typography>;
  
    return (
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="editor">Editor</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.active}
                      onChange={(e) => handleStatusToggle(user.id, e.target.checked)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  
  export default UserManagementPage;
  