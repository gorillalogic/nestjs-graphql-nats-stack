import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface AuthStateTokens {
  id_token: string,
  access_token: string,
  refresh_token: string,
  expires_in: number,
  token_type: string,
}

export interface AuthStateChallenge {
  url: string,
  codeVerifier: string,
  codeChallenge: string,
}

export enum AuthStateName {
  UNAUTHORIZED,
  CHALLENGE_GENERATED,
  FETCHING_TOKENS,
  AUTHORIZED,
  FAILED,
}

export interface AuthState {
  tokens?: AuthStateTokens,
  challenge?: AuthStateChallenge,
  tempCode?: string,
  state: AuthStateName, 
  tokensRequestId?: string,
}

const initialState = {
  state: AuthStateName.UNAUTHORIZED,
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveChallenge(state, action: PayloadAction<AuthStateChallenge>) {
      state.challenge = action.payload;
      state.tokens = undefined
      state.tempCode = undefined
      state.state = AuthStateName.CHALLENGE_GENERATED
    },
    saveJwt(state, action: PayloadAction<AuthStateTokens>) {
      state.challenge = undefined;
      state.tokens = action.payload; 
      state.tempCode = undefined;
      state.state = AuthStateName.AUTHORIZED
    },
    clear(state) {
      state.challenge = undefined;
      state.tokens = undefined;
      state.tempCode = undefined;
      state.state = AuthStateName.UNAUTHORIZED
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTokens.pending, (state, action) => {
      if (state.state === AuthStateName.CHALLENGE_GENERATED) {
        state.state = AuthStateName.FETCHING_TOKENS
        state.tokensRequestId = action.meta.requestId
      }
    })
    builder.addCase(fetchTokens.rejected, (state) => {
      state.state = AuthStateName.FAILED
      state.tokensRequestId = undefined
      state.challenge = undefined;
      state.tokens = undefined;
      state.tempCode = undefined;
    })
    builder.addCase(fetchTokens.fulfilled, (state, action) => {
      if (state.state === AuthStateName.FETCHING_TOKENS && state.tokensRequestId === action.meta.requestId) {
        state.state = AuthStateName.AUTHORIZED
        state.tokensRequestId = undefined
        state.tokens = action.payload
        state.challenge = undefined
        state.tempCode = undefined
      }
    }) 
  }
});

export const fetchTokens = createAsyncThunk("/tokens", async (authorization_code: string, { getState }) => {
  const { auth } = getState() as { auth: AuthState };

  const response = await fetch(`${import.meta.env.VITE_LOGIN_COGNITO_HOST}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: import.meta.env.VITE_LOGIN_CLIENT_ID,
      code: authorization_code,
      code_verifier: auth.challenge!.codeVerifier, 
      redirect_uri: `${window.location.origin}/authorize`
    })
  })
  console.dir(response)
  return await response.json(); 
})

export const { saveChallenge, clear } = authSlice.actions;
export default authSlice.reducer;
