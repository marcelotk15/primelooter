import { join } from 'path'

import { primeLooter } from './services/PrimeLooter'
import { convertNetscape } from './utils/cookies'

async function main() {
  const cookies = convertNetscape(join(__dirname, '../cookies.txt'))

  const prime = await primeLooter(cookies, false)

  await prime.run()

  // await prime.close()
}

Promise.all([main()])
