import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useEffect } from "react";


export default function DefaultLayout()
 {

    const {auth, setAuth} = useStateContext()

    if(!auth){
        return <Navigate to="/signin" />
    }
    else{
        return (
            <>
                <Outlet />
            </>
        )

    }

    
}