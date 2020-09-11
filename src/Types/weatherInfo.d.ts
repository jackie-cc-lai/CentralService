import { ObjectID } from "mongodb";

export interface weatherInfo{
    _id?:ObjectID;
    cityId:number;
    currentWeather:currentWeather;
    forecastWeather:Array<forecastWeather>;
    dateRecorded:Date;
}

export interface weatherGeneral{
    date?:Date;
    icon:string;
    temp:number;
    wind:number;
    windDir:string;
}
export interface currentWeather extends weatherGeneral{
    gust:number;
    feelsLike:number;
    sunrise:number;
    sunset:number;
}

export interface forecastWeather extends weatherGeneral{
    wind:number;
    icon:string;
    maxTemp:number;
    minTemp:number;
    daily:Array<weatherGeneral>;
}