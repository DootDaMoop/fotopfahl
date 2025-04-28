import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely'
import { db } from '@/db/db.ts'

export const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join('/home/dootdamoop/projects/fotopfahl/src/db/migrations'),
    }),
  });

export async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest()

    let migrationError = false
    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
            migrationError = true
        }
    })

    if (error || migrationError) {
        console.error('failed to migrate')
        console.error(error)
        process.exit(1)
    }
}