import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from './types.js'
import dotenv from 'dotenv'

dotenv.config()

const dialect = new PostgresDialect({
    pool: new pg.Pool({
    database: process.env.DATABASE_NAME || 'test',
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    port: Number(process.env.DATABASE_PORT) || 5432,
    max: Number(process.env.POOL_MAX) || 10,
    })
})

export const db = new Kysely<Database>({
    dialect,
})
