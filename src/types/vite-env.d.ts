/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_ENV: string
  readonly VITE_DSC: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_TRUE_API: string
  readonly VITE_APP_REQUEST_API: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMeta
}
