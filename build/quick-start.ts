// 将构建的文件保存到`latest-output`目录，需要快速启动时将文件复制到dist进行启动
import {copySync, removeSync} from 'fs-extra'
import path from 'path'

const latestOutput = path.resolve(__dirname, '..', 'latest-output')
const dist = path.resolve(__dirname, '..', 'dist')

removeSync(dist)
copySync(latestOutput, dist)