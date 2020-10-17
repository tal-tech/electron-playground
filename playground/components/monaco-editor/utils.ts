import * as fs from 'fs-extra'
import * as path from 'path'

const electronPath = path.join('node_modules', 'electron', 'electron.d.ts')
const nodeFsPath = path.join('node_modules', '@types', 'node', 'fs.d.ts')
const nodePathPath = path.join('node_modules', '@types', 'node', 'path.d.ts')

// base definitions for all NodeJS modules that are not specific to any version of TypeScript
///  "globals.d.ts"
///  "async_hooks.d.ts"
///  "buffer.d.ts"  
///  "child_process.d.ts"  
///  "cluster.d.ts"  
///  "console.d.ts"  
///  "constants.d.ts"  
///  "crypto.d.ts"  
///  "dgram.d.ts"  
///  "dns.d.ts"  
///  "domain.d.ts"  
///  "events.d.ts"  
///  "fs.d.ts"  
///  "http.d.ts"  
///  "http2.d.ts"  
///  "https.d.ts"  
///  "inspector.d.ts"  
///  "module.d.ts"  
///  "net.d.ts"  
///  "os.d.ts"  
///  "path.d.ts"  
///  "perf_hooks.d.ts"  
///  "process.d.ts"  
///  "punycode.d.ts"  
///  "querystring.d.ts"  
///  "readline.d.ts"  
///  "repl.d.ts"  
///  "stream.d.ts"  
///  "string_decoder.d.ts"  
///  "timers.d.ts"  
///  "tls.d.ts"  
///  "trace_events.d.ts"  
///  "tty.d.ts"  
///  "url.d.ts"  
///  "util.d.ts"  
///  "v8.d.ts"  
///  "vm.d.ts"  
///  "worker_threads.d.ts"  
///  "zlib.d.ts"  


export const getModulesSource = () => {
  const modules = [electronPath, nodeFsPath, nodePathPath]

  return modules.map(item => {
    if (!!item && fs.existsSync(item)) {
      return fs.readFile(item, 'utf-8')
    }
    return null
  })
}
