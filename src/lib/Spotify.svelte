<script lang='ts'>

import { events } from '../util/events'

let song: Song

const fetchSong = async () => {
  const access_token = localStorage.getItem('access_token')
  const params = new URLSearchParams()

  if (access_token) {
    params.set('access_token', access_token)
  } else {
    const search = new URLSearchParams(location.search)
    params.set('code', search.get('code'))
  }

  const json = await (await fetch(`/current-song?${params}`)).json()
  console.log(json)

  if (json.error?.message?.toLowerCase().includes('invalid access token')) {
    window.location = '/login'
  }

  if (json.error?.message?.toLowerCase().includes('access token expired')) {
    const refreshParams = new URLSearchParams()
    const refreshToken = localStorage.getItem('refresh_token')
    refreshParams.set('refresh_token', refreshToken)

    if (!refreshToken) {
      localStorage.clear()
      fetchSong()
      return
    }

    const res = await (await fetch(`/refresh?${refreshParams}`)).json()
    localStorage.setItem('access_token', res.access_token)
    return fetchSong()
  }

  song = json.item

  if (json.access_token) {
    localStorage.setItem('access_token', json.access_token)
  }

  if (json.refresh_token) {
    localStorage.setItem('refresh_token', json.refresh_token)
  }

  if (song) {
    events.fire('song', song)

    const remaining = json.remaining === 0 ? 1000 : json.remaining + 400
    
    setTimeout(fetchSong, remaining)

    if (remaining !== 0) {
      setTimeout(() => events.fire('song_ending_soon', {}), Math.max(remaining - 10 * 1000, 0))
    }
  } else {
    setTimeout(fetchSong, 1000 * 2)
  }
}

fetchSong()

</script>

{#if song}
  <div
    class='major-mono absolute left-12 bottom-12 w-80 h-80 bg-cover bg-center z-10'
    style='background-image:url("{song.album.images[0].url}")'
  >
    <div class='absolute left-full flex flex-col flex-wrap w-80 h-80 p-5 ml-5 border text-white backdrop-blur-sm'>
      <h2 class='text-3xl'>{song.name}</h2>
      {#each song.artists as artist (artist.name)}
        <p>{artist.name}</p>
      {/each}
      <p>{song.album.name}</p>
      <p>({song.album.release_date})</p>
    </div>
  </div>
{/if}
