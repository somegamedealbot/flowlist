import { useEffect, useState } from "react"
import { Config } from "../helpers/config";
import { useAuth } from "../components/auth";
import { useNavigate } from "react-router-dom";

interface PlaylistProps {
    apiService: string
}

interface PageInfo{
    totalResult: number,
    resultsPerPage: number
}

interface Snippet {
    thumbnails: {
        medium: {
            url: string
        }
    }
    localized: {
        title: string,
        description?: string
    }
}

interface YoutubePlaylist{ 
    id: string,
    snippet: Snippet
}

interface SpotifyPlaylist{
    description?: string,
    external_urls: {
        spotify?: string   
    },
    href: string,
    id: string,
    images?: {
        url: string
    }[],
    name: string,
    owner: {
        id: string
    }
}

// https://developers.google.com/youtube/v3/docs/playlists/list?apix=true
type YoutubePlaylists = {
    kind: string,
    nextPageToken?: string,
    prevPageToken?: string,
    pageInfo: PageInfo,
    items: YoutubePlaylist[]
}

// https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists
type SpotifyPlaylists = {
    href: string,
    items: SpotifyPlaylist[],
    limit: number,
    next?: string,
    previous?: string,
    total: number,
    offset: number // usually 0, index of the first playlist
}

type Playlists = SpotifyPlaylists | YoutubePlaylists;

function Playlists({apiService} : PlaylistProps){
    const [playlistsData, setPlaylistsData] = useState<Playlists>({} as Playlists);
    const navigate = useNavigate();
    const auth = useAuth();
    
    useEffect(() => {
        if (auth === false){
            navigate('/login')
        }

        Config.axiosInstance().get(`/user/${apiService}-playlists`)
        .then((res) => {
            setPlaylistsData(res.data);
        })
        .catch((err) => {
            console.log(err);
            if (err.response.data.sessionTimedOut === true){
                navigate('/login');
            }
        })
        
    }, [apiService, auth, navigate]);
    
    return <div>
        <div>Playlists</div>
        <div>
            {playlistsData ? playlistsData.items[0].id : 'no data'}
        </div>
    </div>
}

export default Playlists;