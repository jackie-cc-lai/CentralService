import axios from "axios";

export class ExternalCall{

    public static async get(url:string, params?:any){
        const data = await axios.get(url).then((res)=>{
            return res;
        })
        return data;
    }

    public static async post(url:string, params:any, header:any){

    }
}