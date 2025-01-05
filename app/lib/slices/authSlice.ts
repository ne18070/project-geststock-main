import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string | null;
    email: string | null;
    role: string | null;
    name: string | null;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    id: null,
    email: null,
    role: null,
    name: null,
  },
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        role: string;
        name: string;
      }>,
    ) {
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.id,
        email: action.payload.email,
        role: action.payload.role,
        name: action.payload.name,
      };
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = {
        id: null,
        email: null,
        role: null,
        name: null,
      };
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
