import { modifySpotifyTitle, modifyYoutubeTitle } from "./modifySearchTerm"

interface PageInfo{
    totalResults: number,
    resultsPerPage: number
}

interface Snippet {
    thumbnails: {
        medium: {
            url: string
        }
    }
    localized: {
        title: string,
        description?: string
    }
}

interface YoutubePlaylist{ 
    id: string,
    snippet: Snippet
}

type ModdedYoutubePlaylist = {
    id: string,
    snippet: Snippet,
    items: {
        contentDetails: {
            videoId: string
        },
        snippet: {
            thumbnails: {
                medium: {
                    url: string
                }
            },
            title: string,
            resourceId:{
                videoId: string
            },
        },

    }[]
}

export type SpotifyTrack = {
    name: string,
    uri: string,
    id: string,
    album: {
        artists: {
            name: string
        }[],
        images:{
            url: string
        }[]
    },
    external_urls: {
        spotify: string
    }
}

type ModdedSpotifyPlaylist = {
    description?: string,
    external_urls: {
        spotify?: string   
    },
    href: string,
    id: string,
    images: {
        url: string
    }[],
    name: string,
    owner: {
        id: string
    },
    tracks: {
        description?: string,
        track: SpotifyTrack
    }[]
}

export type Playlist = {
    imageUrl?: string,
    id: string,
    title: string,
    description?: string,
    href: string,
    tracks: Track[]
}

interface SpotifyPlaylist{
    description?: string,
    external_urls: {
        spotify?: string   
    },
    href: string,
    id: string,
    images: {
        url: string
    }[],
    name: string,
    owner: {
        id: string
    }
}

// https://developers.google.com/youtube/v3/docs/playlists/list?apix=true
export type YoutubePlaylists = {
    kind: string,
    nextPageToken?: string,
    prevPageToken?: string,
    pageInfo: PageInfo,
    items: YoutubePlaylist[]
}

// https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists
export type SpotifyPlaylists = {
    href: string,
    items: SpotifyPlaylist[],
    limit: number,
    next?: string,
    previous?: string,
    total: number,
    offset: number // usually 0, index of the first playlist
}

export type PlaylistOverview = {
    imageUrl?: string,
    id: string,
    title: string,
    description?: string
}

export type Playlists = {
    nextPage?: string,
    prevPage?: string,
    total: number,
    items: PlaylistOverview[],
    limit: number
}

export type Track = {
    id: string,
    convertToken: string,
    title: string,
    url: string,
    imageUrl?: string
    // duration: string
}

export function parseSpotifyPlaylist(playlists: SpotifyPlaylists){
    if (Object.keys(playlists).length === 0){
        return {
            total: 0,
            items: [],
            limit: 0
        };
    }
    const parsedPlaylists: Playlists = {
        nextPage: playlists.next,
        prevPage: playlists.previous,
        total: playlists.total,
        items: [],
        limit: playlists.limit
    }

    parsedPlaylists.items = playlists.items.map<PlaylistOverview>((item) => {
        const overview: PlaylistOverview = {
            imageUrl: item.images[0] ? item.images[0].url : undefined,
            id: item.id,
            title: item.name,
            description: item.description
        } 
        return overview;
    });

    return parsedPlaylists;
}

export function parseYoutubePlaylist(playlists: YoutubePlaylists){
    if (Object.keys(playlists).length === 0){
        return {
            total: 0,
            items: [],
            limit: 0
        };
    }
    const parsedPlaylists: Playlists = {
        nextPage: playlists.nextPageToken,
        prevPage: playlists.prevPageToken,
        total: playlists.pageInfo.totalResults,
        items: [],
        limit: playlists.pageInfo.resultsPerPage
    }

    parsedPlaylists.items = playlists.items.map<PlaylistOverview>((item) => {
        const overview: PlaylistOverview = {
            imageUrl: item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : undefined,
            id: item.id,
            title: item.snippet.localized.title,
            description: item.snippet.localized.description
        } 
        return overview;
    });

    return parsedPlaylists;
}

export function parsePlaylist(playlist: ModdedYoutubePlaylist | ModdedSpotifyPlaylist, service : string){
    if (service === 'spotify'){
        return parseSpotifyTracks(playlist as ModdedSpotifyPlaylist);
    }
    return parseYoutubeTracks(playlist as ModdedYoutubePlaylist);
}

