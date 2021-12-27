import { fireworks } from './fireworks.js'

const fonts = [
  'Bangers',
  'Monoton',
  'Cinzel Decorative',
  'Faster One',
  'Bungee Shade',
  'Nosifer',
  'Monofett',
  'Hanalei',
  'Geostar',
  'Bungee Outline',
]

const oneMin = 1000 * 60
const oneHour = 1000 * 60 * 60
const oneDay = 1000 * 60 * 60 * 24

let curFonts = [...fonts]

const counter = document.createElement('div')
counter.id = 'counter'
document.body.appendChild(counter)

const largeCounter = document.createElement('div')
largeCounter.id ='large-counter'
document.body.appendChild(largeCounter)

let intervalId = -1
let lastSec = 0
let didFireworksInit = false


const year = new Date().getFullYear()

const update = () => {
  const remaining = new Date(`Mon Jan 1 ${year + 1}`) - new Date()

  if (remaining <= 0) {
    counter.textContent = 'HAPPY NEW YEAR'

    if (!didFireworksInit) {
      fireworks.init()

      didFireworksInit = true
    }

    clearInterval(intervalId)
    return
  }

  const days = remaining / 1000 / 60 / 60 / 24 | 0
  const hours = (remaining - (days * oneDay)) / 1000 / 60 / 60 | 0
  const min = (remaining - (days * oneDay) - (hours * oneHour)) / 1000 / 60 | 0
  const sec = (remaining - (days * oneDay) - (hours * oneHour) - (min * oneMin)) / 1000 | 0
  const ms = (remaining - (days * oneDay) - (hours * oneHour) - (min * oneMin) - (sec * 1000))
  const str = `${days}:${hours < 9 ? `0${hours}` : hours}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}:${ms < 10 ? `00${ms}` : ms < 100 ? `0${ms}` : ms}`

  if (days === 0 && hours === 0 && min === 0) {
    if (lastSec !== sec) {
      if (curFonts.length === 0) curFonts = [...fonts]
      const font = curFonts.pop()
      largeCounter.style.fontFamily = font
      lastSec = sec
    }

    largeCounter.textContent = sec
  }

  counter.textContent = str
}

intervalId = setInterval(update, 16)
