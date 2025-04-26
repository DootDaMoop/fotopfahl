import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from '@/db/types.ts'
import dotenv from 'dotenv'

dotenv.config()

const dialect = new PostgresDialect({
    pool: new pg.Pool({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    max: Number(process.env.POOL_MAX),
    })
})

export const db = new Kysely<Database>({
    dialect,
})
