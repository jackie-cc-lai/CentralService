import { AppConfig } from "src/Types/appConfig";
import { Database } from "./Database";
import { ExternalCall } from "./ExternalCall";

export class GasService{
    private _database:Database;
    private _url:string;
    private _stationConfig:AppConfig;

    constructor(database:Database) {
        this._database = database;
    }
    public async getStations(location:{latitude:number, longitude:number, zoom:number}){
        this._stationConfig = await this._database.GetAppInfo('gasStation');
        await ExternalCall.get(this._stationConfig.url, location);
    }
}