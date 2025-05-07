import { Generated } from "kysely";

export type Database = {
    user: UserTable;
    post: PostTable;
    comment: CommentTable;
};


export interface UserTable {
    id: Generated<number>;
    profilePicture: string | null;
    userName: string;
    email: string; 
    password: string | null;
    name: string | null;
    provider: string | null; 
}

export interface PostTable {
    id: Generated<number>;
    userId: number;
    title: string; 
    description: string | null; 
    images: string[] | null; 
    mapData: any; 
    dataPermission: boolean;
    likes: number; 
}

export interface CommentTable {
    id: Generated<number>;
    postId: number; 
    userId: number; 
    content: string; 
}

export interface AlbumTable{
    id: Generated<number>;
    albumName: string;
    description: string;
    userId: number;
    images: string[] | null;
}