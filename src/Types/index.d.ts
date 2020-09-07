import { IncomingMessage } from "http";


export interface Request extends IncomingMessage {
    body:any;
}