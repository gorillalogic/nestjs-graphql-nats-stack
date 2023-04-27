import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { createChallenge ,fetchTokens, testGraphAuth, AuthStateName } from '../../reducers/AuthReducer'
import { RootState } from "../../configureStore";

export default function Authorizer() {
  const auth = useAppSelector((state: RootState) => state.auth);
  const { state: flowState } = auth;
  const dispatch = useAppDispatch();

  const authenticationCode : () => string | null = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    return params.get("code");
  }

  useEffect(() => {
    console.log(flowState);
    if (flowState === AuthStateName.AUTHORIZED) {
      dispatch(testGraphAuth());
      return;
    }

    if (flowState === AuthStateName.UNAUTHORIZED){
      dispatch(createChallenge())
      return
    }

    const authCode = authenticationCode();
    if (flowState === AuthStateName.CHALLENGE_GENERATED) {
      if (!authCode) {
        window.location.replace(auth.challenge!.url)
      } else {
        dispatch(fetchTokens(authCode));
      }
      return
    }

  }, [auth.state])

  return (
    <>
      <li> { auth.tokens?.access_token ?? "Access Empty" } </li>
      <li> { auth.tokens?.refresh_token ?? "Refresh Empty" } </li>
      <li> { auth.challenge?.url } </li>
      <li> { auth.challenge?.code_verifier } </li>
      <li> { auth.challenge?.code_challenge } </li>
    </>
  )
}
