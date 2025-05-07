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
export async function updateUser(userId: number, updatedData: any) {
    try {
        const updatedUser = await db
            .updateTable('user') 
            .set({
                name: updatedData.name,
                userName: updatedData.username,
                password: updatedData.password,
                profilePicture: updatedData.profilePicture,
            })
            .where('id', '=', userId) 
            .returning(['id', 'name', 'userName', 'email', 'profilePicture']) 
            .executeTakeFirst();

        return updatedUser;
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('User update failed');
    }
}


// TODO: Delete User Function
export async function deleteUser(id: number) {
    try {
        const deletedUser = await db
            .deleteFrom('user')
            .where('id', '=', id)
            .returning(['id', 'profilePicture', 'userName', 'email', 'name'])
            .executeTakeFirst();

        return deletedUser;
    } catch (error) {
        console.error('Failed to delete user:', error);
        throw new Error('User deletion failed');
    }
}