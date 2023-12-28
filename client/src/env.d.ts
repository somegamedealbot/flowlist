/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_SERVICE_URL: string
    readonly VITE_APP_API_URL: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}