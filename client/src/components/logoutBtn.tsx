import axios from "axios"
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function LogoutBtn(){

    const navigate = useNavigate();

    return (<div>
        <button onClick={() => {
            axios.post(`${import.meta.env.VITE_API_SERVICE_URL}/logout`, {}, {
                withCredentials: true
            })
            .then(result => {
                console.log(result);
                navigate('/login');
            })
            .catch(err => {
                console.log(err);
                toast.error('Unable to log out');
            })
        }}>Logout</button>
    </div>);
}

export default LogoutBtn;