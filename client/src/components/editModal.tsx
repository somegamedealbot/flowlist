import { useState } from "react"
import { MusicService, SearchResults, Track } from "../helpers/parsing";
import axios from "axios";
import { SpotifyTrack } from "../helpers/parsing";
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import {Tab} from '@headlessui/react';
// import 'react-tabs/style/react-tabs.css';


interface EditProps{
    editing: boolean,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>
    editIndex: number,
    searchResults: SearchResults,
    setSearchResults: React.Dispatch<React.SetStateAction<SearchResults>>,
    searchService: string
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

function parseSearchResult(service: string, data: object){
    let parsed : SpotifySearchResult | YoutubeSearchResult = {} as YoutubeSearchResult
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

const serviceMapping = {
    "youtube": (data : object) => {return data as YoutubeSearchResult},
    "spotify": (data : object) => {return data as SpotifySearchResult}
}

type SearchDisplayProps = {
    trackSearchResult: TrackSearchResults,
    searchService: string,
    searchResults: SearchResults,
    setSearchResults: React.Dispatch<React.SetStateAction<SearchResults>>,
    setSelected: React.Dispatch<React.SetStateAction<number>>
}

function SearchDisplay({trackSearchResult, searchService, searchResults, setSearchResults, setSelected}: SearchDisplayProps){

}

export function EditModal({editing, setEditing, editIndex, searchResults, setSearchResults, searchService} : EditProps){
    const [tab, setTab] = useState(0); // tabs if needed in the future
    const [searchTerm, setSearchTerm] = useState("")
    const [selected, setSelected] = useState<number>(0);

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
                        axios(`${import.meta.env.VITE_API_SERVICE_URL}/user/search?${new URLSearchParams({
                                type: searchService,
                                term: searchTerm
                            })}`, {
                            withCredentials: true
                        })
                        .then(result => {
                            const parsed = parseSearchResult(searchService, result.data);
                            console.log(parsed);
                            // window.location.replace(result.data.url);
                        })
                        .catch(err => {
                            console.log(err);
                            // handle error here
                        })
                    }}>Search</button>
                </div>
            </div>
            <div className={`edit-modal__panel ${tab === 1 ? 'active' : ''}`}>

            </div>
        </div>
    </div>
}