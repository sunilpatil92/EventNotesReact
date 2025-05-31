import React, { useEffect, useState } from "react";
import { View, Text, Button, Modal, TextInput, Image, Pressable, TouchableOpacity } from "react-native";
import { TBL_POST } from "../constants/constant";
import { useRealm } from "@realm/react";
import { PostSchema } from "../models/PostSchema";
import { generateUniqId } from "../utils/appUtils";
import myStyles from "../../myStyles";

export function ModalAddPost(props) {

    const [postName, setPostName] = useState('')
    const [desc, setDesc] = useState('')
    const realm = useRealm()

    useEffect(() => {
        const fetchPostData = async () => {
            const post = await realm.objectForPrimaryKey(PostSchema, props.postId);
            if (post) {
                setPostName(post.post_name);
                setDesc(post.description);
            }
        };

        if (props.postId) {
            fetchPostData();
        }
    }, [])


    function addPost() {

        let title = '';
        const newId = generateUniqId(realm, PostSchema)
        const cur_time = Date.now();
        if (postName == '') {
            title = 'post_' + cur_time;
            setPostName(title)
        } else {
            title = postName
        }

        realm.write(() => {
            if (props.postId) {
                 const post = realm.objectForPrimaryKey(PostSchema, props.postId);
                    if (post) {
                        post.post_name = title;
                        post.description = desc;
                        post.favotite = 0; // default value
                        post.label_id = 0; // default value   
                        post.label_name = ''; // default value
                        post.updated_on = cur_time;     
                    }
                 
            }else{
 
                 realm.create(TBL_POST, {
                    id: newId,
                    user_id: props.userID,
                    event_id: props.eventId,
                    post_name: title,
                    description: desc,
                    favotite: 0, // default value
                    label_id: 0, // default value   
                    label_name: '', // default value
                    created_on: cur_time,
                    updated_on: cur_time
                })
            }

            props.setModalV(false)
        })
    }

    return (
        <View style={myStyles.modalContainer}>
            <View style={myStyles.modalView}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 21 }}>Add Post</Text>

                    <Pressable onPress={() => { props.setModalV(false) }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/ic_cancel.png')} />
                    </Pressable>

                </View>

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Post Name</Text>
                <TextInput
                    style={myStyles.inputText}
                    placeholder="Post Name"
                    value={postName}
                    keyboardType="default"
                    onChangeText={(updValue) => { setPostName(updValue) }} />

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Description</Text>
                <TextInput
                    style={myStyles.inputText}
                    placeholder="Description here"
                    value={desc}
                    keyboardType="default"
                    onChangeText={(updValue) => { setDesc(updValue) }} />

                <View style={{ marginVertical: 10, marginHorizontal: 30, marginTop: 30 }}>
                    <Button
                        title="Add Post"
                        onPress={() => {
                            addPost()
                        }} />
                </View>
            </View>
        </View>
    );
}