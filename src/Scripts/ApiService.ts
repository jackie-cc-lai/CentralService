import http = require('http');
import axios from 'axios';

export class ApiService{
    private _apiKey:string;
    private _url:string;
    constructor(apiKey:string, serviceUrl:string) {
        this._apiKey = apiKey;
        this._url = serviceUrl;
        axios.defaults.headers.common = {'Authorization': `Bearer ${apiKey}`}

    }

    public async Parse(body:any){
        const method = body.method;
        const response = await this.Call(method, body.params, method === 'get' ? `${this._url}/${body.url}` : this._url);
        if(response){
            return response;
        }
    }
    private  async Call(method:'get' | 'post', params:any, url:string){
        const data = await axios({
            method,
            url,
            data:params
        })
        if(method === 'get'){
            return data;
        }
        return;
    }
}