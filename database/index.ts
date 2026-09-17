import { Kysely } from "kysely";

import { DB } from "./types";
import { LibsqlDialect } from "@libsql/kysely-libsql";

export const db = new Kysely<DB>({
  dialect: new LibsqlDialect({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_TOKEN!,
  }),
});
