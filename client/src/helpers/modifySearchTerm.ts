import { SpotifyTrack } from "./parsePlaylistsData";

const ytTitleRegexs = [/\(.*\)/g, /\[.*?\]/g, /\{.*\}/g, / - /g, / ft.?/gi, / feat.?/gi, /,/, /music video/gi, /official lyrics/gi, /official audio/gi, /official video/gi]; // for now, only check these

// modify youtube titles
export function modifyYoutubeTitle(term : string){
    // var forbbidenTerms = [/lyrics/gi, /audio/gi, /official lyrics/gi, /official audio/gi, /official video/gi, /explicit/gi, /clean/gi, /clean verison/gi] // might want to remove clean version and clean
    ytTitleRegexs.forEach(regex => {
    if (term.match(regex)){
            term = term.replace(regex, " ");
        }
    })
    return term;
}

export function modifySpotifyTitle(track: SpotifyTrack){
    let artistString = ''
    for (const artist of track.album.artists){
        artistString += artist.name + ' ';
    }
    return artistString + track.name;
}

// modify spotify titles

