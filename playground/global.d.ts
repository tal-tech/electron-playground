import fs from 'fs'
import path from 'path'

declare global {
  interface Window {
    $EB: any
    fs: typeof fs
    path: typeof path
  }
}
