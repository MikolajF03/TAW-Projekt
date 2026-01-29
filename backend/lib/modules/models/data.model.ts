export interface IData {
   _id?: string;
   title: string;
   text: string;
   image: string;
   authorId?: string;
   createdAt?: Date;
   likes: string[];
}


export type Query<T> = {
   [key: string]: T;
};