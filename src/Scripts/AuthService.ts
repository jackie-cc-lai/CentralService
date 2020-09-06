import jwt from 'jsonwebtoken';
import express from 'express';

export class AuthService{

    private _apiKey:string;

    private _encryptionToken:string;

    constructor(){
        this._apiKey = '';
        this._encryptionToken = '';
    }
    public async Auth(url:string){
        const date = new Date().getTime();
        const token = jwt.sign({
            host:url,
            date
        }, 'as98fjh47f328hh89234qf', {algorithm:"HS256"});
        return token;
    }

    public Check(token:string, host:string){
        try{
            const tokenInfo:{host:string, date:number} = jwt.verify(token, 'as98fjh47f328hh89234qf') as unknown as {host:string, date:number};
            if(tokenInfo.host === host){
                // Return new token if current token is expired
                if(tokenInfo.date < new Date().getTime() + 24*60*60*1000){
                    return this.Auth(tokenInfo.host);
                }
                return;
            }
        }catch(err){
            throw new Error(`Cannot verify token`);
        }
    }
}