import './index.css'
import App from './App.svelte'
import { fullscreenable } from './util/fullscreen'

fullscreenable()

export default new App({
  target: document.getElementById('app')
})
