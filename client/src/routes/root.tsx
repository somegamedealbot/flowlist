
// import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../App.css'
// import { extractFields } from '../helpers/formHelpers';
import { useEffect } from 'react';
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
      <nav className='block static '>
        <div className='h-4/5'>
          <div className='flex h-20 px-4'>
            <div className='w-44 flex items-center'>
              <div>Flowlist</div>
            </div>
            <div className='ml-10 w-1/2 flex items-center'></div>
            <div className='grow h-0'></div>
            <div className='min-w-min w-auto flex items-center'>
              <div className='mr-6'>
                <a href="/signup"><button>Sign Up</button></a>
              </div>
              <div>
                <a href='/login'><button>Login</button></a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Root