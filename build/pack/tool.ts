import { spawn, exec, execSync } from 'child_process'
import chalk from 'chalk'

export const NPM_COMMAND = process.platform === 'win32' ? 'npm.cmd' : 'npm'

// 执行命令
export function execCommand(command: string, args: string[]) {
  return new Promise((resolve, reject) => {
    const ls = spawn(command, args, { stdio: 'inherit' })

    ls.on('error', error => {
      console.log(chalk.red(error.message))
    })

    ls.on('close', code => {
      console.log(chalk.blue(`[${command} ${args.join(' ')}]`) + `exited with code ${code}`)
      code === 0 ? resolve() : reject(code)
    })
  })
}

// 执行异步命令
export function actionCommand(cmd: string, callBack?: Function) {
  try {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行的错误: ${error}`)
        return
      }
      if (callBack) {
        callBack(stdout, stderr)
      }
    })
  } catch (err) {
    console.log(`执行命令出错:${cmd}`)
    throw err
  }
}
// 执行同步命令
export function actionCommandSync(cmd: string) {
  try {
    const res = execSync(cmd, {
      encoding: 'utf8',
      timeout: 0,
      maxBuffer: 200 * 1024,
      killSignal: 'SIGTERM',
      cwd: undefined,
      env: undefined,
    })
    return res
  } catch (err) {
    console.log(`执行命令出错:${cmd}`)
    throw err
  }
}
