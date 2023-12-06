import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function GuestLayout() {
  const { auth } = useStateContext();

  if (auth) {
    if (auth.state && auth.verify && auth.token) {
      return <Navigate to={`/dashboard`} />;
    }
    else if (auth.verify && auth.token){
    return <Navigate to="/teampage" />;
    }
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}
