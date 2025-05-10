import { TBL_POST_DETAILS } from "../constants/constant"
import { generateUniqId } from "../utils/appUtils";
import { PostDetailSchema } from "../models/PostDetailSchema";


//const realm = useRealm()

export const addPostDetail = (realm : Realm, postId: any, pType: number,pTitle: string, fName: string, fPath: string) => {

    const newId = generateUniqId(realm, PostDetailSchema)
    const cur_time = Date.now();

    realm.write(() => {
        realm.create(TBL_POST_DETAILS, {
            id: newId,
            post_id: postId,
            type: pType,
            title: pTitle,
            file_name: fName,
            file_path: fPath,
            created_on: cur_time
        })
    })
}

export const updatePostDetail = (realm : Realm, itemId : number, updatePostItem)=>{

      realm.write(()=>{
        let postItem = realm.objectForPrimaryKey(TBL_POST_DETAILS,itemId);

        if(postItem){
            Object.keys(updatePostItem).forEach(key => {
                postItem[key] = updatePostItem[key]
            });
        }

      })
}