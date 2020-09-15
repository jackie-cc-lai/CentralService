import { ObjectID } from "mongodb";

export interface AppConfig{
    _id?:ObjectID,
    appId:string,
    key:string,
    url:string,
    externalId?:string;
}