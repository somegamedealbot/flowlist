import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Config } from "../helpers/config";
import { Playlist, SearchResults, Track, TrackResult, extractSearchTokens, parsePlaylist, parseSpotifySearchResults, parseYoutubeSearchResults} from "../helpers/parsePlaylistsData";
import { useAuth } from "../components/auth";
import { EditModal } from "../components/editModal";

// type ConvertProps = {
//     apiService: string
// }

function getConvertedType(apiService : string){
    if (apiService === 'spotify'){
        return 'youtube';
    }
    return 'spotify';
}

async function convert(apiService : string, convertData : object){
    apiService = getConvertedType(apiService);
    
    return await Config.axiosInstance().post(`user/convert?${new URLSearchParams({
        type: apiService
    }).toString()}`, convertData)
    .then((res) => {
        const playlistId = res.data.id;
        return playlistId;
    })
    .catch((err) => {
        console.log(err);
        return undefined;
        // throw new Error('unable to create playlist');
    })
}

async function getConvertedData(apiService: string, searchTokens: string[]){
    const searchResult = await Config.axiosInstance().post(`user/convert-data?${new URLSearchParams({
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

interface EditContextObj {
    editing: boolean,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>
}

const EditContext = createContext({
    editing: false
} as EditContextObj);

export function ConvertPlaylist(){
    const params = useParams();
    const auth = useAuth();
    const navigate = useNavigate();
    const [playlistData, setPlaylistData] = useState<Playlist>({} as Playlist);
    const [searchResult, setSearchResults] = useState<SearchResults>({} as SearchResults);
    const [converted, setConverted] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);

    useEffect(() => {
        if (auth === false){
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
        return <div>
            <EditModal editing={editing} setEditing={setEditing}></EditModal>
            <div className="convert-page">
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
                        <CreatePlaylistForm apiService={params.type ? params.type : ''} converted={converted} tracksData={searchResult}></CreatePlaylistForm>
                    </div>
                    <div className="margin-spacing"></div>
                    <div className="track-list">
                        <EditContext.Provider value = {{editing, setEditing}}>
                            {<TracksDisplay tracks={playlistData.tracks} searchResults={searchResult}></TracksDisplay>}
                        </EditContext.Provider>
                    </div>
                </div>
                
            </div>
        </div> 
        
    }
}

interface TracksProps {
    tracks: Track[]
    searchResults: SearchResults,
    // setEditing: 
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
    const {editing, setEditing} = useContext(EditContext);
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
        <div onClick={() => {
            setEditing(true);
            console.log('set edit')
        }} className="track-list__small-col"><button>Edit</button></div>
    </div>
}

interface FormProps {
    tracksData : SearchResults
    converted : boolean
    apiService : string
}

function CreatePlaylistForm({tracksData, converted, apiService} : FormProps){
    const navigate = useNavigate();
    
    return <div className="convert-page__form">
        <form action="" method="post" onSubmit={async (e) => {
            e.preventDefault();
            const input = new FormData(e.currentTarget);
            // console.log(input);
            const body = {
                title: input.get('title')?.toString() ? input.get('title')?.toString() : '',
                description: input.get('description') ? input.get('description') : undefined,
                private: input.get('private') === 'on' ? true : false,
                tracks: tracksData.results.map((track) => {
                    return {
                        convertToken: track.primary.convertToken,
                        deleted: track.deleted
                    };
                }) 
            }
            // const body = Object.fromEntries(input);
            const playlistId = await convert(apiService, body);
            if (playlistId){
                navigate(`/converted/${getConvertedType(apiService)}/
                    ${playlistId.trim()}`);
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
                
                <label htmlFor="private">Private:</label>
                <input defaultChecked={true} type='checkbox' name="private"></input>
            </div>
            <button type="submit" disabled={converted ? false : true}>Create Playlist</button>
            {/* <input type="submit" value="Create Playlist" /> */}
        </form>
    </div>
}