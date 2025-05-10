import { Object } from "realm";
import { TBL_USER } from "../constants/constant";

 export class UserSchema extends Object {
    static schema = {
        name : TBL_USER,
        primaryKey : 'id',
        properties : {
            id : 'int',
            mobile : 'string',
            name : 'string',
            email : 'string',
            created_on : 'int',
        } 
    }
 }