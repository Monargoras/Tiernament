import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../util/types';

interface AuthState {
  isAuthenticated: boolean,
  user: UserType | undefined,
  token: string | undefined,
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined,
  token: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{user: UserType, token: string}>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = undefined
      state.token = undefined
    },
  }
})

export const { login, updateToken, logout } = authSlice.actions

export default authSlice.reducer