import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LinkSpotify from "../components/linkSpotify";
import LinkYoutube from "../components/linkYoutube";
import NavBar from "../components/navbar";

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

    return <div className="w-screen h-screen">
      <NavBar></NavBar>
      <div className="ml-10 mt-5">
        <div className="text-4xl">Dashboard</div>
        <div className="mt-3 items-center">
          <div>To start using Flowlist, first connect your music services</div>
        </div>
      </div>
      <div>
      </div>
      <div className="container mx-auto h-2/3 content-center">
        <div className="mx-auto link-box flex columns-2">
          <div className="w-48 mx-auto">
            <LinkSpotify></LinkSpotify>
          </div>
          <div className="w-48 mx-auto">
            <LinkYoutube></LinkYoutube>
          </div>
        </div>
      </div>
    </div>
}

export default Home;