export function parseYoutubeTracks(playlist: ModdedYoutubePlaylist){
    // if (Object.keys(playlist).length === 0){
    //     return {
    //         total: 0,
    //         items: [],
    //         limit: 0
    //     };
    // }

    const parsedPlaylist: Playlist = {
        imageUrl: playlist.snippet.thumbnails.medium.url,
        id: playlist.id,
        title: playlist.snippet.localized.title,
        description: playlist.snippet.localized.description,
        tracks: [],
        href: `https://www.youtube.com/watch?v=${playlist.id}`
    }
    const tracks: Track[] = playlist.items.map((track) => {
        console.log(track.snippet.thumbnails)
        return {
            id: track.snippet.resourceId.videoId,
            convertToken: modifyYoutubeTitle(track.snippet.title),
            title: track.snippet.title,
            url: `https://www.youtube.com/watch?v=${track.snippet.resourceId.videoId}`,
            imageUrl: track.snippet.thumbnails.medium ? track.snippet.thumbnails.medium.url : undefined
        }
    })
    parsedPlaylist.tracks = tracks;
    return parsedPlaylist;
}

// // add artists to titles
// function modifySpotifySearchToken(searchToken : string){

// }

// // remove any excess stuff
// function modifyYoutubeSearchToken(searchToken : string){
//     return modifyYoutubeTitle(searchToken);
// }

export function parseSpotifyTracks(playlist: ModdedSpotifyPlaylist){
    const parsedPlaylist: Playlist = {
        imageUrl: playlist.images[0].url,
        id: playlist.id,
        title: playlist.name,
        description: playlist.description,
        href: `https://open.spotify.com/track/${playlist.id}`,
        tracks: []
    }
    
    const tracks: Track[] = playlist.tracks.map((track) => {
        return {
            id: track.track.id,
            convertToken: modifySpotifyTitle(track.track),
            title: track.track.name,
            url: `https://open.spotify.com/track/${track.track.id}`,
            imageUrl: track.track.album.images[0] ? track.track.album.images[0].url : undefined
        }
    })
    parsedPlaylist.tracks = tracks;
    return parsedPlaylist;
}

export type TrackResult = {
    primary: Track;
    additional: Track[],
    deleted: boolean
}

export type SearchResults = {
    results: TrackResult[]
}

type SpotifySearchResults = {
    tracks: {
        tracks: {
            href: string,
            items: SpotifyTrack[] 
        }
        deleted? : boolean
    }[],
}

type YoutubeSearchResults = {
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

        }[],
    }[]
}

// type YoutubeSearchResults = {
//     tracks: []
// }

export function parseSpotifySearchResults(data: SpotifySearchResults){
    const playlist : SearchResults = {
        results: data.tracks.map((trackInfo) => {
            if (trackInfo.deleted){
                return {
                    primary: {
                        id: 'deleted-id',
                        convertToken: 'deleted',
                        title: 'deleted',
                        url: '#',
                        imageUrl: undefined
                    },
                    additional: [],
                    deleted: true
                }
            }
            const primary = trackInfo.tracks.items[0];
            const additional = trackInfo.tracks.items;
            return {
                primary: {
                    id: primary.id,
                    convertToken: primary.uri,
                    title: primary.name,
                    url: primary.external_urls.spotify,
                    imageUrl: primary.album.images[0] ? primary.album.images[0].url : undefined
                },
                additional: additional.map((option) => {
                    return {
                        id: option.id,
                        convertToken: option.uri,
                        title: option.name,
                        url: option.external_urls.spotify,
                        imageUrl: option.album.images[0] ? option.album.images[0].url : undefined
                    }
                }),
                deleted: false
            }
        })
    }
    return playlist;
}

export function parseYoutubeSearchResults(data: YoutubeSearchResults){
    const playlist : SearchResults = {
        results: data.tracks.map((track) => {
            const primary = track.videoRenderer[0];
            const additional = track.videoRenderer;
            return {
                primary: {
                    id: primary.videoId,
                    convertToken: primary.videoId,
                    title: primary.title.runs[0].text,
                    url: `https://www.youtube.com/watch?v=${primary.videoId}`,
                    imageUrl: primary.thumbnail.thumbnails[0] ? primary.thumbnail.thumbnails[0].url : undefined
                },
                additional: additional.map((renderer) => {
                    return {
                        id: renderer.videoId,
                        convertToken: renderer.videoId,
                        title: renderer.title.runs[0].text,
                        url: `https://www.youtube.com/watch?v=${renderer.videoId}`,
                        imageUrl: renderer.thumbnail.thumbnails[0] ? renderer.thumbnail.thumbnails[0].url : undefined
                    }
                }),
                deleted: false
            }
        })
    }

    return playlist
}

type ConvertData = {
    private: boolean,
    title: string,
    description? : string,
    tracks: string[]
}

export function toConvertData(searchData : SearchResults){
    const convertData : ConvertData = {
        private: false,
        title: 'test playlist',
        description: 'test description',
        tracks: searchData.results.map((trackData) => {
            return trackData.primary.convertToken
        })
    }
    return convertData;
}

export function extractSearchTokens(playlistData: Playlist){
    return playlistData.tracks.map((track) => {
        return track.convertToken
    })
}