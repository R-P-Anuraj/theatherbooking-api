import { Types,ObjectId } from "mongoose";


export interface IScreen {
    screen_num: number;
    capacity: number;
    movie: string;
    numofshows: number;
    showtimes: string[];
    screenId: Types.ObjectId
    theaterId: Types.ObjectId
    description: string
    // sliverseat: [];
    // goldseat: number[];
    // platinumseat: number[];
    // reclinerseat: number[];
    
    
    // sliverseatNo:[{Number:number,booked:boolean}];
    // goldseatNo: [{Number:number,booked:boolean}];
    // platinumseatNo: [{Number:number,booked:boolean}];
    // reclinerseatNo: [{Number:number,booked:boolean}];
    
    
}