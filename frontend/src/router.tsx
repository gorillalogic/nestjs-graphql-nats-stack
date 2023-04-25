import { createBrowserRouter } from "react-router-dom";
import RootRoute from './routes/RootRoute.tsx';
import AuthorizeRoute from "./routes/AuthorizeRoute.tsx";

export default createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
  },
  {
    path: "/authorize",
    element: <AuthorizeRoute/>,
  }
]);
