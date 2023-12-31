import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../helpers/auth";

interface Props{
    children? : ReactNode
}

export function Auth({children} : Props){
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (!auth){
            navigate('/login');
        }

    }, [auth, navigate]);

    if (auth){
        return children
    }
}
