import express, {Request,Response} from "express";
import { ApiService } from "../Scripts/ApiService";
import { AuthService } from "../Scripts/AuthService";

export class RouteApi{
    public static async Get(req:Request,res:Response){
        try{
            const params = req.params;
            console.log(params);
            if(params.app === 'weather'){
                console.log("Weather");
            }
            const host = req.headers.host;
            const authStr = req.headers.authorization;
            const authCode = authStr.split(" ")[1];
            const authService = new AuthService();
            await authService.Check(authCode, host);
            const apiService = new ApiService('', '');
            // apiService.Parse(req.body);
            res.send("Getting location");
        }catch(err){
            res.send("Error");
        }
    }

    public static async Post(req:express.Request,res:express.Response){
        try{
            const params = req.params;
            if(params.app === 'weather'){
                console.log("Reached weather application endpoint");
            }
            res.send("Posting location");
        }catch(err){
            res.send("Error");
        }
    }
}