import Cookies from "js-cookie";
import { useContext } from "react";
import { createContext, useState } from "react";

    const StateContext = createContext({
        auth: null,
        setAuth: () =>{},
    })

    export const ContextProvider = ({children}) => {

    const [auth, _setAuth] = useState(localStorage.getItem('ACCESS_TOKEN'));


    const setAuth = (auth) => {
        _setAuth(auth)
        if(auth.token){
            localStorage.setItem('ACCESS_TOKEN',auth.token);
            localStorage.setItem("REFRESH_TOKEN",auth.refresh_token)
            localStorage.setItem("TIME",new Date());
            Cookies.remove('userEmail');
        }
        else{
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }
    return(
        <StateContext.Provider value={{ 
            auth,
            setAuth,
         }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);

// export const useStateContext