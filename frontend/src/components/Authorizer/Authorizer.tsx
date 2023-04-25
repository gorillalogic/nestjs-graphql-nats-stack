import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveJwt, clearJwt, saveChallenge, clearChallenge, fetchTokens } from '../../reducers/AuthReducer'
import type { AuthState, AuthStateChallenge } from '../../reducers/AuthReducer';
import { prepareLoginRedirect } from '../../lib/authentication';

function prepareLogin() {
  const preparationData = prepareLoginRedirect();
  const { url, codeVerifier, codeChallenge } = preparationData;
  if (url && codeVerifier && codeChallenge) {
    const dispatch = useDispatch();
    dispatch(saveChallenge({ url, codeVerifier, codeChallenge }))
  }
}

function requestTokens(challenge: AuthStateChallenge){
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const tempCode = params.get("code");

  if (!tempCode) {
    console.error("Temporary Code missing");
    window.location.href = "/"
  } else {
    const dispatch = useDispatch();
    dispatch(fetchTokens());
  }
}

export default function Authorizer() {
  const auth : AuthState = useSelector((state: any) => state.auth);

  console.log(window.location.pathname)
  if (!auth.tokens && window.location.pathname !== "/authorize" && !auth.challenge){
    prepareLogin();
  } else if (!auth.tokens && window.location.pathname !== "/authorize" && auth.challenge) {
    window.location.replace(auth.challenge.url)
  } else if (!auth.tokens && window.location.pathname === "/authorize" && !auth.challenge) {
    console.error("Challenge data does not exist");
    window.location.href = "/";
  } else if (!auth.tokens && window.location.pathname === "/authorize" && auth.challenge) {
    requestTokens(auth.challenge)
  }

  return (
    <>
      <li> { auth.tokens?.access ?? "Access Empty" } </li>
      <li> { auth.tokens?.refresh ?? "Refresh Empty" } </li>
      <li> { auth.challenge?.url } </li>
      <li> { auth.challenge?.codeVerifier } </li>
      <li> { auth.challenge?.codeChallenge } </li>
    </>
  )
}
