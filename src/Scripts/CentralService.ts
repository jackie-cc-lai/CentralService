import { Database } from "./Database"
import { WeatherService } from "./WeatherService";
import { AuthService } from "./AuthService";
import { AppService } from "./AppService";

export class CentralService{
    // Using this because I don't want to have to instantiate a new database object every time it gets called and it has to connect every single time
    private static db = new Database();
    public static async getWeatherService():Promise<WeatherService>{
        return new WeatherService(CentralService.db);
    }
    public static async getAuthService(){
        return new AuthService(CentralService.db);
    }

    public static async getAppService(){
        return new AppService(CentralService.db);
    }
}