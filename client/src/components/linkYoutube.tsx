import axios from "axios"

function LinkYoutube(){

    return (<div>
        <button onClick={() => {
            axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/user/youtube-url`, {
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
        }}>Link YouTube</button>
    </div>);
}

export default LinkYoutube;