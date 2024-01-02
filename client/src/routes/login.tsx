import '../App.css'
import { Form } from 'react-router-dom'
import { extractFields } from '../helpers/formHelpers';
import axios from 'axios';
import fieldChecks from '../helpers/fieldChecks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [emailWarning, setEmailWarning] = useState('');
  const [passwordWarning, setPasswordWarning] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_SERVICE_URL}/user/`, {
      withCredentials: true
    })
    .then(() => {
      navigate('/home');
    })
    .catch(
      // do nothing
      () => console.log('Not Auth')
    )
  }, [navigate]);

  return (
    <div className="App">
      <Form method='post' onSubmit={
        (e) => {
          e.preventDefault();
          const fieldRecord = extractFields(e.target)
          axios.post(`${import.meta.env.VITE_API_SERVICE_URL}/login`, JSON.stringify(fieldRecord),
          {
            headers: {
              'Content-Type': 'application/json' 
            },
            withCredentials: true
          })
          .then(res => {
            console.log(res.data);
            navigate('/home');
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
                  (e) => setPasswordWarning(fieldChecks.PasswordCheck(e.target.value, true))
                }>
                </input>
            </div>
            {passwordWarning.length !== 0 ? <div>{passwordWarning}</div> : null}
        </div>
        <div>
            <button type='submit'>Login</button>
        </div>
      </Form>
      <div>
        <a href='/'>Sign Up</a>
      </div>
    </div>
  )
}

export default Login