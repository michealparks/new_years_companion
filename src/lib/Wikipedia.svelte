<script lang='ts'>

import { shuffle } from '../util/shuffle'

interface WikiEvent {
  date: string
  description: string
}

let shuffledEvents: WikiEvent[]
let event: WikiEvent

const fetchEvents = async () => {
  const year = new Date().getFullYear()
  const endpoint = `https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${year}&format=json&origin=*`
  const json = await (await fetch(endpoint)).json()
  const html = (new DOMParser().parseFromString(json.parse.text['*'], 'text/html'))
  const events: WikiEvent[] = []

  for (let i = 1; i < 13; i += 1) {
    const month = html.querySelector<HTMLUListElement>(`h3:nth-of-type(${i}) + ul`)
    const ul = month.querySelector('ul')

    if (ul) {
      for (const li of ul.querySelectorAll('li')) {
        const date = month.querySelector('a') ? month.querySelector('a').innerText : undefined
        const description = li.innerText.split('[').shift()

        if (!date || !description || description.length < 16) continue

        events.push({ date, description })
      }
    } else {
      const [date, rawText] = month.innerText.split(' – ')

      if (!date || !rawText) continue

      const description = rawText.split('[').shift()
      if (!description || description.length < 16) continue

      events.push({ date, description })
    }
  }

  shuffledEvents = shuffle(events)
  setNewEvent()
  setInterval(setNewEvent, 1000 * 60)
}

const setNewEvent = () => {
  event = shuffledEvents.pop()
}

fetchEvents()

</script>

{#if event}
  <article class='major-mono absolute bottom-12 right-12 w-96 text-white z-10'>
    <h2 class='text-3xl'>{event.date}</h2>
    <p class='text-lg'>{event.description}</p>
  </article>
{/if}
