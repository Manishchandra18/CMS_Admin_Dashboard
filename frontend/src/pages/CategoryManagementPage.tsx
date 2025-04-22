import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from '@mui/material';
  import { useSnackbar } from 'notistack';
  import { useState } from 'react';
  import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
  } from '../api/categoryApi';
  import { Edit, Delete } from '@mui/icons-material';
  
  const CategoryManagementPage = () => {
    const { data: categories, isLoading } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const { enqueueSnackbar } = useSnackbar();
  
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
    const [categoryName, setCategoryName] = useState('');
  
    const openDialog = (category?: { id: string; name: string }) => {
      if (category) {
        setIsEditMode(true);
        setSelected(category);
        setCategoryName(category.name);
      } else {
        setIsEditMode(false);
        setSelected(null);
        setCategoryName('');
      }
      setDialogOpen(true);
    };
  
    const handleSubmit = async () => {
      try {
        if (isEditMode && selected) {
          await updateCategory({ id: selected.id, name: categoryName }).unwrap();
          enqueueSnackbar('Category updated', { variant: 'success' });
        } else {
          await createCategory({ name: categoryName }).unwrap();
          enqueueSnackbar('Category added', { variant: 'success' });
        }
      } catch (err: any) {
        enqueueSnackbar(err?.data?.message || 'Failed to save category', { variant: 'error' });
      } finally {
        setDialogOpen(false);
      }
    };
    if (isLoading) {
        return <Typography>Loading categories...</Typography>;
      }
      
  
    const handleDelete = async (id: string) => {
      try {
        await deleteCategory(id).unwrap();
        enqueueSnackbar('Category deleted', { variant: 'success' });
      } catch (err: any) {
        enqueueSnackbar(err?.data?.message || 'Cannot delete category', { variant: 'error' });
      }
    };
  
    return (
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Manage Categories
        </Typography>
  
        <Button variant="contained" onClick={() => openDialog()} sx={{ mb: 2 }}>
          Add Category
        </Button>
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openDialog(cat)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(cat.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Category</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
    );
  };
  
  export default CategoryManagementPage;
  