import { MongoClient, Db, Collection, ObjectID } from 'mongodb';
import { token } from '../Types/token';
import {Collections} from './Collections';

export class Database{
    private _postgreUrl:string;

    private _mongoUrl:string;

    constructor() { 
        this._mongoUrl = process.env.MONGOURL;
    }

    public async GetCities(cityId:string){
        let collection = await this.Connect(Collections.city);
        let result = collection.findOne({id:cityId});
        return result;
    }

    public async GetWeather(cityId:string){

    }

    public async GetAppInfo(appId:string){
        let collection = await this.Connect(Collections.apiKey);
        let result = collection.findOne({appId:appId});
        return result;
    }

    public async GetAuthTokens(token:string):Promise<token>{
        let collection = await this.Connect(Collections.auth);
        let result = collection.findOne({token:token});
        return result;
    }

    public async AddAuthToken(option:{token:string, host:string, expiry:number}){
        let collection = await this.Connect(Collections.auth);
        await collection.insertOne(option);
        return;
    }

    public async SetAuthToken(token:{token:string, expiry:number, host:string}, tokenId:ObjectID){
        let collection = await this.Connect(Collections.auth);
        await collection.updateOne({_id:tokenId},{
            $set:{
                token:token.token,
                expiry:token.expiry,
                host:token.host
            }
        });
        return;
    }

    private async Connect(collectionName:string):Promise<Collection<any>>{
        try{
            const client = await MongoClient.connect(this._mongoUrl);
            let collection = await client.db(Collections.dbName).collection(collectionName);
            return collection;
        }catch(err){
            // Put in a log when it fails so when I look at it I know what's going on before it throws an error
            console.log(`Failed to established connection to MongoDb Database Instance - ${err}`);
            throw err;
        }
    }
}