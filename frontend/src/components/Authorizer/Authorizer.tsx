import { useSelector, useDispatch } from "react-redux";
import { saveJwt, clearJwt, saveChallenge } from '../../reducers/AuthReducer'
import type { AuthState } from '../../reducers/AuthReducer';
import { prepareLoginRedirect } from '../../lib/authentication';

function prepareLogin() {
  const preparationData = prepareLoginRedirect();
  const { url, codeVerifier, codeChallenge } = preparationData;
  if (url && codeVerifier && codeChallenge) {
    const dispatch = useDispatch();
    dispatch(saveChallenge({ url, codeVerifier, codeChallenge }))
  }
}

function redirectLogin(url: string) {
  window.location.replace(url)
}

const Authorizer : React.FC = () => {
  const auth : AuthState = useSelector((state: any) => state.auth);

  if (!auth.tokens && window.location.pathname !== "/authorize"){
    if (!auth.challenge) {
      prepareLogin();
    } else {
      redirectLogin(auth.challenge.url)
    }
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

export default Authorizer;
