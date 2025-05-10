import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, View, Text, Button, Modal, TextInput, Alert, Image, Pressable, TouchableOpacity } from "react-native";
import { POST_DETAIL_SCREEN, TBL_POST } from "../constants/constant";
import { useQuery, useRealm } from "@realm/react";
import { PostSchema } from "../models/PostSchema";
import { generateUniqId } from "../utils/appUtils";
import myStyles from "../../myStyles";
import { FloatingAction } from "react-native-floating-action";


function PostListScreen({ route }: any): React.JSX.Element {

    const navigation = useNavigation()
    const [eventId, setEventId] = useState(0)
    const postData = useQuery(TBL_POST).filtered('event_id == $0', eventId)
    const [isModalV, setModalV] = useState(false)

    useEffect(() => {
        //console.error(route.params.eventId)
        setEventId(route.params.eventId)
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', height: 70, justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                <Pressable onPress={() => { navigation.pop() }} >
                    <Image style={{ width: 30, height: 30, margin: 5 }} source={require('../assets/icons/ic_back.png')} />
                </Pressable>
                <Text style={{ fontSize: 24, marginLeft: 20, }} numberOfLines={1} ellipsizeMode="tail">{route.params.eventName}</Text>
            </View>

            {postData && postData.length > 0 ? (
                <FlatList
                    data={postData}
                    renderItem={(item) =>
                        <Pressable onPress={() => {
                            //console.error(item.item.id)
                            navigation.navigate(POST_DETAIL_SCREEN, { id: item.item.id, name: item.item.post_name })
                        }}>
                            <View style={myStyles.listItem}>
                                <Text style={{ fontSize: 16 }}>{item.item.post_name}</Text>
                            </View>
                        </Pressable>
                    }
                />
            ) :
                (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ alignSelf: 'center' }}>No Data found</Text>
                        <Text style={{ alignSelf: 'center', fontSize: 10 }}>click + button to Add Post</Text>
                    </View>

                )
            }

            <TouchableOpacity style={myStyles.fab} onPress={() => { setModalV(true) }}>
                <Image source={require('../assets/icons/ic_add.png')} style={{ width: 70, height: 70 }} />
            </TouchableOpacity>


            <Modal visible={isModalV} transparent={true} >
                <ModalView eventId={eventId}
                    postData={postData}
                    setModalV={setModalV} />
            </Modal>

        </View>
    );
}

export default PostListScreen;


function ModalView(props) {

    const [postName, setPostName] = useState('')
    const realm = useRealm()

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
            realm.create(TBL_POST,
                {
                    id: newId,
                    event_id: props.eventId,
                    post_name: title,
                    created_on: cur_time

                })
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

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Event Name</Text>
                <TextInput
                    style={myStyles.inputText}
                    placeholder="Post Name"
                    value={postName}
                    keyboardType="default"
                    onChangeText={(updValue) => { setPostName(updValue) }} />

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
