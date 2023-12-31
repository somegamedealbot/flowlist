import axios from "axios"
import { useNavigate } from "react-router-dom";

function LogoutBtn(){

    const navigate = useNavigate();

    return (<div>
        <button onClick={() => {
            axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/logout`, {
                withCredentials: true
            })
            .then(result => {
                console.log(result);
                navigate('/login');
            })
            .catch(err => {
                console.log(err);
                // handle error here
            })
        }}>Logout</button>
    </div>);
}

export default LogoutBtn;