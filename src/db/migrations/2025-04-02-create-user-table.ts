import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('profilePicture', 'varchar(255)', (col) => col.notNull()) 
    .addColumn('userName', 'varchar(255)', (col) => col.notNull())
    .addColumn('password', 'varchar(255)') //can be null if they login through gitHub auth?
    .addColumn('name', 'varchar(255)') //optional if user wants to pu full name
    .addUniqueConstraint('unique_userName', ['userName']) // Add unique constraint for userName
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('user').execute()
}