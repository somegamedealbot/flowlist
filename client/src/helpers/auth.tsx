import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export function useAuth(){
    const [isAuth, setIsAuth] = useState(false);
    const [cookies, ,] = useCookies(['connect.sid'])

    useEffect(() => {
        if (cookies["connect.sid"]){
            setIsAuth(true);
        }
        else{
            setIsAuth(false);
        }
    }, [cookies]);

    return isAuth;
}
