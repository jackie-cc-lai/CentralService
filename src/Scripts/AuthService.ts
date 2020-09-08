import jwt from 'jsonwebtoken';
import express from 'express';
import { Database } from './Database';
import { token } from 'src/Types/token';
import { ObjectID } from 'mongodb';
import crypto  = require('crypto');

// local development testing
const testPrivateKey = 'as98fjh47f328hh89234qf';

export class AuthService{

    private _database:Database;

    private _apiKey:string;

    private _encryptionToken:string;

    constructor(db:Database){
        this._apiKey = '';
        this._encryptionToken = '';
        this._database = db;
    }
    public async Auth(url:string, tokenId?:ObjectID){
        const date = new Date().getTime();
        const jwToken = jwt.sign({
            host:url,
            date
        }, testPrivateKey, {algorithm:"HS256"});

        // Hash the thing so I don't reveal the token by accident in any way
        const sha = crypto.createHash('SHA256');

        const authObj = {
            token:sha.update(jwToken).digest('hex'),
            expiry:date + 24*60*60*1000,
            host:url
        }
        if(!tokenId){
            await this._database.AddAuthToken(authObj);
        }else{
            await this._database.SetAuthToken(authObj, tokenId);
        }
        return jwToken;
    }
    // Check for expiry
    public async Check(token:string, host:string){
        try{
            const tokenInfo:{host:string, date:number} = jwt.verify(token, testPrivateKey) as unknown as {host:string, date:number};
            const tokenStuff = await this.Verify(token, host);
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

    public async Verify(token:string, host:string){
        try{
            const tokenInfo:{host:string, date:number} = jwt.verify(token, testPrivateKey) as unknown as {host:string, date:number};
            const sha = crypto.createHash('SHA256');
            // Check the hash since I stored the hash not the token
            const tokenStuff = await this._database.GetAuthTokens(sha.update(token).digest('hex'));
            if(!tokenStuff || tokenStuff == null){
                throw `Token information is not found in database`;
            }
            return tokenStuff;
        }catch(err){
            throw new Error(`Cannot verify token`);
        }
    }
}