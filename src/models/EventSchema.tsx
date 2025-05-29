import { Object } from "realm";
import { TBL_EVENT } from "../constants/constant";

export class EventSchema extends Object{
   static schema = {
       name : TBL_EVENT,
       primaryKey : 'id',
       properties : {
           id : 'int',
           user_id : 'int',
           event_name : 'string?',
           description: 'string?',
           created_on : 'int?',
           updated_on : 'int?',
       }
   }
}