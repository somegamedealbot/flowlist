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
    const page = 1;

    console.log(pageData);
    const navigate = useNavigate();

    const previousPage = () => {
        if (pageData.prevPage){
            navigate(`/${apiService}-playlists/${page + 1}/${pageData.nextPage}`);
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
                    <a className="card__image-overlay">
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
            <div>{pageData ? pageData.limit: 'no data'}</div>
            <div className="card__grid-container">
                {renderPlaylists()}
            </div>
            <div>
                <div className="pagenation__container">
                    <button disabled={page > 1? false : true } className="pagenation__nav-btn" onClick={() => previousPage()}>&larr;</button>
                        <div className="pagenation__page">
                            <span>Page 1</span>
                        </div>
                    <button className="pagenation__nav-btn" onClick={() => nextPage()}>&rarr;</button>
                </div>
            </div>
        </div>
    }

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
    
    return <div className="page-content">
        <div>Playlists</div>
        <StaticPage pageData={apiService === 'spotify' ? parseSpotifyPlaylist(playlistsData as SpotifyPlaylists)  : parseYoutubePlaylist(playlistsData as YoutubePlaylists)}
            apiService={apiService}></StaticPage>
    </div>
}