import { Object } from "realm";
import { TBL_POST } from "../constants/constant";

export class PostSchema extends Object{
   static schema = {
       name : TBL_POST,
       primaryKey : 'id',
       properties : {
           id : 'int',
           user_id : 'int',
           event_id : 'int',
           post_name : 'string',
           description: 'string?',
           favorite : 'int?',
           created_on : 'int?',
           updated_on : 'int?',
       }
   }
}