import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import './index.css'
import ErrorPage from './routes/error-page';
import Login from './routes/login';
import Home from './routes/home';
import { CallbackHandle } from './components/callbackHandles';
import {Playlists} from './routes/playlists';
import { ConvertPlaylist } from './routes/convertPlaylist';
import { Converted } from './routes/converted';
import SignUp from './routes/sign-up';
import { Fonts } from './components/fonts'
// import { Auth } from './routes/auth'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/signup',
    element: <SignUp></SignUp>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/login',
    element: <Login></Login>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/home',
    element: 
      <Home></Home>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/spotify-callback',
    element: 
      <CallbackHandle provider='spotify'></CallbackHandle>
  },
  {
    path: '/youtube-callback',
    element: 
      <CallbackHandle provider='youtube'></CallbackHandle>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/youtube-playlists/:page?/:token?',
    element: <Playlists apiService = 'youtube'></Playlists>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/spotify-playlists/:page?/:token?', // ISSUE WITH ROUTE MATCHING MATCHING FOR TOKEN
    element: <Playlists apiService = 'spotify'></Playlists>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/convert-playlist/:type/:playlistId',
    element: <ConvertPlaylist></ConvertPlaylist>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/converted/:type/:id',
    element: <Converted></Converted>,
    errorElement: <ErrorPage></ErrorPage>
  }
  // {
  //   path: '/convert-playlist/:type/:playlistId',
  //   element: <ConvertPlaylist></ConvertPlaylist>,
  //   errorElement: <ErrorPage></ErrorPage>
  // },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  // add strict mode back in production
  <div>
    <Fonts></Fonts>
    <RouterProvider router={router}></RouterProvider>
  </div>
)
