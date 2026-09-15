import { Kysely } from 'kysely'

import { Database } from './types'
import { LibsqlDialect } from '@libsql/kysely-libsql'

export const db = new Kysely<Database>({
  dialect: new LibsqlDialect({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_TOKEN!,
  }),
})
