export const headlines = async () => {
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
        const date = item.querySelector('a') ? item.querySelector('a').innerText : undefined
        const text = li.innerText.split('[').shift()

        if (!date || !text || text.length < 14) continue

        events.push({ date, text })
      }
    } else {
      const [date, rawText] = item.innerText.split(' – ')

      if (date === 'December 17') break
      if (!date || !rawText) continue

      const text = rawText.split('[').shift()
      if (!text || text.length < 14) continue

      events.push({ date, text })
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
  setInterval(update, 1000 * 60)
}

headlines()