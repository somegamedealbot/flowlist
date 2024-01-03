/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_SERVICE_URL: string
    readonly VITE_APP_URL: string
    readonly VITE_SPOTIFY_CLIENT_ID: string
    readonly VITE_YOUTUBE_CLIENT_ID: string
    readonly VITE_SPOTIFY_REDIRECT_URI: string
    readonly VITE_YOUTUBE_REDIRECT_URI: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}