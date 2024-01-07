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