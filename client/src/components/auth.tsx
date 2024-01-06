// import { useState } from "react";
import { Cookies } from "react-cookie";

export function useAuth(){
    // const [isAuth, setIsAuth] = useState(false);
    const cookies = new Cookies(null, {path: '/'});
    const sessionCookie = cookies.get('loggedIn');
    console.log(document.cookie);
    
    // useEffect(() => {
    if (sessionCookie){
        return true
    }
    else{
        return false;
    }
    // }, []);
}
