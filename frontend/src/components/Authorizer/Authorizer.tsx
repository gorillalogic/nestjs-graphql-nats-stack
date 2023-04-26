import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { saveChallenge, fetchTokens, AuthStateName, clear } from '../../reducers/AuthReducer'
import { prepareLoginRedirect } from '../../lib/authentication';
import { RootState } from "../../configureStore";

export default function Authorizer() {
  const auth = useAppSelector((state: RootState) => state.auth);
  const { state: flowState } = auth;
  const dispatch = useAppDispatch();

  const prepareLogin = () => {
    if (auth.challenge){
      return
    }

    const preparationData = prepareLoginRedirect();
    const { url, codeVerifier, codeChallenge } = preparationData;
    if (url && codeVerifier && codeChallenge) {
      dispatch(saveChallenge({ url, codeVerifier, codeChallenge }))
    }
  }

  const redirectToLogin = (url: string) => {
    window.location.replace(url)
  }

  const authenticationCode : () => string | null = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    return params.get("code");
  }

  const requestTokens = (tempCode: string) => {
    dispatch(fetchTokens(tempCode));
  }

  const restartFlow = () => {
    dispatch(clear());
  }
  
  const completeFlow = () => {
    //window.location.href = "/";
  }

  useEffect(() => {
    console.log(flowState)
    if (flowState == AuthStateName.UNAUTHORIZED){
      prepareLogin();
      return
    }

    const authCode = authenticationCode();
    if (flowState == AuthStateName.CHALLENGE_GENERATED) {
      if (!authCode) {
        redirectToLogin(auth.challenge!.url);
      } else {
        requestTokens(authCode)
      }
      return
    }
  
    if (flowState == AuthStateName.AUTHORIZED) {
      completeFlow();
    }
  }, [auth.state])

  return (
    <>
      <li> { auth.tokens?.access_token ?? "Access Empty" } </li>
      <li> { auth.tokens?.refresh_token ?? "Refresh Empty" } </li>
      <li> { auth.challenge?.url } </li>
      <li> { auth.challenge?.codeVerifier } </li>
      <li> { auth.challenge?.codeChallenge } </li>
    </>
  )
}
