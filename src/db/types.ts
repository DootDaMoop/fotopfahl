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
    description: string | null; //description is optional. can be filled with img data if dataPermission = true
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