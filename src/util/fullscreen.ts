export const fullscreenable = () => {
  document.addEventListener('keypress', (e) => {
    if (e.key.toLowerCase() !== 'f') {
      return
    }
  
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.body.requestFullscreen()
    }
  })  
}
