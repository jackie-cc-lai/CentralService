import jwt from 'jsonwebtoken';
import express from 'express';
import { Database } from './Database';
import { token } from 'src/Types/token';
import { ObjectID } from 'mongodb';

export class AuthService{

    private _apiKey:string;

    private _encryptionToken:string;

    constructor(){
        this._apiKey = '';
        this._encryptionToken = '';
    }
    public async Auth(url:string, tokenId?:ObjectID){
        const date = new Date().getTime();
        const jwToken = jwt.sign({
            host:url,
            date
        }, 'as98fjh47f328hh89234qf', {algorithm:"HS256"});
        const db = new Database();
        const authObj = {
            token:jwToken,
            expiry:date + 24*60*60*1000,
            host:url
        }
        if(!tokenId){
            await db.AddAuthToken(authObj);
        }else{
            await db.SetAuthToken(authObj, tokenId);
        }
        return jwToken;
    }

    public async Check(token:string, host:string){
        try{
            const tokenInfo:{host:string, date:number} = jwt.verify(token, 'as98fjh47f328hh89234qf') as unknown as {host:string, date:number};
            const db = new Database();
            const tokenStuff = await db.GetAuthTokens(token);
            if(!tokenStuff || tokenStuff == null){
                throw `Token information is not found in database`;
            }
            if(tokenInfo.host === host){
                // Return new token if current token is expired
                if(tokenInfo.date < new Date().getTime() - 24*60*60*1000){
                    return this.Auth(tokenInfo.host, tokenStuff._id);
                }
                return;
            }
        }catch(err){
            throw new Error(`Cannot verify token`);
        }
    }
}