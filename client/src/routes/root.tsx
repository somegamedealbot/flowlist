
// import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../App.css'
// import { extractFields } from '../helpers/formHelpers';
import { useEffect } from 'react';
import { SpotifySvg, YoutubeSvg, SelectSvg, ConnectSvg, DoubleArrowSvg, CircleArrowsSvg} from '../components/icons'
// import spotifySvg from '../assets/spotify-svgrepo-com.svg'
// import youtubeSvg from '../assets/youtube-svgrepo-com.svg'
// import doubleArrowSvg from '../assets/double-arrow-svgrepo-com.svg'

// import fieldChecks from '../helpers/fieldChecks';

function Root() {
  // const [emailWarning, setEmailWarning] = useState('');
  // const [passwordWarning, setPasswordWarning] = useState('');
  const navigate = useNavigate();

  // console.log(emailWarning);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/user/`, {
      withCredentials: true
    })
    .then(() => {
      navigate('/home');
    })
    .catch(err =>
      console.log(err)
      // do nothing
    )
  }, [navigate]);

  return (
    <div className="App">
      <nav className='block static 100vw outline outline-1 outline-white'>
        <div className='h-4/5'>
          <div className='flex h-20 px-4'>
            <div className='w-44 flex items-center'>
              <div className='mx-auto text-3xl text-purple-500'>Flowlist</div>
            </div>
            <div className='ml-10 w-1/2 flex items-center'></div>
            <div className='grow h-0'></div>
            <div className='min-w-min w-auto flex items-center'>
              <div className='mr-6'>
                <a href="/signup"><button className='bg-purple-500 text-black'>Sign Up</button></a>
              </div>
              <div>
                <a href='/login'><button className='text-cyan-400'>Login</button></a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className='mt-24'>
        <div className='pt-20 large-card drop-shadow-md mx-auto px-6 rounded-2xl bg-purple-400'>
          <div className='font-semibold text-zinc-950 text-5xl mb-16 block'>
            Convert Playlists Seamlessly
          </div>
          <div className='h-24 flex items-center mt-8'>
            <div className='flex container items-center w-96 mx-auto'>
              <div className='h-16 w-16 mx-auto'>
                <SpotifySvg></SpotifySvg>
              </div>
              <div className='h-16 w-16 mx-auto'>
                <DoubleArrowSvg></DoubleArrowSvg>
              </div>
              <div className='h-16 w-16 mx-auto'>
                <YoutubeSvg></YoutubeSvg>
              </div>
            </div>
          </div>
          <div className='text-zinc-950 mt-8'>
            <div>
              Flowlist is a tool that allows simple conversion of music playlists between Youtube and Spotify.
            </div>
          </div>
          <div className='mt-8'>
            <a href="/signup"><button className='text-black bg-purple-500'>Convert Now</button></a>
          </div>
        </div>
      </div>

      <div className='section bg-cyan-600 mt-40 pt-16 text-zinc-950'>
        <div>
          {/* <div className='mt-20 h-20'></div> */}
          <div className='text-5xl ml-16 h-20 text-justify'>How it works</div>
        </div>
        <div>
          <div className='columns-3 mt-10 text-lg px-10'>
            <div>
              <div>
                <ConnectSvg></ConnectSvg>
              </div>
              <div>Connect to your Youtube and Spotify accounts</div>
            </div>
            <div>
              <div>
                <SelectSvg></SelectSvg>
              </div>
              <div>Pick the playlist you want to convert</div>
            </div>
            <div>
              <div>
                <CircleArrowsSvg></CircleArrowsSvg>
              </div>
              <div>Convert!</div>
            </div>
          </div>
        </div>
      </div>
        

      <div className=' footer outline outline-1 outline-white mt-20'>

      </div>
    </div>
  )
}

export default Root