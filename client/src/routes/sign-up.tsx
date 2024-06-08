
// import { useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import { extractFields } from '../helpers/formHelpers';
import { useEffect, useState } from 'react';
import fieldChecks from '../helpers/fieldChecks';

function SignUp() {
  const [emailWarning, setEmailWarning] = useState('');
  const [passwordWarning, setPasswordWarning] = useState('');
  const navigate = useNavigate();

  console.log(emailWarning);

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
      <div className='flex min-h-screen'>
        <div className='h-full filler'>
          <div className='min-h-screen w-full bg-purple-500 border-violet-100'></div>
        </div>
        <div className='h-full'>
          <div className='login-container'>
            <div className='mt-2 text-2xl mb-8'>Sign Up</div>
            <Form className='mx-auto w-full' method='post' onSubmit={
              (e) => {
                e.preventDefault();
                const fieldRecord = extractFields(e.target)
                axios.post(`${import.meta.env.VITE_API_SERVICE_URL}/signup`, JSON.stringify(fieldRecord),
                {
                  headers: {
                    'Content-Type': 'application/json' 
                  }
                })
                .then(res => {
                  console.log(res.data);
                  navigate('/login');
                })
                .catch(err => {
                  console.log(err);
                  // display error here
                })
              }
            }>
              <div className=''>
                  <div className='mb-2'>
                    <label htmlFor='email'>Email</label>
                  </div>
                  <div>
                    <input className='px-2 rounded h-8' type='text' name='email' 
                      onChange={
                        (e) => {setEmailWarning(fieldChecks.emailCheck(e.target.value))}
                      }>
                      </input>
                  </div>
                  {emailWarning.length !== 0 ? <div>{emailWarning}</div> : null}
              </div>
              <div className='h-5'></div>
              <div>
                  <div className='mb-2'>
                    <label htmlFor='password'>Password</label>
                  </div>
                  <div>
                    <input className='px-2 rounded h-8' type='password' name='password' 
                      onChange={
                        (e) => setPasswordWarning(fieldChecks.PasswordCheck(e.target.value, false))
                      }>
                      </input>
                  </div>
                  {passwordWarning.length !== 0 ? <div>{passwordWarning}</div> : null}
              </div>
              <div className='mt-8'>
                  <button type='submit'>Sign Up</button>
              </div>
            </Form>
            <div className='mt-10'>
              <a href='/login'>Already have an account? Create one here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp