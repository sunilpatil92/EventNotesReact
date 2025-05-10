import { Object } from "realm"
import { TBL_POST_DETAILS } from "../constants/constant"


export class PostDetailSchema extends Object {
       static schema = {
           name : TBL_POST_DETAILS,
           primaryKey : 'id',
           properties : {
            id : 'int',
            post_id : 'int',
            type : 'int',
            title : 'string',
            file_name : 'string',
            file_path : 'string',
            created_on : 'int',
           }
       }
}