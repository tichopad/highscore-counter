/* eslint-disable no-unused-vars */

import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export const envSchema = Type.Strict(
  Type.Object({
    SERVER_PORT: Type.Number()
  })
)

export type Env = Static<typeof envSchema>

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    config: Env
  }
}
