import { Cookies } from "react-cookie";

export function useAuth(){
    const cookies = new Cookies(null, {path: '/'});
    const sessionCookie = cookies.get('loggedIn');

    if (sessionCookie){
        return true
    }
    else{
        return false;
    }
}
