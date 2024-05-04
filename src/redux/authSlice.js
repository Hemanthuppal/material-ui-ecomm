import { createSlice } from '@reduxjs/toolkit';

import { loginUserAPI } from 'src/services/apiAdminServices';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, 
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUserRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    initializeUser(state, action) {
      state.user = action.payload;
    },
    logoutUser(state) {
      state.user = null;
    },
  },
});

export const { loginUserRequest, loginUserSuccess, loginUserFailure, initializeUser,logoutUser } = authSlice.actions;

export const loginUser = ({ email, password, navigate, setLoading }) => async (dispatch) => {
  dispatch(loginUserRequest());
  try {
    const user = await loginUserAPI({ email, password });
    if (user) {
      dispatch(loginUserSuccess(user));
      setLoading(false);
      console.log('Login successful');
      navigate('/');
    } else {
      dispatch(loginUserFailure('Invalid email or password'));
      setLoading(false);
      alert('Invalid email or password');
    }
  } catch (error) {
    dispatch(loginUserFailure(error.message));
    console.error('Error logging in:', error);
  }
};

export const initializeUserData = () => (dispatch) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  dispatch(initializeUser(userData));
};

export default authSlice.reducer;
