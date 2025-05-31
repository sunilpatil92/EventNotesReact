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
import { ModalAddEvent } from "../modals/ModalAddEvent";
import { EventSchema } from "../models/EventSchema";
import { ModalAddPost } from "../modals/ModalAddPost";


function PostListScreen({ route }: any): React.JSX.Element {

    const navigation = useNavigation()
    const [eventId, setEventId] = useState(0)
    const postData = useQuery(TBL_POST).filtered('event_id == $0', eventId)
    const [isModalV, setModalV] = useState(false)
    const [isEventModalV, setEventModalV] = useState(false)
    const [userID, setUserId] = useState(0)
    const [eventName, setEventName] = useState('')
    const realm = useRealm()

    useEffect(() => {
        //console.error(route.params.eventId)
        setEventName(route.params.eventName)
        getUserID()
        setEventId(route.params.eventId)
    }, [])

     useEffect(() => {
            const fetchEventData = async () => {
                  const event = await realm.objectForPrimaryKey(EventSchema, route.params.eventId);
                    if (event) {
                       setEventName(event.event_name);
                    }     
             };

             fetchEventData();
             
        },[isModalV])

    async function getUserID() {
        const id = await AsyncStorage.getItem('userId')
        if (id) {
            setUserId(parseInt(id))
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', height: 70, padding: 10 }}>
                <Pressable style = {{flex:1, alignItems : 'flex-start',justifyContent:'center'}} onPress={() => { navigation.pop() }} >
                    <Image style={{ width: 30, height: 30,alignContent:'center' }} source={require('../assets/icons/ic_back.png')} />
                </Pressable>
                <Text style={{ fontSize: 24, marginLeft: 20,flex:8,  alignItems:'center', alignSelf:'center'  }} numberOfLines={1} ellipsizeMode="tail">{eventName}</Text>
                <Pressable style = {{flex:1, alignItems : 'flex-end',justifyContent:'center'}} onPress={() => {
                     setEventModalV(true)       
                 }} >
                    <Image style={{ width: 30, height: 30, margin: 5 }} source={require('../assets/icons/ic_edit.png')} />
                </Pressable>
            </View>

            {postData && postData.length > 0 ? (
                <FlatList
                    data={postData}
                    renderItem={(item) =>
                        <Pressable onPress={() => {
                            //console.error(item.item.id)
                            navigation.navigate(POST_DETAIL_SCREEN, { id: item.item.id, name: item.item.post_name, eventId : eventId })
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
                <ModalAddPost 
                    userID={userID}
                    eventId={eventId}
                    postId = {0}
                    setModalV={setModalV} />
            </Modal>

            <Modal visible={isEventModalV} transparent={true} >
                <ModalAddEvent
                    userID={userID}
                    eventId={eventId}
                    setModalV={setEventModalV} />
            </Modal>

        </View>
    );
}

export default PostListScreen;