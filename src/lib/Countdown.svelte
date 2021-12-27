<script lang='ts'>

import formatDuration from 'date-fns/formatDuration'
import intervalToDuration from 'date-fns/intervalToDuration'
import utcToZonedTime from 'date-fns-tz/utcToZonedTime'

let times = []

const tick = () => {
  const { timeZone } = new Intl.DateTimeFormat().resolvedOptions()

  const res = formatDuration(intervalToDuration({
    start: utcToZonedTime(new Date(`${new Date().getFullYear() + 1}-01-01T00:00:00`), timeZone), 
    end: utcToZonedTime(new Date(), timeZone),
  }), {
    zero: true,
    delimiter: ',',
  })

  times = res.split(',').filter(str => !['0 years', '0 months', '0 days'].includes(str))
}

tick()
setInterval(tick, 1000)

</script>

<div class='major-mono absolute top-12 left-12 w-full text-6xl text-white z-10'>
  {#each times as time (time)}
    <p>{time}</p>
  {/each}
</div>
