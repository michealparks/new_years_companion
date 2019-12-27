const main = async () => {
  const state = await import('./state.js')

  const curSongBox = document.querySelector('#spotify')

  const update = async () => {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': `Bearer ${window.spotify.access_token}` }
    })
    const json = await response.json()
    const song = json.item

    if (!song) return

    state.dispatch({ type: 'UPDATE_SONG', value: { song } })

    console.log(song)
    curSongBox.innerHTML = `
      <div id="spotify-text">
        <p>${song.name}</p>
        <p>${song.artists.map(artist => `<span>${artist.name}</span>`).join()}</p>
        <p>${song.album.name} (${song.album.release_date.replace(/-/g, '/')})</p>
      </div>
    `

    curSongBox.style.backgroundImage = `url("${song.album.images[0].url}")`

    setTimeout(update, song.duration_ms + 100)
  }

  const refreshToken = async () => {
    const response = await fetch(`/refresh?token=${window.spotify.refresh_token}`)
    const json = await response.json()

    window.spotify.access_token = json.access_token
  }

  update()
  setInterval(update, 1000 * 10)
  setInterval(refreshToken, 60 * 1000 * 1)
}

main()