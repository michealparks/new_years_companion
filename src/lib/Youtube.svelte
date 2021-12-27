<script lang='ts'>

import { events } from '../util/events'

let loaded = false
let src: string

const endpoint = 'https://www.googleapis.com/youtube/v3/search'

const handleLoad = () => {
  loaded = true
}

const fetchVideo = async (song) => {
  loaded = false

  const queries = JSON.parse(localStorage.getItem('queries') ?? '{}')
  const query = `${song.name} ${song.artists[0].name} video`

  let result

  if (queries[query]) {
    console.log('cache hit')
    result = queries[query]
  } else {
    const creds = await (await fetch('/credentials')).json()
    const params = new URLSearchParams()
    params.set('part', 'snippet')
    params.set('q', query)
    params.set('key', creds.youtube)
    const json = await (await fetch(`${endpoint}?${params}`)).json()

    if (json.error) {
      return console.error(json.error.code, json.error.message)
    }

    result = json.items[0]
  }


  console.log('youtube', result.id.videoId, queries)

  src = `https://www.youtube.com/embed/${result.id.videoId}?&autoplay=1&mute=1&loop=1&showinfo=0&controls=0`

  queries[query] = result
  localStorage.setItem('queries', JSON.stringify(queries))
}

const handleEndingSoon = () => {
  loaded = false
}

events.on('song', fetchVideo)
events.on('song_ending_soon', handleEndingSoon)

</script>

<iframe
  title='music-video'
  {src}
  class='absolute inset-0 w-screen h-screen pointer-events-none -z-[1] scale-150 transition-opacity duration-[2000]'
  class:opacity-0={!loaded}
  class:opacity-100={loaded}
  class:delay-1000={loaded}
  class:delay-100={!loaded}
  on:load={handleLoad}
/>
