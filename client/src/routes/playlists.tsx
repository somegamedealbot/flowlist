import { useEffect, useState } from "react"
import { Config } from "../helpers/config";
import { useAuth } from "../components/auth";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {MusicService, Playlists, SpotifyPlaylists, YoutubePlaylists, parsePlaylists } from "../helpers/parsing";
import NavBar from "../components/navbar";
import toast from "react-hot-toast";

interface PlaylistProps {
    apiService: MusicService
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
        const q = new URLSearchParams();
        if (pageData.prevPage) {
            q.append('token', pageData.prevPage)
            navigate(`/${apiService}-playlists/${page - 1}?${q.toString()}`);
        }
    }
    
    const nextPage = () => {
        const q = new URLSearchParams()
        if (pageData.nextPage) {
            q.append('token', pageData.nextPage)
            navigate(`/${apiService}-playlists/${page + 1}?${q.toString()}`);
        }
    }

    const renderPlaylists = () => {
        return pageData.items.map((item) => {
            return <div className="card" key={item.id}>
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

export function PlaylistsDisplay({apiService} : PlaylistProps){
    const [playlistsData, setPlaylistsData] = useState<SpotifyPlaylists | YoutubePlaylists>({} as SpotifyPlaylists);
    const navigate = useNavigate();
    const params = useParams();
    const q = useSearchParams()[0]
    const auth = useAuth();
    // console.log(q.toString())
    useEffect(() => {
        // console.log(q)
        if (auth === false){
            navigate('/login')
        }
        let url = ''
        if (Object.keys(params).length === 0 || params.page === '1'){
            url = `/user/${apiService}-playlists`;
        }
        else { 
            const token = q.get('token')
            url = `/user/${apiService}-playlists/?pageToken=${token}`
        }
        toast.promise(
            Config.axiosInstance().get(url)
            .then((res) => {
                setPlaylistsData(res.data);
            })
            .catch((err) => {
                // console.log(err);
                if (err.response && err.response.data.sessionTimedOut === true){
                    navigate('/login');
                }
                throw new Error('Unable to retrieve playlists');
            }),
            {
                loading: `Loading ${apiService} playlists...`,
                success: 'Playlists found',
                error: `Failed to retrieve ${apiService} playlists.`
            }

        )
        
    }, [apiService, auth, navigate, params, q]);
    
    return <div className="page-content">
        <NavBar></NavBar>
        {/* <div>Playlists</div>
        <button onClick={() => navigate('/home')}>Home</button> */}
        <StaticPage pageData={parsePlaylists(playlistsData, apiService)}
            apiService={apiService} page={params.page ? parseInt(params.page) : 1}></StaticPage>
    </div>
}