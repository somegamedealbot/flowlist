import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";

export function useAuth(){
    const [isAuth, setIsAuth] = useState(false);
    const cookies = new Cookies(null, {path: '/'});
    const sessionCookie = cookies.get('connect.sid');
    console.log(document.cookie);

    useEffect(() => {
        if (sessionCookie){
            setIsAuth(true);
        }
        else{
            setIsAuth(false);
        }
    }, [sessionCookie]);

    return isAuth;
}
