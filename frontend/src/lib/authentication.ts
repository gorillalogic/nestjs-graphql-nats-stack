import pkceChallenge from "pkce-challenge";

interface PreparationLoginData {
  url: string,
  code_challenge: string,
  code_verifier: string,
};

export const prepareLoginRedirect : () => PreparationLoginData | undefined = () => {
  const { 
    VITE_LOGIN_COGNITO_HOST: host,
    VITE_LOGIN_CLIENT_ID: client_id,
    VITE_LOGIN_RESPONSE_TYPE: response_type,
    VITE_LOGIN_SCOPE: scope,
    VITE_LOGIN_CODE_CHALLENGE_METHOD: code_challenge_method,
  } = import.meta.env;
  if (!host || !client_id || !response_type || !scope || !code_challenge_method) {
    return
  }

  const { code_challenge, code_verifier } = pkceChallenge(128);

  // Endpoint fails if the scope does not use the '+' symbol.
  // URLSearchParams encodes it, so we are avoiding it for scope param.
  const params = new URLSearchParams({
    client_id,
    response_type,
    code_challenge_method,
    code_challenge: code_challenge, 
    redirect_uri: window.location.origin + "/authorize",
  }).toString() + `&scope=${scope}`
  const url = `${host}/login?${params}`

  return { url, code_challenge, code_verifier } 
}
