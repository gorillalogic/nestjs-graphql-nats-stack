/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_LOGIN_COGNITO_HOST: string;
  VITE_LOGIN_RESPONSE_TYPE: string;
  VITE_LOGIN_SCOPE: string;
  VITE_LOGIN_CLIENT_ID: string;
  VITE_LOGIN_CODE_CHALLENGE_METHOD: string;
  VITE_GRAPHQL_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
