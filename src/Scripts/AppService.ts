import http = require('http');
import axios from 'axios';
import { Database } from './Database';
import { WeatherService } from './WeatherService';

export class AppService{
    private _database:Database;
    constructor(db:Database) {
        this._database = db;
    }

    public async ParsePost(body:any){
        const method = body.method;
        if(method == "GetWeather"){
            let weatherService = new WeatherService(this._database);
            let resultCurrent = await weatherService.getCurrentWeather(body.cityId);
            let resultForecast = await weatherService.getForecast(body.cityId);
            let response = {
                current:resultCurrent,
                forecast:resultForecast
            }
            return response;
        }
    }

    public async ParseGet(params:any){

    }
}