export async function up(db) {
    await db.schema
    .createTable('album')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('albumName', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'varchar(255)') //ok if description is blank
    .addColumn('userId', 'integer', (col) => col.notNull().references('user.id'))
    .addColumn('images', 'jsonb')
    .execute();
}
    export async function down(db) {
        await db.schema.dropTable('album').execute()
    }