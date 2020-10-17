// @ts-ignore
console.log('preload', new Date().getTime())
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded', new Date().getTime())
})
window.addEventListener('load', () => {
  console.log('DOMContentLoaded', new Date().getTime())
})

window.a = '123'
