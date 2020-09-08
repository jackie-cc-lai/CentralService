import http = require('http');
import axios from 'axios';
import { Database } from './Database';
import { WeatherService } from './WeatherService';

export class AppService{
    private _database:Database;
    private _weather:WeatherService;
    constructor(db:Database, ws:WeatherService) {
        this._database = db;
        this._weather = ws;
    }

    public async ParsePost(body:any){
        const method = body.method;
        if(method == "GetWeather"){
            return await this.ParseWeather(body.cityId);
        }
    }

    public async ParseGet(params:any){

    }

    private async ParseWeather(cityId:number){ 
        let response = await this._weather.getWeather(cityId);
        
        return response;
    }
}