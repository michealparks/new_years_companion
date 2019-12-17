const express = require('express')
const fetch = require('node-fetch')
const querystring = require('querystring')
const app = express()

app.get('/login', function(req, res) {
  const id = '54cc80e5d45e4a6b8dfcc2afa3248692'
  const redirectURI = 'http://localhost:5000'
  const scopes = 'user-read-playback-state'

  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + id +
    '&scope=' + encodeURIComponent(scopes) +
    '&redirect_uri=' + encodeURIComponent(redirectURI)
  )
})

app.get('/', async (req, res) => {
  const code = req.query.code

  if (!code) {
    res.redirect('/login')
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify({
      code,
      client_id: '54cc80e5d45e4a6b8dfcc2afa3248692',
      client_secret: '1dbca77cfba24968b0d32979acfd7e15',
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:5000'
    })
  })

  const tokens = await response.json()

  res.send(render(tokens))
})

app.use(express.static('public'))

app.listen(5000, () => {
  console.log('App listening on port 5000')
})

const render = (tokens) => {
  return `
    <link href="https://fonts.googleapis.com/css?family=Major+Mono+Display|VT323&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="index.css">
  
    <iframe id="dance-iframe" src="https://dddance.party/"></iframe>

    <div id="spotify"></div>
  
    <script>
    window.spotify = {
      access_token: "${tokens.access_token}",
      refresh_token: "${tokens.refresh_token}",
      expires_in: "${tokens.expires_in}"
    }
    </script>
    <script async type="module" src="index.js"></script>
  `
}
