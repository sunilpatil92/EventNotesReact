import { Object } from "realm";
import { TBL_LABEL } from "../constants/constant";


export class LabelSchema extends Object {
  static schema = {
    name: TBL_LABEL,
    primaryKey: 'id',
    properties: {
       id : 'int',
       user_id : 'int',
       name: 'string',
    },
  };
}