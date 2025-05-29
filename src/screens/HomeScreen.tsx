import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, View, Text, Button, Modal, TextInput, Image, Pressable, TouchableOpacity } from "react-native";
import { POSTS_SCREEN, TBL_EVENT } from "../constants/constant";
import { useQuery, useRealm } from "@realm/react";
import { EventSchema } from "../models/EventSchema";
import { generateUniqId } from "../utils/appUtils";
import myStyles from "../../myStyles";
import { ModalAddEvent } from "../modals/ModalAddEvent";

function HomeScreen({ route }: any): React.JSX.Element {

    //const userId = route.params.userId
    const navigation = useNavigation();
    const [userID, setUserId] = useState(0)
    const eventData = useQuery(TBL_EVENT).filtered('user_id == $0', userID)
    const [isModalV, setModalV] = useState(false)

    useEffect(() => {
        getUserID()
    }, [])


    async function getUserID() {
        const id = await AsyncStorage.getItem('userId')
        if (id) {
            setUserId(parseInt(id))
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{marginStart:20, flexDirection: 'row', height: 70, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                <Text style={{ fontSize: 24 }} numberOfLines={1} ellipsizeMode="tail">My Events</Text>
            </View>

            {eventData && eventData.length > 0 ?
                (
                    <FlatList
                        data={eventData}
                        renderItem={(item) =>
                            <Pressable onPress={() => {
                                navigation.navigate(POSTS_SCREEN,
                                    {
                                        eventId: item.item.id,
                                        eventName: item.item.event_name
                                    })
                            }}>
                                <View style={myStyles.listItem}>
                                    <Text style={{ fontSize: 16 }}>{item.item.event_name}</Text>
                                </View>
                            </Pressable>
                        }
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ alignSelf: 'center' }}>No Data found</Text>
                        <Text style={{ alignSelf: 'center', fontSize: 10 }}>click + button to Add Event</Text>
                    </View>
                )
            }

            <TouchableOpacity style={myStyles.fab} onPress={() => { setModalV(true) }}>
                <Image source={require('../assets/icons/ic_add.png')} style={{ width: 70, height: 70 }} />
            </TouchableOpacity>

            <Modal visible={isModalV} transparent={true} >
                <ModalAddEvent
                    userID={userID}
                    evebtId={0}
                    setModalV={setModalV} />
            </Modal>

        </View>
    )

}

export default HomeScreen;


function ModalView(props) {

    const [eventName, setEventName] = useState('')
    const realm = useRealm()

    function addEvent() {

        let title = '';
        const newId = generateUniqId(realm, EventSchema)
        const cur_time = Date.now();
        if (eventName == '') {
            title = 'event_' + cur_time;
            setEventName(title);
        } else {
            title = eventName
        }
        //console.error(title)

        realm.write(() => {
            realm.create(TBL_EVENT,
                {
                    id: newId,
                    user_id: props.userID,
                    event_name: title,
                    description : '',
                    created_on: cur_time,
                    updated_on: cur_time,
                })
            props.setModalV(false)
        })
    }

    return (
        <View style={myStyles.modalContainer}>
            <View style={myStyles.modalView}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 21 }}>Add Events</Text>

                    <Pressable onPress={() => { props.setModalV(false) }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/ic_cancel.png')} />
                    </Pressable>

                </View>

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Event Name</Text>
                <TextInput
                    style={myStyles.inputText}
                    placeholder="Event Name"
                    value={eventName}
                    keyboardType="default"
                    onChangeText={(updValue) => { setEventName(updValue) }} />

                <View style={{ marginVertical: 10, marginHorizontal: 30, marginTop: 30 }}>
                    <Button
                        title="Add Event"
                        onPress={() => {
                            addEvent()
                        }} />
                </View>
            </View>
        </View>
    );
}
