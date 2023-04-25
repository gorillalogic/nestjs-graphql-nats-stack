import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface AuthState {
  tokens: { 
    access: string,
    refresh: string,
  } | null;
}

const initialState = { tokens: null } as AuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveJwt(state, action: PayloadAction<AuthState>) {
      state.tokens = action.payload.tokens; 
    },
    clearJwt(state) {
      state.tokens = null;
    }
  }
});

export const { saveJwt, clearJwt } = authSlice.actions;
export default authSlice.reducer;
