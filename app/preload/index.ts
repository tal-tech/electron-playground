/* eslint-disable */
import { initJSAPI } from './jsapi'
import { argv } from 'yargs'
import { initDraggable } from './draggable'
import fs from 'fs'
import path from 'path'

initJSAPI()

window.addEventListener('DOMContentLoaded', async () => {
  initDraggable()
})

console.log(argv)
window.fs = fs
window.path = path
