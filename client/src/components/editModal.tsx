import { useState } from "react"
import { MusicService, SearchResults, Track } from "../helpers/parsing";
import axios from "axios";
import { SpotifyTrack } from "../helpers/parsing";
import toast from "react-hot-toast";
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import {Tab} from '@headlessui/react';
// import 'react-tabs/style/react-tabs.css';


interface EditProps{
    editing: boolean,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>
    editIndex: number,
    searchResults: SearchResults,
    setSearchResults: React.Dispatch<React.SetStateAction<SearchResults>>,
    searchService: MusicService
}

type SpotifySearchResult = {
    tracks: {
        href: string,
        items: SpotifyTrack[] 
    }
}

type TrackSearchResults = {
    tracks: Track[]
}

type YoutubeSearchResult = {
    tracks: {
        videoRenderer: {
            videoId: string,
            thumbnail: {
                thumbnails: {
                    url: string
                }[]
            },
            title: {
                runs: {
                    text: string
                }[]
            },
        },
    }[]
}

type SearchResult = YoutubeSearchResult | SpotifySearchResult

const serviceMapping = {
    "youtube": (data : SearchResult) => {return data as YoutubeSearchResult},
    "spotify": (data : SearchResult) => {return data as SpotifySearchResult}
}

function parseSearchResult(service: string, data: SearchResult){
    let parsed : SearchResult = {} as SearchResult
    const parsedResults : TrackSearchResults = {} as TrackSearchResults;

    if (service == 'youtube'){
        parsed = serviceMapping["youtube"](data)
        const parsedTracks : Track[] = parsed.tracks.map((trackData) => {
            const renderer = trackData.videoRenderer
            return {
                id: renderer.videoId,
                convertToken: renderer.videoId,
                title: renderer.title.runs[0].text,
                url: `https://www.youtube.com/watch?v=${renderer.videoId}`,
                imageUrl: renderer.thumbnail.thumbnails[0] ? renderer.thumbnail.thumbnails[0].url : undefined
            }
        })
        parsedResults.tracks = parsedTracks
    }
    else {
        parsed = serviceMapping["spotify"](data);
        const parsedTracks : Track[] = parsed.tracks.items.map((trackData => {
            return {
                id: trackData.id,
                convertToken: trackData.uri,
                title: trackData.name,
                url: trackData.external_urls.spotify,
                imageUrl: trackData.album.images[0] ? trackData.album.images[0].url : undefined
            }
        }))
        parsedResults.tracks = parsedTracks;
    }
    return parsedResults;
}

type SearchDisplayProps = {
    trackSearchResult: TrackSearchResults,
    searchResults: SearchResults,
    editIndex: number,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>
    setSearchResults: React.Dispatch<React.SetStateAction<SearchResults>>,
    setSelected: React.Dispatch<React.SetStateAction<number>>
}

function SearchDisplay({trackSearchResult, editIndex, searchResults, setEditing, setSearchResults, setSelected}: SearchDisplayProps){
    console.log('search component')
    if (trackSearchResult.tracks) {
        return <div className="track-search-display px-2">
            {
                trackSearchResult.tracks.map((track, i) => {
                    return <div key={track.id} className="flex h-20 w-full items-center">
                        <div className="rounded-md w-16">
                            <img className="rounded border-2 border-black h-16 w-16 object-cover" src={track.imageUrl} alt="track-image"/>
                        </div>
                        <div className="w-4"></div>
                        <div className="flex-grow h-16">
                            <a className="text-white" href={track.url}>
                            <div className="track-search-title"><span className="">{track.title}</span>
                            </div>
                            </a>
                        </div>
                        <div className="w-5 min-w-fit">
                            <button onClick={() => {
                                setSelected(i);
                                const newSearchResults = Object.assign({}, searchResults);
                                newSearchResults.results[editIndex].primary = trackSearchResult.tracks[i]
                                setSearchResults(newSearchResults);
                                setEditing(false)
                                toast(`Changed conversion of song: ${newSearchResults.results[editIndex].primary.title}`)
                            }}>
                                Select
                            </button>
                        </div>
                    </div>
                })            
            }
        </div>
    }
    
    else {
        return <div className="track-search-display">
        </div>
    }
    
}

export function EditModal({editing, setEditing, editIndex, searchResults, setSearchResults, searchService} : EditProps){
    const [tab, setTab] = useState(0); // tabs if needed in the future
    const [searchTerm, setSearchTerm] = useState("")
    const [selected, setSelected] = useState<number>(0);
    const [trackSearchResult, setTrackSearchResult] = useState<TrackSearchResults>({} as TrackSearchResults)
    
    return <div className={`edit-modal ${!editing ? 'modal-hidden' : ''}`}
        onClick={(e) => {
            if (e.currentTarget == e.target){
                setEditing(false)
                console.log('clicked')
            }
        }}
    >
        <div className="edit-modal__container bg-purple-500">
            <div className="edit-modal__tabs-bar">
                <div>Manual Lookup</div>
            </div>
            <div className={`edit-modal__panel ${tab === 0 ? 'active' : ''}`}>
                <div className="lookup__input-bar">
                    <input className="rounded lookup__input" id="search-term-input" type="text" placeholder="Song Name"
                        onInput={(e) => {
                            setSearchTerm(e.currentTarget.value); 
                        }}>
                    </input>
                    <button onClick={() => {
                        toast.promise(
                        axios(`${import.meta.env.VITE_API_SERVICE_URL}/user/search?${new URLSearchParams({
                                type: searchService,
                                term: searchTerm
                            })}`, {
                            withCredentials: true
                        })
                        .then(result => {
                            const parsed = parseSearchResult(searchService, result.data as SearchResult);
                            setTrackSearchResult(parsed);
                            console.log(parsed);
                        })
                        .catch(err => {
                            console.log(err);
                            // handle error here
                        }),
                        {
                            loading: 'Searching song...',
                            success: 'Search done!',
                            error: 'Could not search song.'
                        }
                        )
                    }}>Search</button>
                </div>
                <SearchDisplay
                    trackSearchResult={trackSearchResult}
                    searchResults={searchResults}
                    setEditing={setEditing}
                    setSearchResults={setSearchResults}
                    setSelected={setSelected}
                    editIndex={editIndex}
                ></SearchDisplay>
            </div>
            <div className={`edit-modal__panel ${tab === 1 ? 'active' : ''}`}>
            </div>
        </div>
    </div>
}