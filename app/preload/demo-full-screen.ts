/* eslint-disable */
import { remote } from 'electron'

const setFullScreen = remote.getCurrentWindow().setFullScreen
const isFullScreen = remote.getCurrentWindow().isFullScreen
// @ts-ignore
window.setFullScreen = setFullScreen
// @ts-ignore
window.isFullScreen = isFullScreen
