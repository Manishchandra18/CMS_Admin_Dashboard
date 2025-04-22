import {
    Box,
    Button,
    CircularProgress,
    Container,
    MenuItem,
    TextField,
    Typography,
  } from '@mui/material';
  import { useFormik } from 'formik';
  import { useNavigate, useParams } from 'react-router-dom';
  import { useSnackbar } from 'notistack';
  import * as Yup from 'yup';
  import {
    useCreatePostMutation,
    useUpdatePostMutation,
    useGetPostByIdQuery,
  } from '../api/postsApi';
  import { useAppSelector } from '../hooks/useAppSelector';
  import { useGetCategoriesQuery } from '../api/categoryApi';
  import { useEffect } from 'react';

  
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    category: Yup.string().required('Category is required'),
    status: Yup.string().required('Status is required'),
    tags: Yup.string().notRequired(),
    imageUrl: Yup.string().notRequired(),
  });
  
  const PostFormPage = () => {
    
    const DRAFT_KEY = 'blog_post_draft';
    const { user } = useAppSelector((state) => state.auth);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const isEditMode = Boolean(id);
    const { data: categories = [], isLoading: isCategoryLoading } = useGetCategoriesQuery();
    
    const { data: postData ,isLoading: isPostLoading } = useGetPostByIdQuery(id!, {
      skip: !isEditMode,
    });
  
    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  
    const formik = useFormik({
      initialValues: {
        title: '',
        content: '',
        category: '',
        status: '',
        tags: '',
        imageUrl: '',
      },
      
      validationSchema,
      enableReinitialize: true, // Enable auto reinit on data fetch
      onSubmit: async (values) => {
        try {
          const postPayload = {
            ...values,
            author: user?.name || 'Unknown Author', // Auto-fill author
            status: values.status as 'Draft' | 'Published', 
            imageUrl: values.imageUrl,// Cast status to the correct type
          };
          if (!isEditMode) {
            localStorage.removeItem(DRAFT_KEY); // Default to Draft if creating a new post
          }
          
          if (isEditMode && id) {
            await updatePost({ id, data: postPayload }).unwrap();
            enqueueSnackbar('Post updated successfully!', { variant: 'success' });
          } else {
            await createPost(postPayload).unwrap();
            enqueueSnackbar('Post created successfully!', { variant: 'success' });
          }
      
          navigate('/dashboard');
         
        } catch (error: any) {
          enqueueSnackbar(error?.data?.message || 'An error occurred.', { variant: 'error' });
        }
      },
    });
    useEffect(() => {
      if (isEditMode && postData) {
        formik.setValues({
          title: postData.title || '',
          content: postData.content || '',
          category: postData.category || '',
          status: postData.status || '',
          tags: postData.tags || '',
          imageUrl: postData.imageUrl || '',
        });
      }
    }, [postData, isEditMode]);
    
    useEffect(() => {
      if (!isEditMode) {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          formik.setValues({
            ...parsed,
            imageUrl: parsed.imageUrl || '',
          });
          formik.setValues(parsed);
        }
      }
    }, []);
    useEffect(() => {
      if (!isEditMode) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formik.values));
      }
    }, [formik.values, isEditMode]);
    
    const loading = isCreating || isUpdating || isPostLoading;
  
    return (
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </Typography>
  
          {loading && <CircularProgress />}
  
          {!loading && (
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Title"
                margin="normal"
                {...formik.getFieldProps('title')}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
  
              <TextField
                fullWidth
                label="Content"
                margin="normal"
                multiline
                rows={4}
                {...formik.getFieldProps('content')}
                error={formik.touched.content && Boolean(formik.errors.content)}
                helperText={formik.touched.content && formik.errors.content}
              />
  
                <TextField
                fullWidth
                label="Category"
                margin="normal"
                select
                {...formik.getFieldProps('category')}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {isCategoryLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </TextField>

  
              <TextField
                fullWidth
                label="Status"
                margin="normal"
                select
                {...formik.getFieldProps('status')}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Published">Published</MenuItem>
              </TextField>
  
              <TextField
                fullWidth
                label="Tags (comma separated)"
                margin="normal"
                {...formik.getFieldProps('tags')}
                error={formik.touched.tags && Boolean(formik.errors.tags)}
                helperText={formik.touched.tags && formik.errors.tags}
              />
  
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {isEditMode ? 'Update Post' : 'Create Post'}
              </Button>
            </Box>
          )}
        </Box>
        {/* Image Upload */}
<Box mt={2}>
  <Button variant="outlined" component="label">
    Upload Image
    <input
      type="file"
      hidden
      accept="image/*"
      onChange={(e) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            formik.setFieldValue('imageUrl', reader.result);
          };
          reader.readAsDataURL(file);
        }
      }}
    />
  </Button>

  {formik.values.imageUrl && (
    <Box mt={2}>
      <Typography variant="subtitle2" gutterBottom>
        Image Preview:
      </Typography>
      <img
        src={formik.values.imageUrl}
        alt="Preview"
        style={{ width: '100%', borderRadius: 8 }}
      />
    </Box>
  )}
</Box>

      </Container>
    );
  };
  
  export default PostFormPage;
  