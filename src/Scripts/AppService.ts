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
            return await this._weather.getWeather(body.cityId);
        }
    }

    public async ParseGet(params:any, query:any){
        console.log(params);
        if(params.app == "Weather"){
            if(params.method == "GetCity"){
                const response = await this._weather.getCities(query.name);
                return response;
            }
        }
    }

}