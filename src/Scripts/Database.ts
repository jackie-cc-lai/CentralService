import { MongoClient, Db, Collection, ObjectID } from 'mongodb';
import { token } from '../Types/token';
import {Collections} from './Collections';
import res from 'express/lib/response';
import { AppConfig } from '../Types/appConfig';
import { weatherInfo } from 'src/Types/weatherInfo';

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

    public async GetCities(cityId:number){
        let result = this._db.collection(Collections.city).findOne({id:cityId});
        return result;
    }

    public async GetWeather(cityId:number):Promise<weatherInfo>{
        let result = await this._db.collection(Collections.weather).findOne({cityId:cityId});
        return result;
    }

    public async GetAppInfo(appId:string):Promise<AppConfig>{
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

    public async AddWeather(weather:weatherInfo){
        await this._db.collection(Collections.weather).insertOne(weather);
        return;
    }

    public async SetWeather(weather:weatherInfo, id:ObjectID){
        await this._db.collection(Collections.weather).replaceOne({_id:id},weather)
    }

    public async SetAuthToken(token:{token:string, expiry:number, host:string}, tokenId:ObjectID){
        await this._db.collection(Collections.auth).replaceOne({_id:tokenId},token);
        return;
    }

    private async Connect():Promise<Db>{
        try{
            console.log(`[Database] Connecting to database`);
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