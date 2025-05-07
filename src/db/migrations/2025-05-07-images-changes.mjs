export async function up(db) {
    await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('profilePicture', 'varchar(255)') 
    .addColumn('userName', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)') 
    .addColumn('password', 'varchar(255)') 
    .addColumn('name', 'varchar(255)')
    .addColumn('provider', 'varchar(50)')  
    .addUniqueConstraint('unique_userName', ['userName']) 
    .addUniqueConstraint('unique_email', ['email']) 
    .execute();

    await db.schema
    .createTable('post')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('userId', 'integer', (col) => col.notNull().references('user.id'))
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'varchar(255)') //ok if description is blank
    .addColumn('images', 'jsonb')
    .addColumn('mapData', 'jsonb') 
    .addColumn('dataPermission', 'boolean', (col) => col.notNull())
    .addColumn('likes', 'integer', (col) => col.notNull().defaultTo(0)) //default to 0 so we dont have to set it initially 
    .execute();
    //mapData. Need to figure out how we're going to get that map pin and then how we are passing that into the post (string, json, etc.)

    await db.schema
    .createTable('comment')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('postId', 'integer', (col) => col.notNull().references('post.id')) //what post is the comment on
    .addColumn('userId', 'integer', (col) => col.notNull().references('user.id')) //who said it?
    .addColumn('content', 'varchar(255)', (col) => col.notNull()) //what'd they say?
    .execute();

}

export async function down(db) {
    await db.schema.dropTable('comment').execute()
    await db.schema.dropTable('post').execute()
    await db.schema.dropTable('user').execute()
}