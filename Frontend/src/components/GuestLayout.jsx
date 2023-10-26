import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function GuestLayout()
 {
    const {auth} = useStateContext()

    if(auth)
    {
        
        return <Navigate to="/teampage" />
    }
    return (
       <div>
            <Outlet /> 
        </div>
    )
}