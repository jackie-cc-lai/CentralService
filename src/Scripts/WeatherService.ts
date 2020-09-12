import { Database } from "./Database";
import { ExternalCall } from "./ExternalCall";
import { AppConfig } from "../Types/appConfig";
import { weatherInfo, ForecastWeather, weatherGeneral } from "src/Types/weatherInfo";
import moment from 'moment';
import { ObjectID } from "mongodb";

export class WeatherService{

    private _database: Database;

    private _weatherConfig:AppConfig;

    constructor(db:Database) {
        this._database = db;
    }

    private async initConfig(){
        if(this._weatherConfig) return;
        const config = await this._database.GetAppInfo('weather');
        this._weatherConfig = config;
    }

    public async getWeather(cityId:number){

        await this.initConfig();

        let result = await this._database.GetWeather(cityId);

        if(!result || result == null){
            const weatherResult = await this.getWeatherInfo(cityId);
            await this.addCityInfo(weatherResult);
            result = weatherResult;
        }
        if(result.dateRecorded.getTime() < new Date().getTime() - 1000*60*30){
            const weatherResult = await this.getWeatherInfo(cityId);
            await this.updateCityInfo(weatherResult, result._id);
            result = weatherResult;
        }
        return result;
    }

    public async getCities(cityName:string){
        await this.initConfig();
        const cities = await this._database.GetCitiesByName(cityName);
        return cities;
    }

    private async getWeatherInfo(cityId:number){
        let url = `${this._weatherConfig.url}/forecast?id=${cityId}&appid=${this._weatherConfig.key}&units=metric`;
        const forecastResult = await ExternalCall.get(url);
        const forecastWeather = forecastResult.data.list as unknown as openWeather.forecast[];
        url = `${this._weatherConfig.url}/weather?id=${cityId}&appid=${this._weatherConfig.key}&units=metric`;
        const currentResult = await ExternalCall.get(url);
        const currentWeather = currentResult.data as unknown as openWeather.current;

        const futureWeather:ForecastWeather[] = this.parseForecast(forecastWeather);

        const weatherResult:weatherInfo = {
            cityId,
            currentWeather:{
                icon:currentWeather.weather[0].icon,
                temp:currentWeather.main.temp,
                sunrise:currentWeather.sys.sunrise,
                sunset:currentWeather.sys.sunset,
                feelsLike:currentWeather.main.feels_like,
                wind:currentWeather.wind.speed,
                windDir:this.parseWindDirection(currentWeather.wind.deg),
                gust:currentWeather.wind.gust
            },
            forecastWeather:futureWeather,
            dateRecorded:new Date()
        }
        return weatherResult;
    }

    private parseForecast(forecastWeather:openWeather.forecast[]){
        console.log(forecastWeather.map(r=>r.main.temp));
        // Since the array of data is every 3 hours a day, separate the entire thing into an array of forecasts by day, with each day being an array
        const futureWeather:ForecastWeather[] = [];
        let i = 0;
        while(i < forecastWeather.length){
            const weather:weatherGeneral[] = [];
            let j = i;
            while( j < forecastWeather.length && moment(forecastWeather[i].dt_txt).isSame(moment(forecastWeather[j].dt_txt), 'day')){
                weather.push({
                    date: moment(forecastWeather[j].dt_txt).toDate(),
                    icon: forecastWeather[j].weather[0].icon,
                    temp:forecastWeather[j].main.temp,
                    wind:forecastWeather[j].wind.speed,
                    windDir:this.parseWindDirection(forecastWeather[i].wind.deg)
                })
                j++;
            }
            futureWeather.push({
                date:new Date(weather[0].date),
                wind: weather.map(w=>w.wind).reduce((a,b)=> a+b, 0)/weather.length,
                windDir: weather[Math.floor(weather.length / 2)].windDir,
                temp:weather[Math.floor(weather.length / 2)].temp,
                maxTemp:Math.max(...weather.map(w=>w.temp)),
                minTemp:Math.min(...weather.map(w=>w.temp)),
                icon:weather[Math.floor(weather.length / 2)].icon,
                daily:weather
            })
            i = j;
        }
        console.log(futureWeather);
        return futureWeather;
    }

    private parseWindDirection(deg:number){
        if(deg < 10 || deg > 350){
            return "N";
        }
        if(deg < 40){
            return "NNE";
        }
        if(deg < 60){
            return "NE";
        }
        if(deg < 80){
            return "ENE";
        }
        if(deg < 110){
            return "E";
        }
        if(deg < 130){
            return "ESE";
        }
        if(deg < 140){
            return "SE";
        }
        if(deg < 170){
            return "SSE";
        }
        if(deg < 190){
            return "S";
        }
        if(deg < 215){
            return "SSW";
        }
        if(deg < 235){
            return "SW";
        }
        if(deg < 265){
            return "WSW";
        }
        if(deg < 285){
            return "W";
        }
        if(deg < 305){
            return "WNW";
        }
        if(deg < 325){
            return "NW";
        }
        return "NNW";
    }

    // Database related scehema
    private async updateCityInfo(info:weatherInfo, dbId:ObjectID){
        await this._database.SetWeather(info, dbId);

    }

    private async addCityInfo(info:weatherInfo){
        await this._database.AddWeather(info);

    }
}