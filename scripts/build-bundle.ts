import { build } from 'vite'
import {
  version,
  webVersion,
  androidVersion,
  iosVersion,
} from '../package.json'
import { RollupOutput } from 'rollup'
import archiver from 'archiver'
import { createWriteStream, existsSync } from 'node:fs'
import { config } from 'dotenv'
import { mkdir, writeFile } from 'node:fs/promises'

config({
  path: ['.env']
    .map((p) => [p, p + '.production'])
    .flat(1)
    .map((p) => [p, p + '.local'])
    .flat(1),
})
let deployBase = process.env.DEPLOY_BASE
if (!deployBase) {
  console.warn('DEPLOY_BASE is not set')
  deployBase = 'https://www.example.com/'
}
if (!deployBase.endsWith('/')) deployBase += '/'
let deployHomepage = process.env.DEPLOY_HOMEPAGE
if (!deployHomepage) {
  console.warn('DEPLOY_HOMEPAGE is not set')
  deployHomepage = 'https://www.example.com/'
}

const webBundlePath = `v/${version}.zip`
if (existsSync('./ship/' + webBundlePath))
  console.warn('Overwriting existing bundle ' + webBundlePath)

let buildResult = await build({ build: { write: false, watch: null } })
if (!Array.isArray(buildResult)) buildResult = [buildResult as RollupOutput]

const zip = archiver.create('zip')
if (!existsSync('./ship')) await mkdir('./ship')
if (!existsSync('./ship/v')) await mkdir('./ship/v')
const stream = createWriteStream('./ship/' + webBundlePath, { autoClose: true })
zip.pipe(stream)

buildResult.forEach((o) =>
  o.output.forEach((c) => {
    const source = 'code' in c ? c.code : c.source
    const buffer = source instanceof Uint8Array ? Buffer.from(source) : source
    zip.append(buffer, { name: c.fileName })
  }),
)

await zip.finalize()

const latestJson = {
  android: {
    version,
    web: webVersion,
    native: androidVersion,
    webBundle: deployBase + webBundlePath,
    homepage: deployHomepage,
  },
  ios: {
    version,
    web: webVersion,
    native: iosVersion,
    webBundle: deployBase + webBundlePath,
    homepage: deployHomepage,
  },
}
await writeFile('./ship/latest.json', JSON.stringify(latestJson))
export type LatestJson = typeof latestJson
