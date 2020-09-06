import express from "express";
import cors = require('cors');
import http = require('http');
import bodyParser from 'body-parser';
import { RouteAuth } from "./Routes/RouteAuth";
import { RouteApi } from "./Routes/RouteApi";
import path  = require('path');

const allowList = ['http://localhost:3000', 'http://localhost:4200'];
const jsonParser = bodyParser.json()
const app = express();
const port = parseInt(process.env.PORT); // default port to listen
app.use(cors({
    origin:(origin, callback) =>{
        if(!origin) return callback(null, true);

        if(allowList.indexOf(origin) === -1){
            const msg = "CORS Policy prohibits sharing of resource to this origin";
            return callback(new Error(msg), false);
        }
        return callback(null,true);
    }
}));
// define a route handler for the default home page
app.get( "/ping", (req:express.Request, res:express.Response) => {
    res.send( "Service is active" );
});
app.get("/Auth/Authorize", RouteAuth.Auth);
app.get("/Auth/Check", RouteAuth.Check);
app.get("/api/:app", RouteApi.Get);
app.post("/api/:app", jsonParser, RouteApi.Post);

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
});