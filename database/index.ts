import { Kysely } from "kysely";

import { DB } from "./types";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { env } from "@/env";

export const db = new Kysely<DB>({
  dialect: new LibsqlDialect({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  }),
});
