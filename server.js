const credentials = require('./credentials')
const express = require('express')
const fetch = require('node-fetch')
const querystring = require('querystring')
const app = express()

const redirectURI = 'http://localhost:5000/callback'

app.use(express.static('public'))

app.get('/refresh', async (req, res) => {
  const refreshToken = req.query.token

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      client_id: credentials.spotify.id,
      client_secret: credentials.spotify.secret,
      refresh_token: refreshToken
    })
  })

  const json = await response.json()

  console.log('/token', json)

  res.json(json)
})

app.get('/login', (req, res) => {
  const scopes = 'user-read-playback-state'

  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    `&client_id=${credentials.spotify.id}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectURI)}`
  )
})

app.get('/callback', async (req, res) => {
  const { code } = req.query

  if (!code) {
    res.redirect('/login')
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify({
      code,
      client_id: credentials.spotify.id,
      client_secret: credentials.spotify.secret,
      redirect_uri: redirectURI,
      grant_type: 'authorization_code'
    })
  })
  const token = await response.json()

  res.send(render(token))
})

app.use((req, res) => {
  res.status(404).redirect('/login')
})

app.listen(5000, () => {
  console.log('App listening on port 5000')
})

const render = (token) => {
  return `
    <link href="https://fonts.googleapis.com/css?family=Bangers|Bungee+Outline|Bungee+Shade|Cinzel+Decorative|Faster+One|Geostar|Hanalei|Monofett|Monoton|Nosifer&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Major+Mono+Display|VT323&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="index.css">
  
    <iframe id="dance-iframe" src="https://dddance.party/"></iframe>

    <div id="spotify"></div>
  
    <script type="module">
    window.youtubeKey = "${credentials.youtube}"
  
    window.spotify = {
      access_token: "${token.access_token}",
      expires_in: "${token.expires_in}",
      refresh_token: "${token.refresh_token}"
    }
    </script>
    <script async type="module" src="index.js"></script>
  `
}
