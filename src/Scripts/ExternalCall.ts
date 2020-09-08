import axios from "axios";

export class ExternalCall{

    public static async get(url:string, params?:any){
        const data = await axios.get(url).then((res)=>{
            return res;
        })
        return data;
    }
}