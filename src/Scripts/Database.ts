import { MongoClient, Db, Collection, ObjectID } from 'mongodb';
import { token } from '../Types/token';
import {Collections} from './Collections';
import res from 'express/lib/response';

export class Database{
    private _postgreUrl:string;

    private _mongoUrl:string;

    private _db: Db;

    constructor() { 
        this._mongoUrl = process.env.MONGOURL;
        this.Init();
    }

    private async Init(){
        let db = await this.Connect()
        this._db = db;
    }

    public async GetCities(cityId:string){
        let result = this._db.collection(Collections.city).findOne({id:cityId});
        return result;
    }

    public async GetWeather(cityId:string){
        let result = await this._db.collection(Collections.weather).findOne({cityId:cityId});
        return result;
    }

    public async GetAppInfo(appId:string){
        let result = await this._db.collection(Collections.apiKey).findOne({appId:appId});
        return result;
    }

    public async GetAuthTokens(token:string):Promise<token>{
        let result = await this._db.collection(Collections.auth).findOne({token:token});
        return result;
    }

    public async AddAuthToken(option:{token:string, host:string, expiry:number}){
        await this._db.collection(Collections.auth).insertOne(option);
        return;
    }

    public async SetAuthToken(token:{token:string, expiry:number, host:string}, tokenId:ObjectID){
        await this._db.collection(Collections.auth).updateOne({_id:tokenId},{
            $set:{
                token:token.token,
                expiry:token.expiry,
                host:token.host
            }
        });
        return;
    }

    private async Connect():Promise<Db>{
        try{
            const client = await MongoClient.connect(this._mongoUrl);
            let db = await client.db(Collections.dbName);
            return db;
        }catch(err){
            // Put in a log when it fails so when I look at it I know what's going on before it throws an error
            console.log(`Failed to established connection to MongoDb Database Instance - ${err}`);
            throw err;
        }
    }
}