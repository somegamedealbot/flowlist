import { SpotifyTrack } from "./parsing";

const ytTitleRegexs = [/\(.*\)/g, /\[.*?\]/g, /\{.*\}/g, / - /g, / ft.?/gi, / feat.?/gi, /,/, /music video/gi, /official lyrics/gi, /official audio/gi, /official video/gi]; // for now, only check these

// modify youtube titles
export function modifyYoutubeTitle(term : string){
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

