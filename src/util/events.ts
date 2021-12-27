type Listener = (data: unknown) => void

const channels = new Map<string, Set<Listener>>()

const on = (name: string, cb: Listener) => {
  if (channels.has(name) === false) {
    channels.set(name, new Set())
  }

  channels.get(name).add(cb)
}

const fire = (name: string, event: unknown) => {
  for (const cb of channels.get(name) ?? []) {
    cb(event)
  }
}

export const events = {
  on,
  fire
}
