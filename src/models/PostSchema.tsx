import { Object } from "realm";
import { TBL_POST } from "../constants/constant";

export class PostSchema extends Object{
   static schema = {
       name : TBL_POST,
       primaryKey : 'id',
       properties : {
           id : 'int',
           event_id : 'int',
           post_name : 'string',
           created_on : 'int'
       }
   }
}