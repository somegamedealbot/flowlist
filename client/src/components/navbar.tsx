import { UserIcon } from "./icons";
import LogoutBtn from "./logoutBtn";

function NavBar() {
    return <nav className='block static 100vw outline outline-1 outline-cyan-500'>
        <div className='h-4/5'>
          <div className='flex h-20 px-4'>
            <div className='w-36 flex items-center'>
              <div className='mx-auto text-3xl text-purple-500'>Flowlist</div>
            </div>
            <div className='ml-10 w-1/2 flex items-center'>
              <div className="mx-5">
                <a className='text-cyan-600 hover:text-cyan-600' href='/home'>Home</a>
              </div>
              <div className="mx-5">
                <a className='text-cyan-600 hover:text-cyan-600' href='/youtube-playlists'>Youtube Playlists</a>
              </div>
              <div className="mx-5">
                <a className='text-cyan-600 hover:text-cyan-600' href='/spotify-playlists'>Spotify Playlists</a>
              </div>
              {/* <a onClick={() => navigate('/youtube-playlists')}>Youtube Playlists</a>
              <a onClick={() => navigate('/spotify-playlists')}>Spotify Playlists</a> */}
            </div>
            <div className='grow h-0'></div>
            <div className='min-w-min w-auto flex items-center'>
              <div className='mr-6 rounded-full bg-purple-500 border-2 border-black h-11 w-11 content-center justify-center flex items-center'>
                <UserIcon height="2rem" width="2rem"></UserIcon>
                {/* <a href="/signup"><button className='bg-purple-500 text-black'>Sign Up</button></a> */}
              </div>
              <div>
                <LogoutBtn></LogoutBtn>
              </div>
            </div>
          </div>
        </div>
      </nav>
}

export default NavBar