import { Elysia } from 'elysia'

export const logger = new Elysia()
  .derive({ as: 'global' }, () => ({ start: Date.now() }))
  .onAfterHandle({ as: 'global' }, ({ request, path, set, start }) => {
    console.log(
      `\x1b[0;34m${request.method}\x1b[0m`,
      `\x1b[0;33m${set.status}\x1b[0m`,
      `\x1b[1;36m${path}\x1b[0m`,
      'in',
      `\x1b[0;35m${Date.now() - start}\x1b[0m`,
      'ms'
    )
  })
  .onError({ as: 'global' }, ({ request, path, set, start }) => {
    if (!start) start = Date.now()

    console.log(
      `\x1b[1;34m${request.method}\x1b[0m`,
      `\x1b[0;33m${set.status}\x1b[0m`,
      `\x1b[1;32m${path}\x1b[0m`,
      'in',
      `\x1b[0;35m${Date.now() - start}\x1b[0m`,
      'ms'
    )
  })

export default logger
