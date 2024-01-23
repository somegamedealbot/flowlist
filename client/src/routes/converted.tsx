import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../components/auth";

// interface ConvertedProps {

// }

export function Converted(){

    const auth = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    if (params.id === undefined || params.type === undefined){
        throw new Error('No playlist id given');
    }

    if (auth === false){
        navigate('/login');
    }

    const playlistUrl = params.type === 'spotify' ? 
    `https://open.spotify.com/playlist/${params.id}` : 
    `https://www.youtube.com/playlist?list=${params.id.trim()}`

    return <div>
        <div>Your playlist has been successfully converted</div>
        <div>
            <a href={playlistUrl}>Link to your new playlist</a>
        </div>
    </div>
}