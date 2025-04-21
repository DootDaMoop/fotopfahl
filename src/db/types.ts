import { ColumnType, Generated, PostgresAdapter } from "kysely";

export type Database = {
    posts: Post;
};

export interface Post {
    id: Generated<number>;
    title: string; 
    description: string | null; //description is optional. can be filled with img data if dataPermission = true
    image: string; 
    mapData: string; 
    dataPermission: boolean; 
}