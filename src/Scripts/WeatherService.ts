import { Database } from "./Database";
import Axios from "axios";

export class WeatherService{

    private _database: Database;
    constructor(db:Database) {
        this._database = db;
    }

    public async getCurrentWeather(cityId:string){
        let result = await this._database.GetWeather(cityId);
        if(!result || result == null || result.date < new Date().getTime() - 1000*60*30){
            result = await Axios({
                
            })
        }
    }

    public async getForecast(cityId:string){

    }
    // Database related scehema
    private async updateCityInfo(info:any){

    }

    private async addCityInfo(info:any){

    }
}