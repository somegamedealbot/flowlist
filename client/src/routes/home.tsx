import { useEffect } from "react";
import LogoutBtn from "../components/logoutBtn";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LinkSpotify from "../components/linkSpotify";
import LinkYoutube from "../components/linkYoutube";

function Home(){ 
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/user/`, {
          withCredentials: true
        })
        .then(() => {
        })
        .catch(
            () => navigate('/login')
          // do nothing
        )
      }, [navigate])

    return <div>
      <div>
        <button onClick={() => navigate('/youtube-playlists')}>Youtube Playlists</button>
        <button onClick={() => navigate('/spotify-playlists')}>Spotify Playlists</button>
      </div>
      <div>
          <LinkSpotify></LinkSpotify>
          <LinkYoutube></LinkYoutube>
          <LogoutBtn></LogoutBtn>
      </div>
    </div>
}

export default Home;