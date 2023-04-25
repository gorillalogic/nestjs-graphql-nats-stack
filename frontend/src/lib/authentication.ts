import pkceChallenge from "pkce-challenge";

interface PreparationLoginData {
  url?: string,
  codeChallenge?: string,
  codeVerifier?: string,
};

export const prepareLoginRedirect = () : PreparationLoginData => {
  const { 
    VITE_LOGIN_ENDPOINT: endpoint,
    VITE_LOGIN_CLIENT_ID: client_id,
    VITE_LOGIN_RESPONSE_TYPE: response_type,
    VITE_LOGIN_SCOPE: scope,
    VITE_LOGIN_CODE_CHALLENGE_METHOD: code_challenge_method,
    VITE_LOGIN_REDIRECT_URI,
  } = import.meta.env;
  if (!endpoint || !client_id || !response_type || !scope || !code_challenge_method) {
    throw "Error retrieving env vars";
  }

  const { code_challenge, code_verifier } = pkceChallenge(128);

  // Endpoint fails if the scope does not use the '+' symbol.
  // URLSearchParams encodes it, so we are avoiding it for scope param.
  const params = new URLSearchParams({
    client_id,
    response_type,
    code_challenge_method,
    code_challenge: code_challenge, 
    redirect_uri: VITE_LOGIN_REDIRECT_URI ?? window.location.origin + "/authorize",
  }).toString() + `&scope=${scope}`
  const url = `${endpoint}?${params}`

  return { 
    url, 
    codeChallenge: code_challenge, 
    codeVerifier: code_verifier,
  }; 
}
