
const spotify = document.querySelector('#spotify')
const dance = document.querySelector('#dance-iframe')

const headlines = async () => {
  const headline = document.createElement('div')
  headline.id = 'headline'
  document.body.appendChild(headline)

  const response = await window.fetch('https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=2019&format=json&origin=*')
  const json = await response.json()
  const html = (new DOMParser().parseFromString(json.parse.text['*'], 'text/html'))
  const items = html.querySelectorAll('.mw-parser-output h3 ~ ul > li')
  const events = []

  for (const item of items) {
    const ul = item.querySelector('ul')

    if (ul) {
      for (const li of ul.querySelectorAll('li')) {
        events.push({
          date: item.querySelector('a').innerText,
          text: li.innerText.split('[').shift()
        })
      }
    } else {
      const [date, text] = item.innerText.split(' – ')

      if (date === 'December 17') break

      events.push({ date, text: text.split('[').shift() })
    }
  }

  const shuffle = (a) => {
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
  }

  const update = async () => {
    const { date, text } = events.pop()
    headline.innerHTML = `
      <h2>${date}</h2>
      <p>${text}</p>
    `
  }

  shuffle(events)
  update()
  setInterval(update, 1000 * 30)
}

const currentSong = () => {
  const update = async () => {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': `Bearer ${window.spotify.access_token}` }
    })
    const json = await response.json()
    const item = json.item
  
    spotify.innerHTML = `
      <div id="spotify-text">
        <p>${item.name}</p>
        <p>${item.artists.map(artist => `<span>${artist.name}</span>`).join()}</p>
        <p>${item.album.name} (${item.album.release_date.replace(/-/g, '/')})</p>
      </div>
    `

    spotify.style.backgroundImage = `url("${json.item.album.images[0].url}")`
  }

  const getNewToken = async () => {
    const response = await fetch('/token')
    const json = await response.json()

    window.spotify.access_token = json.access_token
  }

  update()
  setInterval(update, 1000 * 15)
  setInterval(getNewToken, (window.spotify.expires_in - 60) * 1000)
}

const fullscreenBtn = () => {
  const btn = document.createElement('button')
  btn.onclick = () => { document.body.requestFullscreen() }
  btn.id = 'fullscreen-btn'
  btn.textContent = 'FULLSCREEN'
  document.body.appendChild(btn)

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      btn.style.display = 'none'
      dance.style.transform = 'scale(1.2)'
    } else {
      btn.style.display = ''
      dance.style.transform = ''
    }
  })
}

const countdownTimer = () => {
  const counter = document.createElement('div')
  counter.id = 'counter'
  document.body.appendChild(counter)

  const oneMin = 1000 * 60
  const oneHour = 1000 * 60 * 60
  const oneDay = 1000 * 60 * 60 * 24

  const update = () => {
    const remaining = new Date('Mon Jan 1 2020') - new Date()
  
    if (remaining <= 0) {
      counter.textContent = 'HAPPY NEW YEAR'
      return
    }
    
    const days = remaining / 1000 / 60 / 60 / 24 | 0
    const hours = (remaining - (days * oneDay)) / 1000 / 60 / 60 | 0
    const min = (remaining - (days * oneDay) - (hours * oneHour)) / 1000 / 60 | 0
    const sec = (remaining - (days * oneDay) - (hours * oneHour) - (min * oneMin)) / 1000 | 0
    const ms = (remaining - (days * oneDay) - (hours * oneHour) - (min * oneMin) - (sec * 1000))
    const str = `${days}:${hours < 9 ? `0${hours}` : hours}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}:${ms < 10 ? `00${ms}` : ms < 100 ? `0${ms}` : ms}`
    counter.textContent = str
  }

  setInterval(update, 16)
}

currentSong()
fullscreenBtn()
countdownTimer()
headlines()