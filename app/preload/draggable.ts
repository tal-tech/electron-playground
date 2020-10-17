// Insert a removable dom at the top
export function initDraggable() {
  const topDiv = document.createElement('div') 
  topDiv.style.position = 'fixed'
  topDiv.style.top = '0'
  topDiv.style.left = '0'
  topDiv.style.height = '20px' 
  topDiv.style.width = '100%' 
  topDiv.style.zIndex = '9999' 
  topDiv.style.pointerEvents = 'none' // click through
  // @ts-ignore
  topDiv.style['-webkit-user-select'] = 'none' // prohibit text selection
  // @ts-ignore
  topDiv.style['-webkit-app-region'] = 'drag' 
  document.body.appendChild(topDiv) 
}
