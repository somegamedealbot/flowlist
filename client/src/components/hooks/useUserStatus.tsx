import axios from "axios";
import { useEffect, useState } from "react";

export function useUserState(){
    const [userAuth, setUserAuth] = useState(false);
    
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/user/`, {
          withCredentials: true
        })
        .then(() => {
        //   navigate('/home');
          setUserAuth(true);  
        })
        .catch(
            () => setUserAuth(false)
        )
    });

    return userAuth;

}
