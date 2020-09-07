import express, {Request,Response} from "express";
import bodyParser = require('body-parser');
import { CentralService } from "../Scripts/CentralService";

export class RouteApp{
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
            const authService = await CentralService.getAuthService();
            await authService.Check(authCode, host);
            const apiService = await CentralService.getAppService();
            // apiService.Parse(req.body);
            res.send("Getting location");
        }catch(err){
            res.send("Error");
        }
    }

    public static async Post(req:any,res:any){
        try{
            const params = req.params;
            console.log(params);
            if(params.app === 'Weather'){
                console.log("Weather");
            }
            const host = req.headers.host;
            const authStr = req.headers.authorization;
            const authCode = authStr.split(" ")[1];
            const authService = await CentralService.getAuthService();
            await authService.Check(authCode, host);
            const apiService = await CentralService.getAppService();
            let result = await apiService.Parse(req.body);
            res.send("Posting location");
        }catch(err){
            res.send("Error");
        }
    }
}