import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Config } from "../helpers/config";
import { Playlist, SearchResults, Track, TrackResult, extractSearchTokens, parsePlaylist, parseSpotifySearchResults, parseYoutubeSearchResults} from "../helpers/parsePlaylistsData";
import { useAuth } from "../components/auth";

type ConvertProps = {
    apiService: string
}

async function getConvertedData(apiService: string, searchTokens: string[]){
    let searchResult = await Config.axiosInstance().post(`user/convert-data?${new URLSearchParams({
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
        throw Error('did not receive search data');
    });

    return searchResult;
}

export function ConvertPlaylist(){
    const params = useParams();
    const auth = useAuth();
    const navigate = useNavigate();
    const [playlistData, setPlaylistData] = useState<Playlist>({} as Playlist);
    const [searchResult, setSearchResults] = useState<SearchResults>({} as SearchResults);
    const [converted, setConverted] = useState<boolean>(false);

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
            <div className="background-image-container">
                <img className="background-image" src={playlistData.imageUrl}></img>
            </div>
            <div className="nav">
                <button onClick={() => navigate(-1)}>&larr;</button>
                <button onClick={() => navigate('/home')}>Home</button>
            </div>
            <div className="convert-content">
                <div className="convert-page__info-container">
                    <div className="playlist-info">
                        <div className="playlist-info__img-container">
                            <img className="playlist-info__playlist-img" src={playlistData.imageUrl} alt="playlist-info__playlist-img"/>
                        </div>
                        <div className="playlist-info__info-container">
                            <div className="playlist-info__title">
                                <a href={playlistData.href}>{playlistData.title}</a>
                            </div>
                            <div className="playlist-info__track-count">{playlistData.tracks.length + ' Tracks'}</div>
                            {/* <div className="playlist-info__id">id: {playlistData.id}</div> */}
                            {/* {playlistData.description ? <p className="playlist-info__description">{playlistData.description}</p> : <div></div>} */}
                            <div className="convert-button">
                                <button onClick={async () => {
                                    if (params.type){
                                        const result = await getConvertedData(params.type, extractSearchTokens(playlistData));
                                        setConverted(true);
                                        console.log(result);
                                        setSearchResults(result);
                                    }
                                    else {
                                        throw Error('no playlist type given');
                                    }

                                }}>
                                    Convert
                                </button>
                            </div>
                        </div>
                    </div>
                    <CreatePlaylistForm converted={converted} tracksData={searchResult}></CreatePlaylistForm>
                </div>
                <div className="margin-spacing"></div>
                <div className="track-list">
                    {<TracksDisplay tracks={playlistData.tracks} searchResults={searchResult}></TracksDisplay>}
                </div>
            </div>
            
        </div>
    }
}

interface TracksProps {
    tracks: Track[]
    searchResults: SearchResults
}

interface TrackProp {
    track: Track,
    trackResult?: TrackResult,
    index: number
}

function TracksDisplay({tracks, searchResults} : TracksProps){
    return <div>
        {
            tracks.map((track, index) => {
                const trackResults = searchResults.results;
                return <Track key={index + track.id} track={track} trackResult={trackResults ? trackResults[index] : undefined} index={index}></Track>
            })
        }
    </div>
}

function Track({track, trackResult, index} : TrackProp){
    return <div id={track.id} className="track-list__row">
        <div className="track-list__position">{index + 1}</div>
        <div className="track-list__image-col">
            <img className="track-list__image" src={track.imageUrl} alt={track.title + '-img'} />
        </div>
        <div className="track-list__title-col">
            <a className="track-list__title" href={track.url}>{track.title}</a>
        </div>
        <div className="track-list__image-col"></div>
            <img className="track-list__image" src={trackResult ? 
                trackResult.primary.imageUrl : ''
            } alt={trackResult ? trackResult.primary.title + '-img' : 'placeholder'} />
        <div className="track-list__title-col">
            <a className="track-list__title" href={
                trackResult ? trackResult.primary.url : '#'    
            }>{trackResult ? trackResult.primary.title : 'Title'}</a>
        </div>
        <div className="track-list__small-col"><button>Edit</button></div>
    </div>
}

interface FormProps {
    tracksData : SearchResults
    converted : boolean
}

function CreatePlaylistForm({tracksData, converted} : FormProps){
    return <div className="convert-page__form">
        <form action="" method="post" onSubmit={(e) => {
            e.preventDefault();
            const input = new FormData(e.currentTarget);
            // console.log(input);
            const body = {
                title: input.get('title'),
                description: input.get('description'),
                tracks: tracksData.results.map((track) => {
                    return {
                        convertToken: track.primary.convertToken,
                        deleted: track.deleted
                    };
                }) 
            }
            console.log(body);
        }}>
            <div>
                <div>
                    <label htmlFor="title">New Playlist Title</label>
                </div>
                <input required={true} type="text" name="title"/>
            </div>
            <div>
                <div>
                    <label htmlFor="description">Description</label>
                </div>
                <input type="text" name="description"/>
            </div>
            <div>
                
                <label htmlFor="description">Private:</label>
                <input defaultChecked={true} type='checkbox' name="private"></input>
            </div>
            <button type="submit" disabled={converted ? false : true}>Create Playlist</button>
            {/* <input type="submit" value="Create Playlist" /> */}
        </form>
    </div>
}