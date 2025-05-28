import { useRealm } from "@realm/react";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { TBL_USER } from "../constants/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import myStyles from "../../myStyles";


function ProfileScreen(): React.JSX.Element {

    const [userData, setUserData] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const realm = useRealm()
    const { setIsLogin } = useAuth()

    useEffect(() => {

        AsyncStorage.getItem('userId').then(idStr => {
            const id = idStr !== null ? Number(idStr) : null;
            if (id !== null) {
                const user = realm.objectForPrimaryKey(TBL_USER, id)
                setUserData(user)
                setName(user.name)
                setMobile(user.mobile)
                setEmail(user.email)
            }
        });
    }, [])

    function updateProfile() {

        if (userData) {
            realm.write(() => {
                userData.mobile = mobile,
                    userData.name = name,
                    userData.email = email
            })
        }
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.')
    }

    async function logoutUser() {
        Alert.alert('Logout !', 'are you sure you want to Logout?',
            [
                {
                    text: 'Logout',
                    onPress: async () => {
                        setIsLogin(false)
                        await AsyncStorage.clear()
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
        <View style={{ flex: 1, marginHorizontal:20 }}>
            <View style={{ flexDirection: 'row', height: 70, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                <Text style={{ fontSize: 24 }} numberOfLines={1} ellipsizeMode="tail">My Profile</Text>
            </View>
            <View>

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

export default ProfileScreen;