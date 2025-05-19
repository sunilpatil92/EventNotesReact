import React, { Component, useState } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { useQuery, useRealm } from "@realm/react";
import { UserSchema } from "../models/UserSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TBL_USER, HOME_SCREEN } from "../constants/constant";
import { generateUniqId } from "../utils/appUtils";
import { useAuth } from "../context/AuthContext";


function LoginScreen(): React.JSX.Element {

    const navigation = useNavigation()
    const realm = useRealm();
    const usersData = useQuery(UserSchema)
    const [mobile, setMobile] = useState('')
    const [otp, setOtp] = useState('')
    const {setIsLogin} = useAuth()


    const handleUserAuth = async () => {
        try {
            if (mobile.length != 10) {
                Alert.alert('Alert !!', 'please enter valid mobile number')
                return
            }
            if (otp.length <= 0) {
                Alert.alert('Alert !!', 'please enter OTP')
                return
            }

            let userId = generateUniqId(realm, UserSchema)
            const cur_time = Date.now();
            //console.error(userId, cur_time)

            const existUsers = realm.objects(TBL_USER).filtered('mobile == $0', mobile);
            //console.error(existUsers[0])


            if (existUsers.length <= 0) {
                realm.write(() => {
                    realm.create(TBL_USER,
                        {
                            id: userId,
                            mobile: mobile,
                            name: '',
                            email: '',
                            created_on: cur_time
                        }
                    )
                })
                console.error('new User Created: ', userId)
            } else {
                userId = existUsers[0].id
                console.error('Old User : ', userId)
            }

            await AsyncStorage.setItem('userId', userId + '')
            setMobile('')
            setOtp('')
            //navigation.replace('Home', { userId: userId })
            setIsLogin(true)

        } catch (error) {
            Alert.alert('something went wrong in Login', error.message)
        }
    }


    return (
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
            <Text style={{ alignSelf: 'center', fontSize: 30, marginVertical: 30 }}>Login User</Text>

            <TextInput
                placeholder="Enter Mobile"
                inputMode="tel"
                value={mobile}
                onChangeText={(value) => setMobile(value)}
                style={styles.inputText} />

            <TextInput
                placeholder="Enter OTP"
                inputMode="numeric"
                value={otp}
                onChangeText={(value) => setOtp(value)}
                style={styles.inputText} />

            <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                <Button title='Login' onPress={() => {
                    handleUserAuth()
                }} />
            </View>


        </View>
    )

}
export default LoginScreen;

const styles = StyleSheet.create({
    inputText: {
        borderColor: 'green',
        borderWidth: 2,
        margin: 10,
        borderRadius: 10,
        fontSize: 18,
        color: 'black'
    },
})