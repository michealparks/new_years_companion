let internalState = {}
const subscribers = {}

export const dispatch = ({ type, value }) => {
  internalState = { ...internalState, ...value }

  for (const fn of subscribers[type] || []) {
    fn(value)
  }
}

export const subscribe = (type, callback) => {
  if (subscribers[type]) {
    subscribers[type].push(callback)
  } else {
    subscribers[type] = [callback]
  }
}

export const get = () => {
  return internalState
}

export const state = {
  dispatch,
  subscribe,
  get
}
