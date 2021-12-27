# new_years_companion
An app that blends youtube, spotify, and wikipedia into an ungodly new years countdown and recap machine.

Recommended usage: place on an obnoxiously large screen from the hours of 8pm to 11:59:59pm New Years Eve.

### Prereqs
The following credentials must be obtained and a root-level `credentials.js` file must be created:

```js
export default {
  youtube: '...',
  spotify: {
    id: '...',
    secret: '...'
  },
  twitter: {
    key: '...',
    secret: '...',
    bearer: '...'
  }
}
```

### Getting Started

1. Get Pumped.
2. `npm install` & `npm start` you know da deal
3. Navigate like a salty sea dog to `localhost:3000/login`. This will connect the app to what you're currently playing on spotify. The [definitive best-of-2021-playlist](https://open.spotify.com/playlist/21XYYVREXgCUQGS0g0jhfm?si=0721cda1f7a9444b) is recommended.
6. Fullscreen and enjoy your party.
