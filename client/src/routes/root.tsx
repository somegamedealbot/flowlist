
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import { useEffect, useState } from 'react';
import { SpotifySvg, YoutubeSvg, SelectSvg, ConnectSvg, DoubleArrowSvg, CircleArrowsSvg} from '../components/icons'
import toast from 'react-hot-toast';

function Root() {
  // const [emailWarning, setEmailWarning] = useState('');
  // const [passwordWarning, setPasswordWarning] = useState('');
  const navigate = useNavigate();
  const [verified, setVerified] = useState<boolean>(false)
  // console.log(emailWarning);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/user/`, {
      withCredentials: true
    })
    .then(() => {
      navigate('/home');
      toast.success('Logged in.')
    })
    .catch(() => {
      setVerified(true)
      console.log('No session')
      // do nothing
    });
  }, [navigate]);

  if (verified === true){
    return (
      <div className="App">
        <nav className='block static 100vw outline outline-1 outline-cyan-500'>
          <div className='h-4/5'>
            <div className='flex h-20 px-4'>
              <div className='w-36 flex items-center'>
                <div className='mx-auto text-3xl text-purple-500'>Flowlist</div>
              </div>
              <div className='ml-10 w-1/2 flex items-center'></div>
              <div className='grow h-0'></div>
              <div className='min-w-min w-auto flex items-center'>
                <div className='mr-6'>
                  <a href="/signup"><button className='bg-purple-500 text-black text-nowrap'>Sign Up</button></a>
                </div>
                <div>
                  <a href='/login'><button className='text-cyan-400'>Login</button></a>
                </div>
              </div>
            </div>
          </div>
        </nav>
  
        <div className='large-background bg-cover'>
          <div className='h-24'></div>
          <div className='pt-20 text-center large-card drop-shadow-md mx-auto px-6 rounded-2xl bg-purple-400'>
            <div className='font-semibold text-zinc-950 text-5xl mb-16 block'>
              Convert Playlists Seamlessly
            </div>
            <div className='h-24 flex items-center mt-8'>
              <div className='flex container items-center w-96 mx-auto'>
                <div className='h-16 w-16 mx-auto'>
                  <SpotifySvg height='4rem' width='4rem'></SpotifySvg>
                </div>
                <div className='h-16 w-16 mx-auto'>
                  <DoubleArrowSvg></DoubleArrowSvg>
                </div>
                <div className='h-16 w-16 mx-auto'>
                  <YoutubeSvg height='4rem' width='4rem'></YoutubeSvg>
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
          <div className='h-24'></div>
        </div>
        <div className='h-24'></div>
        <div className='section bg-cover pt-16 text-purple-500'>
          <div>
            <div className='text-5xl ml-16 h-20 text-justify'>How it works</div>
          </div>
          <div className=''>
            <div className='columns-3 mt-10 text-lg text-center min-h-fit'>
              <div className='min-h-fit min-w-fit'>
                <div>
                  <ConnectSvg height='9rem' width='9rem' stroke='#922BE0'></ConnectSvg>
                </div>
                <div className=''>
                  <h2>Connect to your Youtube and Spotify accounts</h2>
                </div>
              </div>
              <div className='min-h-fit min-w-fit'>
                <div>
                  <SelectSvg height='9rem' width='9rem' stroke='#922BE0'></SelectSvg>
                </div>
                <div className=''>
                  <h2>Pick the playlist you want to convert</h2>
                </div>
              </div>
              <div className='min-h-fit min-w-fit'>
                <div>
                  <CircleArrowsSvg height='9rem' width='9rem' stroke='#922BE0'></CircleArrowsSvg>
                </div>
                <div>Convert!</div>
              </div>
            </div>
          </div>
        </div>
        <div className=' footer outline outline-1 outline-cyan-400 mt-20'>
        </div>
      </div>
    )
  }
  else {
    return <div></div>
  }

}

export default Root