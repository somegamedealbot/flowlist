import { useEffect, useState } from "react"
import { Config } from "../helpers/config";
import { useAuth } from "../components/auth";
import { useNavigate, useParams } from "react-router-dom";
import {Playlists, SpotifyPlaylists, YoutubePlaylists, parseSpotifyPlaylist, parseYoutubePlaylist } from "../helpers/parsePlaylistsData";
import { UserIcon } from "../components/icons";
import LogoutBtn from "../components/logoutBtn";

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
                    <img className="card__image overflow-clip" src={item.imageUrl} alt={item.id + '-img'} />
                    <a href="" className="card__image-overlay" onClick={(event) => {
                            event.preventDefault()
                            navigate(`/convert-playlist/${apiService}/${item.id}`)}
                        }>
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
        return <div className="w-full h-full">
            <div className="ml-10 mt-5">
                <div className="text-3xl">Your {`${apiService.charAt(0).toUpperCase() + apiService.slice(1)}`} Playlists</div>
            </div>
            <div className="card__grid mt-8">
                <div className="card__grid-container">
                    {renderPlaylists()}
                </div>
            </div>
            <div className="pagenation">
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
            <nav className='block static 100vw outline outline-1 outline-cyan-500'>
            <div className='h-4/5'>
            <div className='flex h-20 px-4'>
                <div className='w-36 flex items-center'>
                <div className='mx-auto text-3xl text-purple-500'>Flowlist</div>
                </div>
                <div className='ml-10 w-1/2 flex items-center'>
                <div className="mx-5">
                    <a className='text-cyan-600 hover:text-cyan-600' href='/home'>Home</a>
                </div>
                <div className="mx-5">
                    <a className='text-cyan-600 hover:text-cyan-600' href='/youtube-playlists'>Youtube Playlists</a>
                </div>
                <div className="mx-5">
                    <a className='text-cyan-600 hover:text-cyan-600' href='/spotify-playlists'>Spotify Playlists</a>
                </div>
                {/* <a onClick={() => navigate('/youtube-playlists')}>Youtube Playlists</a>
                <a onClick={() => navigate('/spotify-playlists')}>Spotify Playlists</a> */}
                </div>
                <div className='grow h-0'></div>
                <div className='min-w-min w-auto flex items-center'>
                <div className='mr-6 rounded-full bg-purple-500 border-2 border-black h-11 w-11 content-center justify-center flex items-center'>
                    <UserIcon height="2rem" width="2rem"></UserIcon>
                    {/* <a href="/signup"><button className='bg-purple-500 text-black'>Sign Up</button></a> */}
                </div>
                <div>
                    <LogoutBtn></LogoutBtn>
                </div>
                </div>
            </div>
            </div>
        </nav>
        {/* <div>Playlists</div>
        <button onClick={() => navigate('/home')}>Home</button> */}
        <StaticPage pageData={apiService === 'spotify' ? parseSpotifyPlaylist(playlistsData as SpotifyPlaylists)  : parseYoutubePlaylist(playlistsData as YoutubePlaylists)}
            apiService={apiService} page={params.page ? parseInt(params.page) : 1}></StaticPage>
    </div>
}