import express, {Request,Response} from "express";
import bodyParser = require('body-parser');
import { CentralService } from "../Scripts/CentralService";

export class RouteApp{
    public static async Get(req:Request,res:Response){
        try{
            const params = req.params;
            const query = req.query;
            const host = req.headers.host;
            const authStr = req.headers.authorization;
            const authCode = authStr.split(" ")[1];

            const authService = await CentralService.getAuthService();
            await authService.Check(authCode, host);

            const appService = await CentralService.getAppService();
            const result = await appService.ParseGet(params, query);

            res.send(result);
        }catch(err){
            res.send("Error");
        }
    }

    public static async Post(req:any,res:any){
        try{
            const params = req.params;
            const host = req.headers.host;
            const authStr = req.headers.authorization;
            const authCode = authStr.split(" ")[1];

            const authService = await CentralService.getAuthService();
            await authService.Check(authCode, host);

            const apiService = await CentralService.getAppService();
            const result = await apiService.ParsePost(req.body);
            res.send(result);
        }catch(err){
            res.send("Error");
        }
    }
}