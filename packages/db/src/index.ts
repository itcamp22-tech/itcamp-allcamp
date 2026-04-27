import { env } from "@itcamp-allcamp/env/server";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schemaNamespace from "./schema";
export const schema = schemaNamespace;

export function createDb() {
  const client = createClient({
    url: env.DATABASE_URL,
  });

  return drizzle({ client, schema: schemaNamespace });
}

export const db = createDb();
