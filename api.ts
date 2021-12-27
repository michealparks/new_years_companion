import credentials from './credentials.js'
import express from 'express'
import fetch from 'node-fetch'
import crypto from 'crypto'

const app = express()
const PORT = 3000
const redirectURI = `http://localhost:${PORT}`

interface CurrentResponse {
  item: { duration_ms: number }
  error: unknown
  progress_ms: number
  is_playing: boolean
}

const ENDPOINTS = {
  authorize: 'https://accounts.spotify.com/authorize',
  getTokens: 'https://accounts.spotify.com/api/token',
  getCurrentSong: 'https://api.spotify.com/v1/me/player/currently-playing',
}

app.use(express.static('public'))

app.get('/refresh', async (req, res) => {
  const { refresh_token: token } = req.query

  if (typeof token !== 'string') {
    return res.send({
      error: true,
      message: 'Token not provided.',
    })
  }

  const params = new URLSearchParams()
  params.set('grant_type', 'refresh_token')
  params.set('client_id', credentials.spotify.id)
  params.set('client_secret', credentials.spotify.secret)
  params.set('refresh_token', token)

  try {
    res.json(await (await fetch(ENDPOINTS.getTokens, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })).json())
  } catch (error) {
    res.json({
      error,
      message: 'Error refreshing token.',
    })
  }
})

app.get('/current-song', async (req, res) => {
  const { code, access_token: token } = req.query

  let access_token: string
  let refresh_token: string

  if (typeof token === 'string') {
    access_token = token
  } else {
    if (typeof code !== 'string') {
      return res.send({
        error: true,
        message: 'Code not provided.'
      })
    }

    const params = new URLSearchParams()
    params.set('code', code)
    params.set('client_id', credentials.spotify.id)
    params.set('client_secret', credentials.spotify.secret)
    params.set('redirect_uri', redirectURI)
    params.set('grant_type', 'authorization_code')

    try {
      ({ access_token, refresh_token } = await (await fetch(ENDPOINTS.getTokens, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      })).json() as { access_token: string, refresh_token: string })
    } catch (error) {
      return res.json({
        error,
        message: 'Error fetching access token.'
      })
    }
  }

  try {
    const info = (await (await fetch(ENDPOINTS.getCurrentSong, {
      headers: { 'Authorization': `Bearer ${access_token}` }
    })).json()) as CurrentResponse

    console.log(info)
   
    if (info.error) {
      return res.json({
        error: info.error,
        message: 'Error fetching current song.'
      })
    }

    res.json({
      access_token,
      refresh_token,
      item: info.item,
      is_playing: info.is_playing,
      remaining: info.item.duration_ms - info.progress_ms,
    })

  } catch (error) {

    return res.json({
      error,
      message: 'Error fetching current song.'
    })

  }
})

app.get('/credentials', (_req, res) => {
  res.json({
    youtube: credentials.youtube,
  })
})

app.get('/login', (_req, res) => {
  const state = crypto.randomBytes(16).toString('hex').slice(0, 16)
  const params = new URLSearchParams()
  params.set('response_type', 'code')
  params.set('client_id', credentials.spotify.id)
  params.set('scope', 'user-read-playback-state')
  params.set('state', state)
  params.set('redirect_uri', redirectURI)

  res.redirect(`${ENDPOINTS.authorize}?${params.toString()}`)
})

export const handler = app
