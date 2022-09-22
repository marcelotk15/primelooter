import { readFileSync } from 'fs'

import { NetscapeJSON } from '../@types/cookies'

export function convertNetscape(fileLocation: string): NetscapeJSON[] {
  const fileContent = readFileSync(fileLocation, { encoding: 'utf-8' })

  const lines = fileContent.split('\n')

  return lines
    .filter((line) => line.split('\t').length === 7)
    .map((line) => {
      const tokens = line.split('\t')

      const [domain, httpOnly, path, secure, timestamp, name, value] =
        tokens.map((token) => token.trim())

      const expiry =
        timestamp.length === 17
          ? Math.floor(parseInt(timestamp) / 1000000 - 11644473600)
          : parseInt(timestamp)

      return {
        domain,
        httpOnly: httpOnly === 'TRUE',
        path,
        secure: secure === 'TRUE',
        expiry,
        name,
        value,
      }
    })
}
