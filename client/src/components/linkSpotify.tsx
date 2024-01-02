import axios from "axios"

function LinkSpotify(){

    return (<div>
        <button onClick={() => {
            axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/spotify-url`, {
                withCredentials: true
            })
            .then(result => {
                console.log(result);
                window.location.replace(result.data.url);
            })
            .catch(err => {
                console.log(err);
                // handle error here
            })
        }}>Link Spotify</button>
    </div>);
}

export default LinkSpotify;