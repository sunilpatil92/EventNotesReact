import React, {useState } from "react";
import { View, Text, Button, TextInput, Image, Pressable } from "react-native";
import { TBL_EVENT } from "../constants/constant";
import { useRealm } from "@realm/react";
import { EventSchema } from "../models/EventSchema";
import { generateUniqId } from "../utils/appUtils";
import myStyles from "../../myStyles";

export function ModalAddEvent(props) {

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
