
# Flowlist React App
## Overview

React app built with vite powering [Flowlist](https://flowlist.co)

Flowlist is a platform that allows users to convert playlists between music streaming platforms.

#### Supported Platforms
| Platforms| Convert To | Convert From |
| :---:   | :---: | :---: |
| YouTube |✔️|✔️|
| Spotify |✔️|✔️|


Currently, only Spotify and YouTube conversions are supported. More platforms might be added in the future.

## Running test app
1. Clone the test branch of the repo

2. Configure an `.env` file inside `client/` with constants used within the project. 

3. Clone and run the [test server](https://github.com/somegamedealbot/flowlist-server). Make sure the port number in urls align with the server port.

4. Install necessary packages and run vite app

```
npm install
npm run dev 
```
