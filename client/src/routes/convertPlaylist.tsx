import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Config } from "../helpers/config";
import { Playlist, Track, extractSearchTokens, parsePlaylist, parseSearchResults, parseSpotifySearchResults, parseYoutubeSearchResults} from "../helpers/parsePlaylistsData";
import { useAuth } from "../components/auth";

type ConvertProps = {
    apiService: string
}

async function getConvertedData(apiService: string, searchTokens: string[]){
    await Config.axiosInstance().post(`user/convert-data?${new URLSearchParams({
        type: apiService
    }).toString()}`, {searchTokens: searchTokens})
    .then((res) => {
        console.log(res.data);
        if (apiService === 'spotify'){
            return parseYoutubeSearchResults(res.data)
        }
        else {
            return parseSpotifySearchResults(res.data);
        }
    })
    .catch((err) => {
        console.log(err);
    })
}

export function ConvertPlaylist(){
    const params = useParams();
    const auth = useAuth();
    const navigate = useNavigate();
    const [playlistData, setPlaylistData] = useState<Playlist>({} as Playlist);
    const [convertedData, setConvertedData] = useState<Playlist>({} as Playlist);

    useEffect(() => {
        if (!auth){
            navigate('/login');
        }

        if (!(params.type && params.playlistId)){
            throw new Error('playlistId or playlist type missing');
        }
        const urlParams = new URLSearchParams({
            type: params.type,
            playlistId: params.playlistId
        });
        
        Config.axiosInstance().get(`/user/playlist?${urlParams}`)
        .then((res) => {
            console.log(res.data);
            if (params.type){
                setPlaylistData(parsePlaylist(res.data, params.type));
            }
            else {
                throw new Error('no playlist type given');
            }
        })
        .catch((err) => {
            console.log(err);
            // error handler here
        })
    }, [setPlaylistData, params, auth, navigate])

    if (Object.keys(playlistData).length === 0){
        return <div></div>
    }
    else {
        return <div className="convert-page">
            <div className="convert-page-content">
                <div className="nav">
                    <button onClick={() => navigate(-1)}>&larr;</button>
                    <button onClick={() => navigate('/home')}>Home</button>
                </div>
                <div className="playlist-info">
                    <div className="playlist-info__img-container">
                        <img className="playlist-info__playlist-img" src={playlistData.imageUrl} alt="playlist-info__playlist-img"/>
                    </div>
                    <div className="playlist-info__info-container">
                        <div className="playlist-info__title">{playlistData.title}</div>
                        <div className="playlist-info__track-count">{playlistData.tracks.length + ' Tracks'}</div>
                        <div className="playlist-info__id">id: {playlistData.id}</div>
                        {playlistData.description ? <p className="playlist-info__description">{playlistData.description}</p> : <div></div>}
                    </div>
                </div>
                <div className="convert-button">
                    <button onClick={async () => {
                        if (params.type){
                            getConvertedData(params.type, extractSearchTokens(playlistData));
                        }
                        else {
                            throw Error('no playlist type given');
                        }

                    }}>
                        Convert
                    </button>
                </div>
                <div className="track-list">
                    {<TracksDisplay tracks={playlistData.tracks}></TracksDisplay>}
                </div>
            </div>
            <div className="background-image-container">
                <img className="background-image" src={playlistData.imageUrl}></img>
            </div>
        </div>
    }
}

interface TracksProps {
    tracks: Track[]
}

function TracksDisplay({tracks} : TracksProps){
    return <div>
        {
            tracks.map((track, index) => {
                return <div id={track.id} className="track-list__row">
                    <div className="track-list__position">{index + 1}</div>
                    <div className="track-list__image-col">
                        <img className="track-list__image" src={track.imageUrl} alt={track.title + '-img'} />
                    </div>
                    <div className="track-list__title-col">
                        <a className="track-list__title" href={track.url}>{track.title}</a>
                    </div>
                    <div className="track-list__image-col">Image</div>
                    <div className="track-list__title-col">Title</div>
                    <div className="track-list__small-col"><button>Edit</button></div>
                </div>
            })
        }
    </div>
}
