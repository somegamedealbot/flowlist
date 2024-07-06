import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../components/auth";
import NavBar from "../components/navbar";

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

    return <div className="w-full h-screen">
        <NavBar></NavBar>
        <div className="w-full flex items-center">
            <div className="mx-auto h-30 max-w-fit text-center">
                <div className="h-10"></div>
                <div>Your playlist has been successfully converted</div>
                <div className="h-5"></div>
                <div>
                    <a target="_blank" rel="noopener noreferrer" href={playlistUrl}>Link to your new playlist</a>
                </div>
            </div>
        </div>
    </div>
}