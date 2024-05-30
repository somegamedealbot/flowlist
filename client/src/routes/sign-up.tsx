
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
      <Form method='post' onSubmit={
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
        <div>
            <label htmlFor='email'>Email</label>
            <div>
              <input type='text' name='email' 
                onChange={
                  (e) => {setEmailWarning(fieldChecks.emailCheck(e.target.value))}
                }>
                </input>
            </div>
            {emailWarning.length !== 0 ? <div>{emailWarning}</div> : null}
        </div>
        <div>
            <label htmlFor='password'>Password</label>
            <div>
              <input type='password' name='password' 
                onChange={
                  (e) => setPasswordWarning(fieldChecks.PasswordCheck(e.target.value, false))
                }>
                </input>
            </div>
            {passwordWarning.length !== 0 ? <div>{passwordWarning}</div> : null}
        </div>
        <div>
            <button type='submit'>Sign Up</button>
        </div>
      </Form>

      <div>
        <a href='/login'>Login</a>
      </div>
    </div>
  )
}

export default SignUp