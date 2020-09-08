import express, {Request,Response} from "express";
import { CentralService } from "../Scripts/CentralService";

export class RouteAuth{
    public static async Auth(req:Request,res:Response){
        try{
            const host = req.headers.origin;
            const authService = await CentralService.getAuthService();
            const options = {
                host
            }
            const token = await authService.Auth(host);
            res.send(token);
        }catch(err){
            res.send("Error");
        }
    }

    public static async Check(req:Request, res:Response){
        try{
            const host = req.headers.origin;
            const authService = await CentralService.getAuthService();
            const token = req.headers.authorization.split(" ")[1];
            const newToken = await authService.Check(token, host);
            if(newToken){
                res.send({token: newToken});
                return;
            }
            res.send({success:true});
        }catch(err){
            // console.log(err);
            res.send(401);
        }
    }
}