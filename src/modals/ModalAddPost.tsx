import React, { useEffect, useState } from "react";
import { View, Text, Button, Modal, TextInput, Image, Pressable, TouchableOpacity, Alert } from "react-native";
import { TBL_LABEL, TBL_POST } from "../constants/constant";
import { useQuery, useRealm } from "@realm/react";
import { PostSchema } from "../models/PostSchema";
import { generateUniqId } from "../utils/appUtils";
import myStyles from "../../myStyles";
import { Dropdown } from "react-native-element-dropdown";
import { LabelSchema } from "../models/LabelSchema";

export function ModalAddPost(props) {

    const [userID, setUserId] = useState(null)
    const [postName, setPostName] = useState('')
    const [desc, setDesc] = useState('')
    const realm = useRealm()
    const [favorite, setFavorite] = useState(false)
    const [isForUpdate, setForUpdate] = useState(false)
    const [selectedLableId, setLabelId] = useState(null)
    const [selectedLable, setLabel] = useState(null)
    const [isFocus, setIsFocus] = useState(false);
    const labelRoomData = useQuery(TBL_LABEL).filtered('user_id == $0', props.userID);  
    const [labelData, setLabelData] = useState([])
    const [isLabelViewVisi,setIsLabelViewVisi] = useState(false)
    const [labelName, setLabelName] = useState('')

    useEffect(() => {
        setUserId(props.userID)
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

    useEffect(() => {
        loadLabelFromRealm();
        labelRoomData.addListener(loadLabelFromRealm)

        return () =>{ labelRoomData.removeListener(loadLabelFromRealm)}
    }, [])     

    function loadLabelFromRealm() {
       let dbLabels =[]
            dbLabels.push({label : 'Add Label', value : 'add'})
        if (labelRoomData.length > 0) {
            setIsLabelViewVisi(false);
            labelRoomData.forEach((item) => {
                const newItem = {label : item.name, value : item.id}
                dbLabels.push(newItem)
            })
        }
        setLabelData(dbLabels)
    }
    

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
                        post.label_id = selectedLableId; 
                        post.label_name = selectedLable; 
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
                    label_id: selectedLableId,  
                    label_name: selectedLable, 
                    created_on: cur_time,
                    updated_on: cur_time
                })
            }

            props.setModalV(false)
        })
    }

    function addLabelInRoom() {
        const newId = generateUniqId(realm, LabelSchema)
        const cur_time = Date.now();
        if (labelName == '') {
           return Alert.alert('Please enter label name');
        }

        realm.write(() => {
            realm.create(TBL_LABEL, {
                    id: newId,
                    user_id: userID,
                    name: labelName,
                })
            setIsLabelViewVisi(false);
        })
        setLabelName('')
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
            //console.log("Add new label");
            setIsLabelViewVisi(true);
        }else {      
            setLabel(item.label);
            setLabelId(item.value)
            setIsFocus(false);
        }
    }

    return (
        <View style={myStyles.modalContainer}>
            <View style={myStyles.modalView}>

            {
             (isLabelViewVisi) ? (

                <View style={{flexDirection : 'column'}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 21 }}>Add Labels</Text>

                        <Pressable onPress={() => {  setIsLabelViewVisi(false); }}>
                            <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/ic_cancel.png')} />
                        </Pressable>
                    </View>

                    <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Label Name</Text>
                    <TextInput
                        style={myStyles.inputText}
                        placeholder="Label Name"
                        value={labelName}
                        keyboardType="default"
                        onChangeText={(updValue) => { setLabelName(updValue) }} />

                    <View style={{ marginVertical: 10, marginHorizontal: 30, marginTop: 30 }}>
                        <Button
                            title =  'Submit'
                            onPress={() => {
                                addLabelInRoom()
                            }} />
                    </View>
                </View>

             ) : 
             (

              <View style = {{flexDirection:'column'}}>
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

             )
            }

                
            </View>
        </View>
    );
}

