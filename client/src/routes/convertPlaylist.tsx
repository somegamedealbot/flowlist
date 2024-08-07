import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Config } from "../helpers/config";
import { MusicService, Playlist, SearchResults, Track, TrackResult, extractSearchTokens, parsePlaylist, parseSearchResults} from "../helpers/parsing";
import { useAuth } from "../components/auth";
import { EditModal } from "../components/editModal";
import toast from "react-hot-toast";

function getConvertedType(apiService : string){
    if (apiService === 'spotify'){
        return 'youtube';
    }
    return 'spotify';
}

async function convert(apiService : string, convertData : object){
    apiService = getConvertedType(apiService);
    return await toast.promise(
        Config.axiosInstance().post(`user/convert?${new URLSearchParams({
            type: apiService
        }).toString()}`, convertData)
        .then((res) => {
            const playlistId : string = res.data.id;
            return playlistId;
        })
        .catch((err) => {
            console.log(err);
            throw new Error('Unable to create playlist');
            return undefined;
        }), 
        {
            loading: 'Creating new playlist...',
            success: 'Converted playlist created!',
            error: 'Could not create playlist.'
        }
    )
    .then((playlistId) => {
        return playlistId
    })
    .catch(() => {
        return undefined
    })
}

async function getConvertedData(apiService: MusicService, searchTokens: string[]){
    const searchResult = await toast.promise(
        Config.axiosInstance().post(`user/convert-data?${new URLSearchParams({
        type: apiService
        }).toString()}`, {searchTokens: searchTokens})
        .then((res) => {
            console.log(res.data);
            return parseSearchResults(res.data, getConvertedType(apiService))
        })
        .catch((err) => {
            console.log(err);
            return undefined
        }),
        {
            loading: 'Converting playlist...',
            success: 'Converted!',
            error: 'Could not convert playlist.'
        }
    )
    
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
    const [editIndex, setEditIndex] = useState<number>(0);

    const service = params.type as MusicService

    useEffect(() => {
        if (auth === false){
            navigate('/login');
        }

        if (!(service && params.playlistId)){
            throw new Error('playlistId or playlist type missing');
        }
        const urlParams = new URLSearchParams({
            type: service,
            playlistId: params.playlistId
        });
        
        Config.axiosInstance().get(`/user/playlist?${urlParams}`)
        .then((res) => {
            console.log(res.data);
            if (service){
                setPlaylistData(parsePlaylist(res.data, service));
            }
            else {
                throw new Error('no playlist type given');
            }
        })
        .catch((err) => {
            console.log(err);
            // error handler here
        })
    }, [setPlaylistData, params, auth, navigate, service])

    if (Object.keys(playlistData).length === 0){
        return <div></div>
    }
    else {
        return <div className="">
            <EditModal 
                editing={editing} setEditing={setEditing} editIndex={editIndex}
                searchResults={searchResult}
                setSearchResults={setSearchResults}
                searchService={getConvertedType(service)}
                ></EditModal>
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
                            <div className="h-4"></div>
                            <div className="playlist-info__img-container">
                                <img className="playlist-info__playlist-img" src={playlistData.imageUrl} alt="playlist-info__playlist-img"/>
                            </div>
                            <div className="playlist-info__info-container">
                                <div className="playlist-info__title">
                                    <a href={playlistData.href}>{playlistData.title}</a>
                                </div>
                                <div className="playlist-info__track-count">{playlistData.tracks.length + ' Tracks'}</div>
                                <div className="convert-button">
                                    <button disabled={converted ? true : false} onClick={async () => {
                                        if (service){
                                            const result = await getConvertedData(service, extractSearchTokens(playlistData));
                                            if (result){
                                                setConverted(true);
                                                console.log(result);
                                                setSearchResults(result);
                                            }
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
                        <CreatePlaylistForm apiService={service} converted={converted} tracksData={searchResult}></CreatePlaylistForm>
                    </div>
                    <EditContext.Provider value = {{editing, setEditing}}>
                        {<TracksDisplay 
                            playlistData={playlistData} 
                            searchResults={searchResult}
                            setPlaylistData={setPlaylistData}
                            setSearchResults={setSearchResults}
                            setEditIndex={setEditIndex}
                            ></TracksDisplay>}
                    </EditContext.Provider>
                </div>
                
            </div>
        </div> 
        
    }
}

interface TracksProps {
    playlistData: Playlist,
    searchResults: SearchResults,
    setSearchResults: React.Dispatch<React.SetStateAction<SearchResults>>,
    setPlaylistData: React.Dispatch<React.SetStateAction<Playlist>>,
    setEditIndex: React.Dispatch<React.SetStateAction<number>>
}

interface TrackProp {
    track: Track,
    playlistData: Playlist,
    searchResults: SearchResults,
    index: number,
    setSearchResults: React.Dispatch<React.SetStateAction<SearchResults>>,
    setPlaylistData: React.Dispatch<React.SetStateAction<Playlist>>,
    setEditIndex: React.Dispatch<React.SetStateAction<number>>
}

function TracksDisplay({searchResults, playlistData, setSearchResults, setPlaylistData, setEditIndex} : TracksProps){
    return <div className="track-list">
        {
            playlistData.tracks.map((track, index) => {
                // const trackResults = searchResults.results;
                return <TrackDisplay 
                    key={index + track.id} 
                    track={track}
                    playlistData={playlistData}
                    searchResults={searchResults}
                    // trackResult={trackResults ? trackResults[index] : undefined} 
                    index={index}
                    setSearchResults={setSearchResults}
                    setPlaylistData={setPlaylistData}
                    setEditIndex={setEditIndex}
                ></TrackDisplay>
            })
        }
    </div>
}

// copy the data
// modify the data
const swapTracksData = (index: number, playlistData: Playlist, searchResults: SearchResults, direction: number) =>{

    let swapPosition = index + direction
    
    // valid position to swap
    if (swapPosition < 0) {
        swapPosition = playlistData.tracks.length - 1
    }
    else if (swapPosition > playlistData.tracks.length - 1) {
        swapPosition = 0
    }

    const newPlaylistData: Playlist = ({} as Playlist);
    const newSearchResults: SearchResults = ({} as SearchResults);

    Object.assign(newPlaylistData, playlistData);
    Object.assign(newSearchResults, searchResults);

    const tracks: Track[] = newPlaylistData.tracks;
    const trackResults: TrackResult[] = newSearchResults.results;
    let holdTrack: Track = ({} as Track);
    let holdTrackRes: TrackResult = ({} as TrackResult);

    holdTrack = playlistData.tracks[index];
    holdTrackRes = searchResults.results[index];

    tracks[index] = tracks[swapPosition];
    trackResults[index] = trackResults[swapPosition];
    tracks[swapPosition] = holdTrack;
    trackResults[swapPosition] = holdTrackRes;

    console.log([newPlaylistData, newSearchResults]);
    
    return [newPlaylistData, newSearchResults] 

}

function TrackDisplay({track, playlistData, searchResults, index, setPlaylistData, setSearchResults, setEditIndex} : TrackProp){
    const {editing, setEditing} = useContext(EditContext);

    const trackResults = searchResults.results
    const trackResult = trackResults ? trackResults[index] : undefined

    return <div id={track.id} className="track-list__row">
        <div className="track-list__position">{index + 1}</div>
        <div className="track-list__track-pair">
            <div className="track-list__track">
                <img className="track-list__image" src={track.imageUrl} alt={track.title + '-img'} />
                <div className="track-list__title-col">
                    <a className="track-list__title" href={track.url}>{track.title}</a>
                </div>
            </div>
            <div className="track-list__track">
                <img className="track-list__image" src={trackResult ? 
                    trackResult.primary.imageUrl : ''
                } alt={trackResult ? trackResult.primary.title + '-img' : ''} />
                <div className="track-list__title-col">
                    <a className="track-list__title" href={
                        trackResult ? trackResult.primary.url : '#'    
                    }>{trackResult ? trackResult.primary.title : 'Title'}</a>
                </div>
            </div>
        </div>
        <div className="track-list__small-col justify-center">
            <div className="flex items-center">
                <button onClick={() => {
                    const [newPlaylist, newSearch] = swapTracksData(index, playlistData, searchResults, -1)
                    setPlaylistData(newPlaylist as Playlist)
                    setSearchResults(newSearch as SearchResults);
                }}>↑</button>
                
                <button
                    onClick={() => {
                        setEditing(true);
                        setEditIndex(index)
                    }}
                >Edit</button>
                
                <button onClick={() => {
                    const [newPlaylist, newSearch] = swapTracksData(index, playlistData, searchResults, 1)
                    setPlaylistData(newPlaylist as Playlist)
                    setSearchResults(newSearch as SearchResults);
                }}>↓</button>
            </div>
        </div>
    </div>
}

interface FormProps {
    tracksData : SearchResults
    converted : boolean
    apiService : MusicService
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
            const playlistId = await convert(apiService, body);
            console.log(playlistId);
            if (playlistId){
                navigate(`/converted/${getConvertedType(apiService)}/${playlistId}`);
            }
        }}>
            <div>
                <div>
                    <label htmlFor="title">New Playlist Title</label>
                </div>
                <input className='px-2 rounded h-8' required={true} type="text" name="title"/>
            </div>
            <div>
                <div>
                    <label htmlFor="description">Description</label>
                </div>
                <input className='px-2 rounded h-8' type="text" name="description"/>
            </div>
            <div>
                
                <label htmlFor="private">Private:</label>
                <input defaultChecked={true} type='checkbox' name="private"></input>
            </div>
            <button type="submit" disabled={converted ? false : true}>Create Playlist</button>
        </form>
    </div>
}