const express = require('express')
const fetch = require('node-fetch')
const querystring = require('querystring')
const app = express()

const id = '54cc80e5d45e4a6b8dfcc2afa3248692'
const secret = '1dbca77cfba24968b0d32979acfd7e15'
const redirectURI = 'http://localhost:5000/callback'

let code
let refreshToken

app.use(express.static('public'))

app.get('/token', async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      client_id: id,
      client_secret: secret,
      refresh_token: refreshToken
    })
  })
  const json = await response.json()

  console.log('/token', json)
})

app.get('/login', (req, res) => {
  const scopes = 'user-read-playback-state'

  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    `&client_id=${id}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectURI)}`
  )
})

app.get('/callback', async (req, res) => {
  code = code || req.query.code

  if (!code) {
    res.redirect('/login')
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify({
      code,
      redirectURI,
      client_id: id,
      client_secret: secret,
      redirect_uri: redirectURI,
      grant_type: 'authorization_code'
    })
  })
  const token = await response.json()

  refreshToken = token.refresh_token

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
    <link href="https://fonts.googleapis.com/css?family=Major+Mono+Display|VT323&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="index.css">
  
    <iframe id="dance-iframe" src="https://dddance.party/"></iframe>

    <div id="spotify"></div>
  
    <script>
    window.spotify = {
      access_token: "${token.access_token}",
      expires_in: "${token.expires_in}"
    }
    </script>
    <script async type="module" src="index.js"></script>
  `
}
