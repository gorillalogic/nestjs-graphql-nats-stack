import './App.css'
import { useSelector, useDispatch } from "react-redux";
import { saveJwt, clearJwt } from '../../reducers/AuthReducer'
import type { AuthState } from '../../reducers/AuthReducer';

function App() {
  const { tokens } : AuthState = useSelector((state: any) => state.auth)

  return (
    <>
      <li> { tokens?.access ?? "Access Empty" } </li>
      <li> { tokens?.refresh ?? "Refresh Empty" } </li>
    </>
  )
}

export default App
