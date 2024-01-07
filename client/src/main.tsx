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
import {Playlists, Page} from './routes/playlists';
import { Config } from './helpers/config';
import { parseSpotifyPlaylist, parseYoutubePlaylist } from './helpers/parsePlaylistsData';
// import { Auth } from './routes/auth'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root></Root>,
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
    path: '/youtube-playlists',
    element: <Playlists apiService = 'youtube'></Playlists>,
    children: [
      {
        path: '/youtube-playlists/:page/:token',
        loader: async ({params}) => {
          const response = await Config.axiosInstance().get(`/user/youtube-playlists/?pageToken=${params.token}`);
          return parseYoutubePlaylist(response.data); 
        },
        element: <Page apiService='youtube'></Page>,
        errorElement: <ErrorPage></ErrorPage>
      }
    ],
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/spotify-playlists',
    element: <Playlists apiService = 'spotify'></Playlists>,
    children: [
      {
        path: '/spotify-playlists/:page/:token',
        loader: async ({params}) => {
          const response = await Config.axiosInstance().get(`/user/spotify-playlists/?pageToken=${params.token}`);
          return parseSpotifyPlaylist(response.data); 
        },
        element: <Page apiService='youtube' ></Page>,
        errorElement: <ErrorPage></ErrorPage>
      }
    ],
    errorElement: <ErrorPage></ErrorPage>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  // add strict mode back in production
  <RouterProvider router={router}></RouterProvider>,
)
