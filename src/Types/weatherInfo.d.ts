import { ObjectID } from "mongodb";

export interface weatherInfo{
    _id?:ObjectID;
    cityId:number;
    currentWeather:CurrentWeather;
    forecastWeather:Array<ForecastWeather>;
    dateRecorded:Date;
}

export interface weatherGeneral{
    date?:Date;
    icon:string;
    temp:number;
    wind:number;
    windDir:string;
}
export interface CurrentWeather extends weatherGeneral{
    gust:number;
    feelsLike:number;
    sunrise:number;
    sunset:number;
}

export interface ForecastWeather extends weatherGeneral{
    wind:number;
    icon:string;
    maxTemp:number;
    minTemp:number;
    daily:Array<weatherGeneral>;
}