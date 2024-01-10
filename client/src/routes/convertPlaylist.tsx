import { useEffect } from "react";
import { useParams } from "react-router-dom"
import { Config } from "../helpers/config";

type ConvertProps = {
    apiService: string
}

export function ConvertPlaylist({apiService} : ConvertProps){
    const params = useParams();

    useEffect(() => {
        if (!(params.type && params.playlistId)){
            throw new Error('playlistId or playlist type missing');
        }
        const urlParams = new URLSearchParams({
            type: params.type,
            playlistId: params.playlistId
        });
        
        Config.axiosInstance().get(`/user/playlist/${urlParams}`)
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
            // error handler here
        })
    })
    return <div></div>
}

