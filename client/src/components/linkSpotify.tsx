import axios from "axios"
import { SpotifySvg } from "./icons";

function LinkSpotify(){
    return (
    <a href="" className="text-black hover:text-black" onClick={(event) => {
        event.preventDefault()
        axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/user/spotify-url`, {
            withCredentials: true
        })
        .then(result => {
            console.log(result);
            window.location.replace(result.data.url);
        })
        .catch(err => {
            console.log(err);
            // handle error here
        })
    }}>
        <div className="bg-purple-500 h-28 w-48 border-black border-2 rounded-md pl-2.5 pt-2">
            <SpotifySvg height="2rem" width="2rem"></SpotifySvg>
            <div className="pt-2">Link your Spotify account here</div>
        </div>
    </a>
    );
}

export default LinkSpotify;