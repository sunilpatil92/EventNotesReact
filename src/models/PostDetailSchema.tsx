import { Object } from "realm"
import { TBL_POST_DETAILS } from "../constants/constant"


export class PostDetailSchema extends Object {
       static schema = {
           name : TBL_POST_DETAILS,
           primaryKey : 'id',
           properties : {
            id : 'int',
            user_id : 'int',
            event_id : 'int',
            post_id : 'int',
            type : 'int',   //post type
            title : 'string',
            file_name : 'string',
            file_path : 'string',
            label_id : 'int?',    // for category
            label_name : 'string?',    // for category
            created_on : 'int',
            updated_on : 'int?',
           }
       }
}