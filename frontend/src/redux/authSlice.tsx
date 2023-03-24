import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../util/types';

interface AuthState {
  isAuthenticated: boolean,
  user: UserType | undefined,
  token: string | undefined,
  error: string | undefined,
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined,
  token: undefined,
  error: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{user: UserType, token: string}>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = undefined
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    updateUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = undefined
      state.token = undefined
      state.error = undefined
    },
    credError: (state, action: PayloadAction<string | undefined>) => {
      state.isAuthenticated = false
      state.user = undefined
      state.token = undefined
      state.error = action.payload
    }
  }
})

export const { login, updateToken, updateUser, logout, credError } = authSlice.actions

export default authSlice.reducer