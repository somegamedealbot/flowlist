import axios from "axios"
import { YoutubeSvg } from "./icons";

function LinkYoutube(){

    return (
        <a href="" className="text-black hover:text-black" onClick={(event) => {
            event.preventDefault()
            axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/user/youtube-url`, {
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
            <div className="bg-purple-500  h-28 w-48 border-black border-2 rounded-md pl-2.5 pt-2">
                <YoutubeSvg height="2rem" width="2rem"></YoutubeSvg>
                <div className="pt-2">Link your Youtube account here</div>
            </div>
        </a>
    );
}

export default LinkYoutube;