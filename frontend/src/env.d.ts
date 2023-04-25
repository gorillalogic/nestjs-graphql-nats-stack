/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_LOGIN_ORIGIN: string?;
  VITE_LOGIN_RESPONSE_TYPE: string?;
  VITE_LOGIN_SCOPE: string?;
  VITE_LOGIN_CLIENT_ID: string?;
  VITE_LOGIN_CODE_CHALLENGE_METHOD: string?;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
