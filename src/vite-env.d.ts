/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Song {
  name: string
  artists: {
    name: string
  }[]
  album: {
    name: string
    release_date: string
    images: { url: string }[]
  }
}