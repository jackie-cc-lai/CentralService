declare namespace openWeather{
    export interface forecast{
        dt:number;
        dt_txt:string;
        main:temperature;
        clouds:{
            all:number
        };
        pop:number;
        visibility:number;
        weather:Array<weather>;
        wind:wind;
    }

    export interface current{
        base:string;
        clouds:{
            all:number
        };
        cod:number;
        coord:{
            lon:number,
            lat:number
        };
        dt:number;
        id:number;
        main:temperature;
        timezone:number;
        visibility:number;
        weather:Array<weather>;
        wind:wind;
        sys:{
            type:number,
            id:number,
            country:string,
            sunrise:number,
            sunset:number
        }
    }

    export interface weather{
        id:number;
        main:string;
        description:string;
        icon:string;
    }

    export interface wind{
        speed:number;
        deg:number;
        gust?:number;
    }

    export interface temperature{
        temp:number,
        feels_like:number,
        temp_min:number,
        temp_max:number,
        pressure:number
    }
}