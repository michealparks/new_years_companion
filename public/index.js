const danceFrame = document.querySelector('#dance-iframe')

const fullscreenBtn = () => {
  const btn = document.createElement('button')
  btn.onclick = () => { document.body.requestFullscreen() }
  btn.id = 'fullscreen-btn'
  btn.textContent = 'FULLSCREEN'
  document.body.appendChild(btn)

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      btn.style.display = 'none'
      danceFrame.style.transform = 'scale(1.2)'
    } else {
      btn.style.display = ''
      danceFrame.style.transform = ''
    }
  })
}

const main = async () => {
  await import('./spotify.js')
  await import('./music-video.js')
  await import('./countdown.js')
  await import('./headlines.js')
  await import('./fireworks.js')

  fullscreenBtn()
  history.replaceState(null, '', '/')
}

main()
