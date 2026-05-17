// Passenger entrypoint. ESM (package "type":"module").
// Wraps the real server boot so any startup error is captured to
// ./debug.log — Passenger on N0C hides its own log, so this file is
// our only window into "why did it crash?".
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const debugLog = path.resolve(__dirname, 'debug.log')

function logToFile (line) {
  try {
    fs.appendFileSync(debugLog, `[${new Date().toISOString()}] ${line}\n`)
  } catch { /* ignore */ }
}

logToFile(`Boot attempt — cwd=${process.cwd()} __dirname=${__dirname} PORT=${process.env.PORT ?? '(unset)'} NODE_ENV=${process.env.NODE_ENV ?? '(unset)'}`)

process.on('uncaughtException', err => {
  logToFile(`uncaughtException: ${err.stack || err.message || err}`)
})
process.on('unhandledRejection', reason => {
  logToFile(`unhandledRejection: ${(reason && reason.stack) || reason}`)
})

try {
  await import('./src/server.js')
  logToFile('src/server.js loaded successfully')
} catch (err) {
  logToFile(`Boot crashed: ${err.stack || err.message || err}`)
  throw err
}
