import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isRegistered: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
    },

    updateUserSuccess: (state, action) => {
      state.user = action.payload;
    },

    logUserOut: (state) => {
      state.currentUser = null;
    },
    registered: (state, action) => {
      state.isRegistered = true;
    },
  },
});

export const { signInSuccess, updateUserSuccess, logUserOut, registered } =
  userSlice.actions;

export default userSlice.reducer;
