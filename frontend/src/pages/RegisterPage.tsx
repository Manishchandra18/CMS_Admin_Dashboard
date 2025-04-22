//optional
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
  import * as Yup from 'yup';
  import { useSnackbar } from 'notistack';
  import { useNavigate } from 'react-router-dom';
  import { useRegisterMutation } from '../api/authApi';
  
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    role: Yup.string().oneOf(['admin', 'editor']).required('Role is required'),
  });
  
  const RegisterPage = () => {
    const [register, { isLoading }] = useRegisterMutation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
  
    const formik = useFormik({
      initialValues: {
        name: '',
        email: '',
        password: '',
        role: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        try {
            await register({
                ...values,
                role: values.role as 'admin' | 'editor',
              }).unwrap();
              
          enqueueSnackbar('Registration successful. Please log in.', { variant: 'success' });
          navigate('/login');
        } catch (error: any) {
          enqueueSnackbar(error?.data?.message || 'Registration failed', { variant: 'error' });
        }
      },
    });
  
    return (
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Register
          </Typography>
  
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              {...formik.getFieldProps('name')}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
  
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...formik.getFieldProps('email')}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
  
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              type="password"
              {...formik.getFieldProps('password')}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
  
            <TextField
              fullWidth
              select
              label="Role"
              margin="normal"
              {...formik.getFieldProps('role')}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
            </TextField>
  
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>
        </Box>
      </Container>
    );
  };
  
  export default RegisterPage;
  