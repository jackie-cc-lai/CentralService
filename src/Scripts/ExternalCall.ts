import Axios from "axios";

export class ExternalCall{

    public static async Call(method:'get' | 'post', params:any, url:string){
        const data = await Axios({
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