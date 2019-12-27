const danceFrame = document.querySelector('#dance-iframe')

let lastQuery = ''

const main = async () => {
  const state = await import('./state.js')

  const youtubeEmbed = document.createElement('iframe')
  youtubeEmbed.id = 'youtube-embed'
  youtubeEmbed.frameBorder = 0

  state.subscribe('UPDATE_SONG', ({ song }) => {
    console.log(song)
  })

  const update = async ({ song }) => {
    const query = `${song.name} ${song.artists[0].name} video`

    if (query === lastQuery) return

    const response = await window.fetch('https://www.googleapis.com/youtube/v3/search?' +
      '&part=snippet' +
      `&q=${query}` +
      `&key=${window.youtubeKey}`)

    const json = await response.json()

    youtubeEmbed.onload = () => {
      danceFrame.style.opacity = '0.75'
      youtubeEmbed.style.opacity = '1.0'
    }

    youtubeEmbed.style.opacity = '0.0'
    youtubeEmbed.src = `https://www.youtube.com/embed/${json.items[0].id.videoId}?&autoplay=1&mute=1&loop=1&showinfo=0&controls=0`

    lastQuery = query

    console.log(json)
  }

  state.subscribe('UPDATE_SONG', update)

  document.body.appendChild(youtubeEmbed)
}

main()
