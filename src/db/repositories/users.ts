import { db } from '@/db/db.ts'
import type { UserTable } from '../types'

export async function findUserById(id: number) {
    const user = await db
        .selectFrom('user')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
    return user
}

export async function findUserByUsername(username: string) {
    const user = await db
        .selectFrom('user')
        .selectAll()
        .where('userName', '=', username)
        .executeTakeFirst();
    return user
}

export async function findUserByEmail(email: string) {
    const user = await db
        .selectFrom('user')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();
    return user
}

export async function createUser(user: Omit<UserTable, 'id'>) {
    const newUser = await db
        .insertInto('user')
        .values(user)
        .returning(['id', 'profilePicture', 'userName', 'email', 'name'])
        .executeTakeFirst();
    return newUser
}

// TODO: Update User Function

// TODO: Delete User Function