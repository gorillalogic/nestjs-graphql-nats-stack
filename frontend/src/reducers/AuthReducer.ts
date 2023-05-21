import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { prepareLoginRedirect } from "../lib/authentication";

export interface AuthStateTokens {
  id_token: string,
  access_token: string,
  refresh_token: string,
  expires_in: number,
  token_type: string,
}

export interface AuthStateChallenge {
  url: string,
  code_verifier: string,
  code_challenge: string,
}

export enum AuthStateName {
  UNAUTHORIZED = "UNAUTHORIZED",
  CHALLENGE_GENERATED = "CHALLENGE_GENERATED",
  FETCHING_TOKENS = "FETCHING_TOKENS",
  AUTHORIZED = "AUTHORIZED",
  FAILED = "FAILED",
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
    reset(state) {
      state.challenge = undefined;
      state.tokens = undefined;
      state.tempCode = undefined;
      state.state = AuthStateName.UNAUTHORIZED
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createChallenge.fulfilled, (state, action) => {
      state.challenge = action.payload;
      state.state = AuthStateName.CHALLENGE_GENERATED;
    })
    builder.addCase(fetchTokens.pending, (state, action) => {
      if (state.state === AuthStateName.CHALLENGE_GENERATED) {
        state.state = AuthStateName.FETCHING_TOKENS
        state.tokensRequestId = action.meta.requestId
      }
    })
    builder.addCase(fetchTokens.rejected, (state, action) => {
      if (state.state === AuthStateName.FETCHING_TOKENS && state.tokensRequestId === action.meta.requestId) {
        state.state = AuthStateName.FAILED
        state.tokensRequestId = undefined
        state.challenge = undefined;
        state.tokens = undefined;
        state.tempCode = undefined;
      }
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

export const createChallenge = createAsyncThunk("auth/challenge", (_, { rejectWithValue }) => {
  const details = prepareLoginRedirect();
  if (!details) {
    return rejectWithValue("Create Challenge Failed");
  }
  return details;
});

export const fetchTokens = createAsyncThunk("auth/tokens", async (authorization_code: string, { getState, requestId, rejectWithValue }) => {
  const { auth } = getState() as { auth: AuthState };

  // Ensures it executes once at a time, which can happen with React Strict mode and double render.
  const guard = (auth.state === AuthStateName.FETCHING_TOKENS && auth.tokensRequestId === requestId)
  if (!guard) {
    return rejectWithValue("Request already in progress")
  }

  const response = await fetch(`${import.meta.env.VITE_LOGIN_COGNITO_HOST}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: import.meta.env.VITE_LOGIN_CLIENT_ID,
      code: authorization_code,
      code_verifier: auth.challenge!.code_verifier, 
      redirect_uri: `${window.location.origin}/authorize`
    })
  })

  if (response.ok) {
    return await response.json(); 
  } else {
    return rejectWithValue(response.body);
  }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;
