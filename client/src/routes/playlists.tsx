import { useEffect, useState } from "react"
import { Config } from "../helpers/config";
import { useAuth } from "../components/auth";
import { useNavigate, useParams } from "react-router-dom";
import {Playlists, SpotifyPlaylists, YoutubePlaylists, parseSpotifyPlaylist, parseYoutubePlaylist } from "../helpers/parsePlaylistsData";

interface PlaylistProps {
    apiService: string
}

interface StaticPageProps{
    pageData: Playlists,
    apiService: string,
    page: number
}

function StaticPage({pageData, apiService, page} : StaticPageProps){

    console.log(pageData);
    const navigate = useNavigate();

    const previousPage = () => {
        if (pageData.prevPage){
            navigate(`/${apiService}-playlists/${page - 1}/${pageData.nextPage}`);
        }
    }
    
    const nextPage = () => {
        if (pageData.nextPage){
            navigate(`/${apiService}-playlists/${page + 1}/${pageData.nextPage}`);
        }
    }

    const renderPlaylists = () => {
        return pageData.items.map((item) => {
            return <div className="card" id={item.id}>
            <div className="card__container">
                <div className="card__image-container">
                    <img className="card__image" src={item.imageUrl} alt={item.id + '-img'} />
                    <a className="card__image-overlay" onClick={() => navigate(`/convert-playlist/${apiService}/${item.id}`)}>
                        <div className="card__overlay-text-container">
                            <span className="card__image-overlay-text">Convert</span>
                        </div>
                    </a>
                </div>
                <div className="card__title">
                    <span>{item.title}</span>
                </div>
            </div>
        </div>
        })
    };

    if (pageData.items.length === 0){
        return <div></div>
    }
    else{
        return <div>
            <div>Your {`${apiService}`} Playlists</div>
            <div className="card__grid-container">
                {renderPlaylists()}
            </div>
            <div>
                <div className="pagenation__container">
                    <button disabled={pageData.prevPage ? false : true } className="pagenation__nav-btn" onClick={() => previousPage()}>&larr;</button>
                        <div className="pagenation__page">
                            <span>Page {page}</span>
                        </div>
                    <button disabled={pageData.nextPage ? false : true } className="pagenation__nav-btn" onClick={() => nextPage()}>&rarr;</button>
                </div>
            </div>
        </div>
    }

}

export function Playlists({apiService} : PlaylistProps){
    const [playlistsData, setPlaylistsData] = useState<SpotifyPlaylists | YoutubePlaylists>({} as SpotifyPlaylists);
    const navigate = useNavigate();
    const params = useParams();
    const auth = useAuth();
    
    useEffect(() => {
        if (auth === false){
            navigate('/login')
        }
        let url = ''
        if (Object.keys(params).length === 0 || params.page === '1'){
            url = `/user/${apiService}-playlists`;
        }
        else {
            url = `/user/${apiService}-playlists/?pageToken=${params.token}`
        }
        Config.axiosInstance().get(url)
        .then((res) => {
            setPlaylistsData(res.data);
        })
        .catch((err) => {
            console.log(err);
            if (err.response.data.sessionTimedOut === true){
                navigate('/login');
            }
        })
        
    }, [apiService, auth, navigate, params]);
    
    return <div className="page-content">
        <div>Playlists</div>
        <button onClick={() => navigate('/home')}>Home</button>
        <StaticPage pageData={apiService === 'spotify' ? parseSpotifyPlaylist(playlistsData as SpotifyPlaylists)  : parseYoutubePlaylist(playlistsData as YoutubePlaylists)}
            apiService={apiService} page={params.page ? parseInt(params.page) : 1}></StaticPage>
    </div>
}