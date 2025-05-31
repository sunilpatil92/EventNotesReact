import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, View, Text, Modal, Image, Pressable, TouchableOpacity } from "react-native";
import { POSTS_SCREEN, TBL_EVENT } from "../constants/constant";
import { useQuery, useRealm } from "@realm/react";
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
                    eventId={0}
                    setModalV={setModalV} />
            </Modal>

        </View>
    )

}

export default HomeScreen;
