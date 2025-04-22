import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: 'admin' | 'editor' | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  role: (localStorage.getItem('role') as 'admin' | 'editor') || null,
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        role: 'admin' | 'editor';
        user: { id: string; name: string; email: string; role: string };
      }>
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authSliceName = authSlice.name;
export default authSlice;