import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../helpers/auth";

interface Props{
    children? : ReactNode
}

export function Auth({children} : Props){
    const auth = useAuth();
    const navigate = useNavigate();
    if (auth){
        return children
    }
    else {
        navigate('/login');
    }
}
