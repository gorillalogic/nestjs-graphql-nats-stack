import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { gql } from "apollo-boost";
import client from "../lib/graphql/client";

export interface AuthStateTokens {
  access: string,
  refresh: string,
}

export interface AuthStateChallenge {
  url: string,
  codeVerifier: string,
  codeChallenge: string,
}

export interface AuthState {
  tokens?: AuthStateTokens,
  challenge?: AuthStateChallenge,
  tempCode?: string,
}

const initialState = {} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveChallenge(state, action: PayloadAction<AuthStateChallenge>) {
      state.challenge = action.payload;
    },
    clearChallenge(state) {
      state.challenge = undefined;
    },
    saveJwt(state, action: PayloadAction<AuthStateTokens>) {
      state.tokens = action.payload; 
    },
    clearJwt(state) {
      state.tokens = undefined;
    }
  }
});

export const fetchTokens = createAsyncThunk("/tokens", async () => {
  const response = await client.query({
    query: gql`
      {
        users {
          id,
          email,
          firstName,
          lastName,
          isActive,
        }
      }
    `
  });
  console.dir(response);
  return response.data;
})

export const { saveJwt, clearJwt, saveChallenge, clearChallenge } = authSlice.actions;
export default authSlice.reducer;
