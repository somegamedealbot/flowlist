import { useEffect, useState } from "react"
import { Config } from "../helpers/config";
import { useAuth } from "../components/auth";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {Playlists, SpotifyPlaylists, YoutubePlaylists, parseSpotifyPlaylist, parseYoutubePlaylist } from "../helpers/parsePlaylistsData";

interface PlaylistProps {
    apiService: string
}

interface PageProps {
    apiService: string
}

interface StaticPageProps{
    pageData: Playlists,
    apiService: string,
}

function StaticPage({pageData, apiService} : StaticPageProps){
    // const [page, setPage] = useState(1);

    console.log(pageData);
    return <div>
        <div>Your {`${apiService}`} Playlists</div>
        <div>{pageData ? pageData.limit: 'no data'}</div>
    </div>
}

export function Page({apiService} : PageProps){
    
    const pageData : Playlists = useLoaderData() as Playlists;
    const navigate = useNavigate();
    const {page, } = useParams();

    const previousPage = () => {
        if (pageData.nextPage){
            navigate(`/${apiService}-playlists/${page ? parseInt(page)  + 1 : ''}/${pageData.nextPage}`);
        }
    }
    
    const nextPage = () => {
        if (pageData.prevPage){
            navigate(`/${apiService}-playlists/${page ? parseInt(page) - 1 : ''}/${pageData.nextPage}`);
        }
    }

    // console.log(pageData);
    return <div>
        <div>Your {`${apiService}`} Playlists</div>
        <div>{pageData ? pageData.limit: 'no data'}</div>
    </div>
}

export function Playlists({apiService} : PlaylistProps){
    const [playlistsData, setPlaylistsData] = useState<SpotifyPlaylists | YoutubePlaylists>({} as SpotifyPlaylists);
    
    // const [totalItems, setTotalItems] = 
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
        <StaticPage pageData={apiService === 'spotify' ? parseSpotifyPlaylist(playlistsData as SpotifyPlaylists)  : parseYoutubePlaylist(playlistsData as YoutubePlaylists)}
            apiService={apiService}></StaticPage>
    </div>
}