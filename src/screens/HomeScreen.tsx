import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, View, Text, Button, Modal, TextInput, Alert, Image, Pressable, TouchableOpacity } from "react-native";
import { CALENDER_SCREEN, LOGIN_SCREEN, POSTS_SCREEN, TBL_EVENT, TBL_USER } from "../constants/constant";
import { useQuery, useRealm } from "@realm/react";
import { EventSchema } from "../models/EventSchema";
import { generateUniqId } from "../utils/appUtils";
import myStyles from "../../myStyles";
import { useAuth } from "../context/AuthContext";

function HomeScreen({ route }: any): React.JSX.Element {

    //const userId = route.params.userId
    const navigation = useNavigation();
    const [userID, setUserId] = useState(0)
    const eventData = useQuery(TBL_EVENT).filtered('user_id == $0', userID)
    const [isModalV, setModalV] = useState(false)
    const [isProfileModalV, setProfileModalV] = useState(false)

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
            <View style={{ flexDirection: 'row', height: 70, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>

                <TouchableOpacity onPress={() => { setProfileModalV(true) }}>
                    <Image source={require('../assets/icons/ic_user.png')} style={{ height: 35, width: 35, marginLeft: 10 }} />
                </TouchableOpacity>

                <Text style={{ fontSize: 24 }} numberOfLines={1} ellipsizeMode="tail">My Events</Text>

                <TouchableOpacity onPress={() => { navigation.navigate(CALENDER_SCREEN) }}>
                    <Image source={require('../assets/icons/ic_calender.png')} style={{ height: 35, width: 35, marginRight: 10 }} />
                </TouchableOpacity>



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
                <ModalView
                    userID={userID}
                    setModalV={setModalV} />
            </Modal>

            <Modal visible={isProfileModalV} transparent={true} >
                <ProfileModalView
                    userID={userID}
                    setModalVisible={setProfileModalV} />
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
                    created_on: cur_time

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

function ProfileModalView(props) {


    const [userData, setUserData] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const realm = useRealm()
    const navigation = useNavigation();
    const {setIsLogin} = useAuth()

    useEffect(() => {
        const user = realm.objectForPrimaryKey(TBL_USER, props.userID)
        setUserData(user)
        setName(user.name)
        setMobile(user.mobile)
        setEmail(user.email)
    }, [])

    function updateProfile() {

        if (userData) {
            realm.write(() => {
                userData.mobile = mobile,
                    userData.name = name,
                    userData.email = email
            })
        }
        props.setModalVisible(false)
    }

    async function logoutUser() {
        Alert.alert('Logout !', 'are you sure you want to Logout?',
            [
                {
                    text: 'Logout',
                    onPress: async () => {
                        setIsLogin(false)
                        await AsyncStorage.clear()
                        //navigation.replace(LOGIN_SCREEN)
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }

            ],
        )
    }

    return (
        <View style={myStyles.modalContainer}>
            <View style={myStyles.modalView}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 21 }}>My Profile</Text>

                    <Pressable onPress={() => { props.setModalVisible(false) }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/ic_cancel.png')} />
                    </Pressable>

                </View>

                <Image source={require('../assets/icons/ic_user.png')} style={{ height: 150, width: 150, marginRight: 10, alignSelf: 'center' }} />

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Name</Text>
                <TextInput
                    style={myStyles.inputText}
                    placeholder="Name"
                    value={name}
                    keyboardType="default"
                    onChangeText={(updValue) => { setName(updValue) }} />

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Mobile</Text>
                <TextInput
                    style={myStyles.inputText}
                    placeholder="Mobile Number"
                    value={mobile}
                    keyboardType="default"
                    onChangeText={(updValue) => { setMobile(updValue) }} />

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Email</Text>
                <TextInput
                    style={myStyles.inputText}
                    placeholder="Email Id"
                    value={email}
                    keyboardType="default"
                    onChangeText={(updValue) => { setEmail(updValue) }} />

                <View style={{ marginVertical: 10, marginHorizontal: 30, marginTop: 30 }}>
                    <Button
                        title="Update Profile"
                        onPress={() => {
                            updateProfile()
                        }} />
                </View>

                <TouchableOpacity onPress={() => { logoutUser() }} style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ color: 'red', fontSize: 20, margin: 10 }}>Logout</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
