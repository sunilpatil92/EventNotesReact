import React, { useEffect, useState } from "react";
import { View, Text, Button, Modal, TextInput, Image, Pressable, TouchableOpacity } from "react-native";
import { TBL_POST } from "../constants/constant";
import { useRealm } from "@realm/react";
import { PostSchema } from "../models/PostSchema";
import { generateUniqId } from "../utils/appUtils";
import myStyles from "../../myStyles";
import { Dropdown } from "react-native-element-dropdown";

export function ModalAddPost(props) {

    const [postName, setPostName] = useState('')
    const [desc, setDesc] = useState('')
    const realm = useRealm()
    const [favorite, setFavorite] = useState(false)
    const [isForUpdate, setForUpdate] = useState(false)
    const [selectedLable, setLabel] = useState(null)
    const [isFocus, setIsFocus] = useState(false);
    const labelData = [
        {label : 'Add Label', value : 'add'},
        {label : 'Food', value : '1'},
        {label : 'Party', value : '2'},
       
    ]

    useEffect(() => {
        const fetchPostData = async () => {
            const post = await realm.objectForPrimaryKey(PostSchema, props.postId);
            if (post) {
                setPostName(post.post_name);
                setDesc(post.description);
                setForUpdate(true)
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

    const renderItem = (item) => {
        return (
            <View style={myStyles.dropDownBoxItem}>    
                {item.value === 'add' && <Image source={require('../assets/icons/ic_add.png')} style={{ width: 24, height: 24, marginRight: 5 }} />}
                <Text style={myStyles.dropDownTextItem}>{item.label}</Text>
            </View>
        );
    }

    const handleLabelChanges = (item) =>{
        if (item.value === 'add') {
            console.log("Add new label");
        }else {      
            setLabel(item.value);
            setIsFocus(false);
        }
    }

    return (
        <View style={myStyles.modalContainer}>
            <View style={myStyles.modalView}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 21 }}>{isForUpdate ? "Update Post" : "Add Post"}</Text>

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

                    

                <Pressable onPress={()=>{setFavorite(!favorite)}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginLeft:10, marginTop:10, marginBottom:10,marginRight:2,}}>
                        <Text style={{ fontSize: 14, }}>Make your Favorite</Text>
                        <Image style={{ width: 30, height: 30 }} source={
                        favorite ? 
                        require('../assets/icons/ic_favorite.png')
                        :
                        require('../assets/icons/ic_unfavorit.png')
                        } />
                    </View>
                </Pressable>

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Label</Text>
                <Dropdown
                     style = {{padding:8,margin:5, borderWidth:1, borderColor: 'black', borderRadius:10}} 
                     data={labelData}
                     value={selectedLable}
                     onFocus={() => setIsFocus(true)}
                     onBlur={() => setIsFocus(false)}
                     onChange={handleLabelChanges } 
                     placeholder={!isFocus ? 'Select item' : '...'}
                     labelField={"label"} 
                     valueField={"value"}
                     renderItem={renderItem} >
                </Dropdown>

                <View style={{ marginVertical: 10, marginHorizontal: 30, marginTop: 30 }}>
                    <Button
                        title =  {isForUpdate ? "Update Post" : "Add Post"}
                        onPress={() => {
                            addPost()
                        }} />
                </View>
            </View>
        </View>
    );
}