import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface callbackProps {
    provider: string
}

export function CallbackHandle({provider} : callbackProps){
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        axios.post(`${import.meta.env.VITE_API_SERVICE_URL}/user/${provider}-handle`, {
                code: urlParams.get('code'),
                state: urlParams.get('state')
            }
        )
        .then(() => {
            navigate('/home');
        })
        .catch(() => {
            console.log('Unable to authenticate user');
            // or different error page tell user to go back home
            navigate('/home');
        })
    })

    return (
        <div>
            Handling response from {provider} Please Wait...
        </div>
    )
}