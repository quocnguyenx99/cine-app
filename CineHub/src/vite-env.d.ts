/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_API_IMGBB_KEY: string;
  // more env variables...
}

interface ImportMeta {
  env: ImportMetaEnv;
}
